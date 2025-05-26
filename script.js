// script.js
document.addEventListener('DOMContentLoaded', function() {
    // フッターの年を自動更新
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    const toolsListContainer = document.getElementById('tools-list-container');
    
    // tools-list.json のパス (カスタムドメイン kiyo.link の場合、 /Tools/tools-list.json を指します)
    const toolsJsonPath = '/Tools/tools-list.json'; 

    // ダミーデータ（JSON読み込み失敗時や開発初期用）
    const dummyToolsData = [
        {
            "name": "プレースホルダーツール１",
            "url": "#",
            "description": "これはJavaScriptで表示されているダミーのツール情報です。実際のデータは tools-list.json から読み込まれます。",
            "lastUpdated": "2025-01-01"
        },
        {
            "name": "プレースホルダーツール２",
            "url": "#",
            "description": "デザインやレイアウト確認のための、もう一つのダミーデータです。",
            "lastUpdated": "2025-01-15"
        }
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

            // リンクは target="_blank" rel="noopener noreferrer" で新しいタブで安全に開く
            let toolHtml = `<h3><a href="${tool.url}" target="_blank" rel="noopener noreferrer">${tool.name || '名称未設定'}</a></h3>`;
            
            if (tool.description) {
                toolHtml += `<p>${tool.description}</p>`;
            }
            if (tool.lastUpdated) {
                toolHtml += `<p class="tool-meta">最終更新: ${tool.lastUpdated}</p>`;
            }
            // 必要であればパスも表示:
            // if (tool.path) {
            //     toolHtml += `<p class="tool-meta">パス: ${tool.path}</p>`;
            // }
            li.innerHTML = toolHtml;
            ul.appendChild(li);
        });
        
        toolsListContainer.innerHTML = ''; // 「読み込み中...」メッセージをクリア
        toolsListContainer.appendChild(ul);
    }

    // tools-list.json を取得してツールリストを表示
    fetch(toolsJsonPath)
        .then(response => {
            if (!response.ok) {
                // レスポンスがエラーの場合 (404 Not Found など)
                throw new Error(`Failed to fetch ${toolsJsonPath}. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && Array.isArray(data)) {
                displayTools(data); // 取得したデータを表示
            } else {
                // JSON形式が不正または配列でない場合
                console.warn('Received data is not a valid array. Displaying dummy data instead.', data);
                toolsListContainer.innerHTML = '<p>ツール情報の形式が正しくありません。ダミーデータを表示します。</p>';
                displayTools(dummyToolsData);
            }
        })
        .catch(error => {
            // ネットワークエラーやその他の問題
            console.error('Error loading tools from tools-list.json:', error);
            toolsListContainer.innerHTML = `<p>ツールの読み込みに失敗しました (${error.message})。代わりにダミーデータを表示します。</p>`;
            displayTools(dummyToolsData); // エラー時はダミーデータを表示
        });
});
