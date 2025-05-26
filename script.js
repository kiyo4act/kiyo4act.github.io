// script.js - プロフィール情報読み込み部分を削除/コメントアウト
document.addEventListener('DOMContentLoaded', function() {
    // --- Theme Switcher (変更なし) ---
    // ... (以前のコード) ...

    // --- Footer Year (変更なし) ---
    // ... (以前のコード) ...

    // --- Load Site Update Info (変更なし) ---
    // ... (以前のコード) ...

    // --- Load Profile Data ---
    // このセクションは、HTMLがActionsによって事前生成されるため、
    // クライアントサイドで再度DOMを書き換える必要は基本的になくなります。
    // もし何らかの理由でクライアントサイドでもデータを扱いたい場合は残しても良いですが、
    // 表示のためだけであればコメントアウトまたは削除します。
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
                // エラー時の処理 (HTMLにはフォールバック値が埋め込まれている想定)
                return;
            }
            // HTMLに既に埋め込まれているので、通常は不要
            // if (profileAvatarElement && data.avatarUrl) profileAvatarElement.src = data.avatarUrl;
            // if (profileNameElement && data.name) profileNameElement.textContent = data.name;
            // if (footerProfileNameElement && data.name) footerProfileNameElement.textContent = data.name;
            // if (profileBioElement && data.bio) profileBioElement.innerHTML = data.bio.replace(/\n/g, '<br>');
        })
        .catch(error => {
            console.error('Error loading profile-data.json (client-side, should be pre-filled):', error);
        });
    */
    
    // --- Tools List (変更なし) ---
    // ... (以前のコード) ...
});
