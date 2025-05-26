// script.js - Discordコピペ・トースト通知機能追加版
document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Switcher (変更なし) ---
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const themeIcon = document.getElementById('theme-icon'); 
    function updateThemeIcon(theme) { 
        if (themeIcon) {
            if (theme === 'dark') { themeIcon.className = 'fa-solid fa-moon'; } 
            else { themeIcon.className = 'fa-solid fa-sun'; }
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
        .then(data => { /* ... (変更なし) ... */ })
        .catch(error => { /* ... (変更なし) ... */ });

    // --- Load Profile Data (コメントアウトのまま変更なし) ---
    /* ... */


    // --- Discord ID Copy and Toast Notification ---
    const discordCopyTrigger = document.getElementById('discord-copy-trigger');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message) {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // 表示アニメーションのため少し遅延させる
        setTimeout(() => {
            toast.classList.add('show');
        }, 10); // 10ミリ秒

        // 3秒後にトーストを消す
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide'); // フェードアウト用クラス (CSSで定義)
            // アニメーション完了後に要素を削除
            toast.addEventListener('transitionend', () => {
                if (toast.parentNode === toastContainer) { // まだ親要素がtoastContainerである場合のみ削除
                    toastContainer.removeChild(toast);
                }
            }, { once: true }); // イベントリスナーを一度だけ実行
        }, 3000); 
    }

    if (discordCopyTrigger) {
        discordCopyTrigger.addEventListener('click', function() {
            const discordIdToCopy = 'kiyo4act'; // @なしのID
            navigator.clipboard.writeText(discordIdToCopy)
                .then(() => {
                    showToast('Discord IDをコピーしました！');
                })
                .catch(err => {
                    console.error('Discord IDのコピーに失敗しました:', err);
                    showToast('IDのコピーに失敗しました。');
                });
        });
        // Enterキーでもコピーできるように
        discordCopyTrigger.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' || event.keyCode === 13) {
                this.click();
            }
        });
    }

});
