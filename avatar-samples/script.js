// テーマ切り替え機能（プロフィールページと同様の実装）
function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

// アバタースタイル切り替え機能
function initializeAvatarStyleSwitcher() {
  const sampleCards = document.querySelectorAll('.sample-card.clickable');
  const previewWrapper = document.querySelector('.preview-section .profile-avatar-wrapper');
  const currentStyleName = document.querySelector('#current-style-name');

  if (!previewWrapper) {
    console.error('Preview wrapper not found');
    return;
  }

  // プレビューと同じ画像をテスト用デザインにも適用
  syncTestDesignImages();

  sampleCards.forEach(card => {
    card.addEventListener('click', function() {
      const styleClass = this.getAttribute('data-style');
      const styleName = this.getAttribute('data-style-name');

      if (styleClass && previewWrapper) {
        // 既存のラッパークラスをすべて削除（ただしprofile-avatar-wrapperは保持）
        previewWrapper.className = 'profile-avatar-wrapper';

        // 新しいスタイルクラスを追加
        previewWrapper.classList.add(styleClass);

        // スタイル名を更新
        if (currentStyleName && styleName) {
          currentStyleName.textContent = styleName;
        }

        // アクティブ状態の更新
        document.querySelectorAll('.sample-card').forEach(c => {
          c.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });
}

// テスト用デザインの画像をプレビューと同期
function syncTestDesignImages() {
  const previewAvatar = document.querySelector('#preview-avatar .profile-image');
  const testDesignImages = document.querySelectorAll('.samples-grid .avatar-img');

  if (previewAvatar && testDesignImages.length > 0) {
    const previewSrc = previewAvatar.src;
    testDesignImages.forEach(img => {
      img.src = previewSrc;
    });
  }
}

// 画像アップロード機能
let originalAvatarSrc = null;
let originalBannerStyle = null;

function initializeImageUpload() {
  const previewAvatar = document.querySelector('#preview-avatar .profile-image');
  const bannerElement = document.querySelector('.profile-cover-image');

  if (previewAvatar) {
    originalAvatarSrc = previewAvatar.src;

    // アバター画像クリックでアップロード
    previewAvatar.style.cursor = 'pointer';
    previewAvatar.title = 'クリックして画像を変更';

    previewAvatar.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            previewAvatar.src = e.target.result;
            // テスト用デザインの画像も更新
            syncTestDesignImages();
            // 元に戻すボタンを表示
            showResetButton('avatar');
          };
          reader.readAsDataURL(file);
        }
      });

      input.click();
    });
  }

  if (bannerElement) {
    originalBannerStyle = bannerElement.style.backgroundImage;

    // バナー画像クリックでアップロード
    bannerElement.style.cursor = 'pointer';
    bannerElement.title = 'クリックしてバナー画像を変更';

    bannerElement.addEventListener('click', function() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            bannerElement.style.backgroundImage = `url(${e.target.result})`;
            // 元に戻すボタンを表示
            showResetButton('banner');
          };
          reader.readAsDataURL(file);
        }
      });

      input.click();
    });
  }
}

// 元に戻すボタンの表示
function showResetButton(type) {
  let resetContainer = document.getElementById('reset-buttons');
  if (!resetContainer) {
    resetContainer = document.createElement('div');
    resetContainer.id = 'reset-buttons';
    resetContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000;';
    document.body.appendChild(resetContainer);
  }

  const buttonId = `reset-${type}`;
  if (!document.getElementById(buttonId)) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = type === 'avatar' ? 'アバターを元に戻す' : 'バナーを元に戻す';
    button.style.cssText = 'display: block; margin: 5px 0; padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;';

    button.addEventListener('click', function() {
      if (type === 'avatar') {
        const previewAvatar = document.querySelector('#preview-avatar .profile-image');
        if (previewAvatar && originalAvatarSrc) {
          previewAvatar.src = originalAvatarSrc;
          // テスト用デザインの画像も元に戻す
          syncTestDesignImages();
        }
      } else if (type === 'banner') {
        const bannerElement = document.querySelector('.profile-cover-image');
        if (bannerElement) {
          bannerElement.style.backgroundImage = originalBannerStyle || '';
        }
      }
      button.remove();
    });

    resetContainer.appendChild(button);
  }
}

// スタイルをリセットする機能
function addStyleResetButton() {
  const currentStyleInfo = document.querySelector('.current-style-info');
  if (currentStyleInfo) {
    const resetButton = document.createElement('button');
    resetButton.id = 'reset-style-btn';
    resetButton.textContent = 'スタイルなしに戻す';
    resetButton.style.cssText = 'margin-left: 15px; padding: 8px 15px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;';

    resetButton.addEventListener('click', function() {
      const previewWrapper = document.querySelector('.preview-section .profile-avatar-wrapper');
      const currentStyleName = document.querySelector('#current-style-name');

      if (previewWrapper) {
        // すべてのスタイルクラスを削除
        previewWrapper.className = 'profile-avatar-wrapper';

        // スタイル名を更新
        if (currentStyleName) {
          currentStyleName.textContent = 'スタイルなし';
        }

        // アクティブ状態をすべて解除
        document.querySelectorAll('.sample-card').forEach(c => {
          c.classList.remove('active');
        });
      }
    });

    // 既存のボタンがなければ追加
    if (!document.getElementById('reset-style-btn')) {
      currentStyleInfo.appendChild(resetButton);
    }
  }
}

// 初期化処理
document.addEventListener('DOMContentLoaded', function() {
  // テーマ設定の初期化
  const themeToggleButton = document.getElementById('theme-switcher-btn');
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
  }

  // アバタースタイル切り替え機能を初期化
  initializeAvatarStyleSwitcher();

  // 画像アップロード機能を初期化
  initializeImageUpload();

  // スタイルリセットボタンを追加
  addStyleResetButton();
});
