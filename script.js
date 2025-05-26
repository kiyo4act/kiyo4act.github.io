// script.js - 改訂版 (ツールリストローダー機能は tools-loader.js に分離)
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

    // --- Load Profile Data (HTMLに事前生成されるため、クライアントサイドでのDOM操作は不要) ---
    /*
    const profileAvatarElement = document.getElementById('profile-avatar');
    // ... (以前コメントアウトしたプロフィールデータ読み込み処理はそのままコメントアウト) ...
    fetch(profileDataJsonPath)
        // ...
        .catch(error => {
            // ...
        });
    */
});
