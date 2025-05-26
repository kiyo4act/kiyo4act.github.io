# scripts/get_profile.py
import json
import os
import requests # requestsライブラリが必要です (Actionsでインストールします)

def fetch_github_profile():
    # ワークフローから環境変数経由でGitHubユーザー名とトークンを取得
    username = os.environ.get('TARGET_GH_USERNAME_FROM_WORKFLOW')
    token = os.environ.get('GH_TOKEN_FROM_WORKFLOW') # GITHUB_TOKENを使用
    
    # デフォルトの出力データ構造
    output_data = { 
        'avatarUrl': '', 
        'name': username if username else '（ユーザー名未設定）', # usernameが取れなければフォールバック
        'bio': '', 
        'error': None 
    }

    if not username:
        error_message = "Error: TARGET_GH_USERNAME_FROM_WORKFLOW environment variable is not set."
        print(error_message)
        output_data['error'] = error_message
        output_data['bio'] = '設定エラー: GitHubユーザー名がワークフローに指定されていません。'
        return output_data

    api_url = f'https://api.github.com/users/{username}'
    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': f'Bearer {token}' # GITHUB_TOKENはBearerトークンとして使用
    }

    print(f"Fetching GitHub profile for user: {username}")
    print(f"API URL: {api_url}")

    try:
        response = requests.get(api_url, headers=headers, timeout=15) # タイムアウトを15秒に設定
        print(f"API Response Status: {response.status_code}")
        # デバッグ用にレスポンスヘッダーの一部を表示 (レート制限情報など)
        # print(f"API Rate Limit Remaining: {response.headers.get('X-RateLimit-Remaining')}") 
        
        response.raise_for_status()  # HTTPエラーコード(4xx, 5xx)の場合、例外を発生させる
        
        api_data = response.json()
        
        output_data['avatarUrl'] = api_data.get('avatar_url', '')
        # nameがAPIレスポンスにない、またはnullの場合は、login名(ユーザーID)を使用
        output_data['name'] = api_data.get('name') if api_data.get('name') else api_data.get('login', username)
        output_data['bio'] = api_data.get('bio', '') # bioがnullなら空文字列

    except requests.exceptions.HTTPError as e:
        error_message = f"HTTP error fetching profile: {e.response.status_code} - {e.response.reason}. URL: {api_url}"
        print(error_message)
        # レスポンスボディも表示してみる (エラー詳細がわかる場合がある)
        # print(f"Response body: {e.response.text[:500] if e.response else 'No response body'}")
        output_data['error'] = error_message
        output_data['bio'] = f'GitHubプロフィールの読み込みに失敗しました (HTTPエラー {e.response.status_code})。ユーザー名や権限を確認してください。'
    except requests.exceptions.RequestException as e: # タイムアウトやネットワークエラーなど
        error_message = f"Request error fetching profile: {e}. URL: {api_url}"
        print(error_message)
        output_data['error'] = error_message
        output_data['bio'] = 'GitHubプロフィールの読み込みに失敗しました (接続エラー等)。ネットワーク状況を確認してください。'
    except Exception as e_generic: # その他の予期せぬエラー
        error_message = f"An unexpected error occurred: {e_generic}. URL: {api_url}"
        print(error_message)
        output_data['error'] = error_message
        output_data['bio'] = '予期せぬエラーにより、プロフィールの読み込みに失敗しました。'
    
    return output_data

if __name__ == "__main__":
    profile_info = fetch_github_profile()
    
    # profile-data.json ファイルに出力
    output_file_path = 'profile-data.json'
    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(profile_info, f, indent=2, ensure_ascii=False)

    print(f"Generated {output_file_path}:")
    # 生成された内容をコンソールにも出力（デバッグ用）
    with open(output_file_path, 'r', encoding='utf-8') as f_read:
        print(f_read.read())
