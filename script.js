// script.js - 更新版
document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Switcher (既存のまま) ---
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', initialTheme);

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', function() {
            let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Footer Year (既存のまま) ---
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Load Site Update Info ---
    const pageLastUpdatedElement = document.getElementById('page-last-updated');
    const updateInfoJsonPath = './update-info.json'; // Actionsで生成されるファイルへのパス

    fetch(updateInfoJsonPath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch ${updateInfoJsonPath}. Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (pageLastUpdatedElement && data.lastUpdated) {
                const lastUpdatedDate = new Date(data.lastUpdated);
                // ブラウザのロケールに合わせた日付と時刻の書式
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
                try {
                    pageLastUpdatedElement.textContent = lastUpdatedDate.toLocaleString(undefined, options);
                } catch (e) { // 古いブラウザなどでtoLocaleStringが複雑なオプションに対応していない場合
                    pageLastUpdatedElement.textContent = lastUpdatedDate.toISOString().substring(0, 16).replace('T', ' ');
                }
            } else if (pageLastUpdatedElement) {
                pageLastUpdatedElement.textContent = '更新日情報なし';
            }
        })
        .catch(error => {
            console.error('Error loading update-info.json:', error);
            if (pageLastUpdatedElement) {
                pageLastUpdatedElement.textContent = '更新日取得失敗';
            }
        });

    // --- Load Profile Data ---
    const profileAvatarElement = document.getElementById('profile-avatar');
    const profileNameElement = document.getElementById('profile-name-display');
    const profileBioElement = document.getElementById('profile-bio-display');
    const footerProfileNameElement = document.getElementById('footer-profile-name'); // フッター用
    const profileDataJsonPath = './profile-data.json'; // Actionsで生成されるファイルへのパス

    fetch(profileDataJsonPath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch ${profileDataJsonPath}. Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error in profile-data.json from GitHub Actions:', data.error);
                // エラーメッセージをbioに表示するなどの対応も可能
                if (profileBioElement) profileBioElement.textContent = data.bio || 'プロフィールの読み込み中にエラーが発生しました。';
                // 名前はフォールバック値（ユーザー名）が設定されているはずなので表示
                if (profileNameElement && data.name) profileNameElement.textContent = data.name;
                if (footerProfileNameElement && data.name) footerProfileNameElement.textContent = data.name;
                return;
            }

            if (profileAvatarElement && data.avatarUrl) {
                profileAvatarElement.src = data.avatarUrl;
                // Altテキストも更新するとより良い
                profileAvatarElement.alt = `${data.name || 'プロフィール'}の画像`;
            }
            if (profileNameElement && data.name) {
                profileNameElement.textContent = data.name;
            }
            if (footerProfileNameElement && data.name) { // フッターの名前も更新
                footerProfileNameElement.textContent = data.name;
            }
            if (profileBioElement) { // bioが空文字列の場合も許容
                profileBioElement.textContent = data.bio || ""; // bioがnullやundefinedなら空文字に
            }
        })
        .catch(error => {
            console.error('Error loading profile-data.json:', error);
            // 既存のHTMLプレースホルダーが表示されたままになるか、エラーメッセージを表示
            if (profileBioElement) profileBioElement.textContent = 'GitHubプロフィールの読み込みに失敗しました。';
        });

    // --- Tools List (既存のまま) ---
    const toolsListContainer = document.getElementById('tools-list-container');
    const toolsJsonPath = '/Tools/tools-list.json'; 

    const dummyToolsData = [ /* ... (ダミーデータは変更なし) ... */ ];
    function displayTools(tools) { /* ... (displayTools関数は変更なし) ... */ }

    fetch(toolsJsonPath)
        .then(response => { /* ... (ツールリストのfetch処理は変更なし) ... */ })
        .then(data => { /* ... (ツールリストのデータ処理は変更なし) ... */ })
        .catch(error => { /* ... (ツールリストのエラー処理は変更なし) ... */ });
});
