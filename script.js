// script.js - テーマ切り替えアイコン対応版
document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Switcher ---
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const themeIcon = document.getElementById('theme-icon'); // アイコン要素を取得

    // テーマに基づいてアイコンを更新する関数
    function updateThemeIcon(theme) { // theme は 'light' または 'dark'
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fa-solid fa-moon'; // ダークモード時は月のアイコン
            } else {
                themeIcon.className = 'fa-solid fa-sun';  // ライトモード時は太陽のアイコン
            }
        }
    }
    
    // 初期テーマ設定
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentActiveTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', currentActiveTheme);
    updateThemeIcon(currentActiveTheme); // 初期アイコンを設定

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', function() {
            // 現在のテーマを取得し、新しいテーマに切り替え
            let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme); // 切り替え後のテーマでアイコンを更新
        });
    }

    // --- Footer Year (変更なし) ---
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Load Site Update Info (変更なし) ---
    const pageLastUpdatedElement = document.getElementById('page-last-updated');
    const updateInfoJsonPath = './update-info.json'; 

    fetch(updateInfoJsonPath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch ${updateInfoJsonPath}. Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (pageLastUpdatedElement && data.lastUpdated) {
                const lastUpdatedDate = new Date(data.lastUpdated);
                const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' };
                try {
                    pageLastUpdatedElement.textContent = lastUpdatedDate.toLocaleString(undefined, options);
                } catch (e) { 
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

    // --- Load Profile Data (変更なし) ---
    const profileAvatarElement = document.getElementById('profile-avatar');
    const profileNameElement = document.getElementById('profile-name-display');
    const profileBioElement = document.getElementById('profile-bio-display');
    const footerProfileNameElement = document.getElementById('footer-profile-name');
    const profileDataJsonPath = './profile-data.json'; 

    fetch(profileDataJsonPath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch ${profileDataJsonPath}. Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Error in profile-data.json from GitHub Actions:', data.error);
                if (profileBioElement) profileBioElement.textContent = data.bio || 'プロフィールの読み込み中にエラーが発生しました。';
                if (profileNameElement && data.name) profileNameElement.textContent = data.name;
                if (footerProfileNameElement && data.name) footerProfileNameElement.textContent = data.name;
                return;
            }

            if (profileAvatarElement && data.avatarUrl) {
                profileAvatarElement.src = data.avatarUrl;
                profileAvatarElement.alt = `${data.name || 'プロフィール'}の画像`;
            }
            if (profileNameElement && data.name) {
                profileNameElement.textContent = data.name;
            }
            if (footerProfileNameElement && data.name) {
                footerProfileNameElement.textContent = data.name;
            }
            if (profileBioElement) {
                profileBioElement.textContent = data.bio || ""; 
            }
        })
        .catch(error => {
            console.error('Error loading profile-data.json:', error);
            if (profileBioElement) profileBioElement.textContent = 'GitHubプロフィールの読み込みに失敗しました。';
        });

    // --- Tools List (変更なし) ---
    const toolsListContainer = document.getElementById('tools-list-container');
    const toolsJsonPath = '/Tools/tools-list.json'; 

    const dummyToolsData = [
        { name: "プレースホルダーツール１ (ローカル)", url: "#", description: "これはJavaScriptで表示されているダミーのツール情報です。実際のデータは tools-list.json から読み込まれます。", lastUpdated: "2025-01-01" },
        { name: "プレースホルダーツール２ (ローカル)", url: "#", description: "デザインやレイアウト確認のための、もう一つのダミーデータです。", lastUpdated: "2025-01-15" }
    ];

    function displayTools(tools) {
        if (!toolsListContainer) {
            console.error('Error: tools-list-container element not found.');
            return;
        }
        if (!tools || tools.length === 0) {
            toolsListContainer.innerHTML = '<p>現在公開しているツールはありません。</p>';
            return;
        }
        const ul = document.createElement('ul');
        tools.forEach(tool => {
            const li = document.createElement('li');
            li.className = 'tool-item';
            let toolHtml = `<h3><a href="${tool.url}" target="_blank" rel="noopener noreferrer">${tool.name || '名称未設定'}</a></h3>`;
            if (tool.description) {
                toolHtml += `<p>${tool.description}</p>`;
            }
            if (tool.lastUpdated) {
                toolHtml += `<p class="tool-meta">最終更新: ${tool.lastUpdated}</p>`;
            }
            li.innerHTML = toolHtml;
            ul.appendChild(li);
        });
        
        toolsListContainer.innerHTML = '';
        toolsListContainer.appendChild(ul);
    }

    fetch(toolsJsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${toolsJsonPath}. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && Array.isArray(data)) {
                displayTools(data); 
            } else {
                console.warn('Received data is not a valid array for tools. Displaying dummy data instead.', data);
                toolsListContainer.innerHTML = '<p>ツール情報の形式が正しくありません。ダミーデータを表示します。</p>';
                displayTools(dummyToolsData);
            }
        })
        .catch(error => {
            console.error('Error loading tools from tools-list.json:', error);
            toolsListContainer.innerHTML = `<p>ツールの読み込みに失敗しました (${error.message})。代わりにダミーデータを表示します。</p>`;
            displayTools(dummyToolsData);
        });
});
