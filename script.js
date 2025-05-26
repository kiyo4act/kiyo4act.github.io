// script.js - Discordコピペ・トースト通知機能追加版 - 完全版
document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Switcher ---
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const themeIcon = document.getElementById('theme-icon'); 

    function updateThemeIcon(theme) { 
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fa-solid fa-moon'; 
            } else {
                themeIcon.className = 'fa-solid fa-sun';  
            }
        }
    }
    
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentActiveTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', currentActiveTheme);
    updateThemeIcon(currentActiveTheme);

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', function() {
            let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme); 
        });
    }

    // --- Footer Year ---
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

    // --- Load Profile Data (HTMLに事前生成されるため、クライアントサイドでのDOM操作は基本的に不要) ---
    /*
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
            console.error('Error loading profile-data.json (client-side, should be pre-filled):', error);
            if (profileBioElement) profileBioElement.textContent = 'GitHubプロフィールの読み込みに失敗しました。';
        });
    */

    // --- Discord ID Copy and Toast Notification ---
    const discordCopyTrigger = document.getElementById('discord-copy-trigger');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message) {
        if (!toastContainer) {
            // トーストコンテナがない場合は、一時的に作成するか、console.logで代替
            const tempToastContainer = document.createElement('div');
            tempToastContainer.id = 'toast-container';
            document.body.appendChild(tempToastContainer);
            // 再帰的に呼び出すか、あるいはこの関数内で処理を続ける
            // ここでは簡易的にconsole.logで代替
            console.warn("Toast container not found, creating one or logging to console:", message);
            // もし動的に生成したコンテナを使いたい場合は、toastContainer = tempToastContainer; として処理を続ける
            // ただし、CSSが適用される保証はないため、HTMLに最初からコンテナを記述しておくのが望ましい。
            // 今回はHTMLに記述済みなので、このelse ifは基本的には通らないはず。
            if(!document.getElementById('toast-container')) return; // 再度チェックしてなければ何もしない
        }


        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        
        // 古いトーストがあれば削除（複数同時表示を避ける場合）
        // while (toastContainer.firstChild) {
        //     toastContainer.removeChild(toastContainer.firstChild);
        // }
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10); 

        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            
            toast.addEventListener('transitionend', () => {
                // 親ノードが存在し、かつtoastがその子ノードである場合のみ削除
                if (toast.parentNode === toastContainer) {
                    toastContainer.removeChild(toast);
                }
            }, { once: true });
        }, 3000); 
    }

    if (discordCopyTrigger) {
        discordCopyTrigger.addEventListener('click', function() {
            const discordIdToCopy = 'kiyo4act'; 
            navigator.clipboard.writeText(discordIdToCopy)
                .then(() => {
                    showToast('Discord ID (kiyo4act) をコピーしました！');
                })
                .catch(err => {
                    console.error('Discord IDのコピーに失敗しました:', err);
                    // navigator.clipboardが使えない環境（httpなど）やユーザー拒否の場合
                    // 代替手段として手動コピーを促すメッセージも検討できる
                    showToast('IDのコピーに失敗しました。手動でコピーしてください: kiyo4act');
                });
        });
        discordCopyTrigger.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' || event.keyCode === 13) { // Enterキーでも動作
                event.preventDefault(); // ボタンやリンクではないのでデフォルト動作を抑制
                this.click();
            }
        });
    }
});
