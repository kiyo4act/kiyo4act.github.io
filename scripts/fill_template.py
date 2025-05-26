# scripts/fill_template.py
import json
import os
import html # HTMLエスケープ用

# データファイルのパス (ワークフローのルートからの相対パス)
profile_data_file = 'profile-data.json' 
# テンプレートファイルのパス
template_file = 'index.template.html' 
# 出力ファイル名
output_file = 'index.html' 

# 固定値 (サイトのURLはご自身のものに合わせてください)
SITE_URL = 'https://kiyo.bio/' 
# デフォルトOGP画像 (リポジトリの images/og-default.png に配置することを想定)
OG_IMAGE_DEFAULT_URL = f'{SITE_URL.rstrip("/")}/images/og-default.png' 

def main():
    profile_data = {}
    # プロフィールデータを読み込む
    try:
        with open(profile_data_file, 'r', encoding='utf-8') as f:
            profile_data = json.load(f)
    except FileNotFoundError:
        print(f"Warning: {profile_data_file} not found. Using default fallback data.")
        # フォールバック用の最小限のデータ
        profile_data = {
            'name': 'あなたの名前/活動名',
            'bio': 'あなたの活動を紹介するページです。',
            'avatarUrl': f'{SITE_URL.rstrip("/")}/images/profile.jpg' # デフォルトのプロフィール画像パス
        }
    except json.JSONDecodeError:
        print(f"Warning: Failed to decode {profile_data_file}. Using default fallback data.")
        profile_data = {
            'name': 'あなたの名前/活動名',
            'bio': 'あなたの活動を紹介するページです。',
            'avatarUrl': f'{SITE_URL.rstrip("/")}/images/profile.jpg'
        }

    # テンプレートファイルを読み込む
    try:
        with open(template_file, 'r', encoding='utf-8') as f:
            template_content = f.read()
    except FileNotFoundError:
        print(f"Error: Template file {template_file} not found. Cannot generate index.html.")
        return

    # プレースホルダーに設定する値を準備
    profile_name = html.escape(profile_data.get('name', 'あなたのリンク集')) # HTMLエスケープ
    profile_bio_raw = profile_data.get('bio', 'あなたの活動を紹介するページです。')
    
    # meta description用にbioを調整 (例: 最初の120文字程度、改行除去)
    meta_description_text = html.escape(profile_bio_raw.replace('\n', ' ').strip()[:120] + "...") if profile_bio_raw else 'あなたの活動を紹介するページです。'
    
    # プロフィールbio表示用に改行を<br>に変換し、HTMLエスケープ
    profile_bio_html = html.escape(profile_bio_raw).replace('\n', '<br>\n')


    # OGP画像はアバターがあればそれを使い、なければデフォルト画像
    og_image_url = profile_data.get('avatarUrl') if profile_data.get('avatarUrl') else OG_IMAGE_DEFAULT_URL
    # プロフィール画像も同様
    profile_avatar_url = profile_data.get('avatarUrl') if profile_data.get('avatarUrl') else f'{SITE_URL.rstrip("/")}/images/profile.jpg'


    replacements = {
        "{{ PAGE_TITLE }}": f"{profile_name} | リンク集", # ページタイトル
        "{{ META_DESCRIPTION }}": meta_description_text,
        "{{ OG_TITLE }}": f"{profile_name} | Link Collection", # OGPタイトル (英語併記なども検討可)
        "{{ OG_DESCRIPTION }}": meta_description_text, # OGP説明
        "{{ SITE_URL }}": SITE_URL,
        "{{ OG_IMAGE_URL }}": og_image_url,
        "{{ PROFILE_AVATAR_URL }}": profile_avatar_url,
        "{{ PROFILE_NAME }}": profile_name,
        "{{ PROFILE_BIO_HTML }}": profile_bio_html 
    }

    output_content = template_content
    for placeholder, value in replacements.items():
        # valueがNoneの場合は空文字で置換 (HTMLエスケープは各値準備時に行う)
        output_content = output_content.replace(placeholder, value if value is not None else '')

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(output_content)
    
    print(f"Successfully generated {output_file} from {template_file} using data from {profile_data_file}")

if __name__ == "__main__":
    main()
