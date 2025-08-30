// tools-loader.js
document.addEventListener('DOMContentLoaded', function() {
    const toolsListContainer = document.getElementById('tools-list-container');
    const toolsJsonPath = '/Tools/tools-list.json'; // ToolsリポジトリのJSONへのパス

    // ダミーデータ（JSON読み込み失敗時や開発初期用）
    const dummyToolsData = [
        { name: "プレースホルダーツール１ (ローカル)", url: "#", description: "これはJavaScriptで表示されているダミーのツール情報です。実際のデータは tools-list.json から読み込まれます。", lastUpdated: "2025-01-01" },
        { name: "プレースホルダーツール２ (ローカル)", url: "#", description: "デザインやレイアウト確認のための、もう一つのダミーデータです。", lastUpdated: "2025-01-15" }
    ];

    function displayTools(tools) {
        if (!toolsListContainer) {
            console.error('Error in tools-loader.js: tools-list-container element not found.');
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
            // カード全体をリンクにする
            let toolHtml = `<a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="tool-link">`;
            toolHtml += `<h3>${tool.name || '名称未設定'}</h3>`;
            if (tool.description) {
                toolHtml += `<p>${tool.description}</p>`;
            }
            if (tool.lastUpdated) {
                toolHtml += `<p class="tool-meta">最終更新: ${tool.lastUpdated}</p>`;
            }
            toolHtml += `</a>`;
            li.innerHTML = toolHtml;
            ul.appendChild(li);
        });

        toolsListContainer.innerHTML = ''; // 「読み込み中...」メッセージをクリア
        toolsListContainer.appendChild(ul);
    }

    // toolsListContainer要素が存在する場合のみ、ツールリストの読み込み処理を実行
    if (toolsListContainer) {
        fetch(toolsJsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${toolsJsonPath} in tools-loader.js. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data && Array.isArray(data)) {
                    displayTools(data);
                } else {
                    console.warn('Received data is not a valid array for tools in tools-loader.js. Displaying dummy data instead.', data);
                    toolsListContainer.innerHTML = '<p>ツール情報の形式が正しくありません。ダミーデータを表示します。</p>';
                    displayTools(dummyToolsData); // ダミーデータを表示
                }
            })
            .catch(error => {
                console.error('Error loading tools from tools-list.json in tools-loader.js:', error);
                toolsListContainer.innerHTML = `<p>ツールの読み込みに失敗しました (${error.message})。代わりにダミーデータを表示します。</p>`;
                displayTools(dummyToolsData); // エラー時はダミーデータを表示
            });
    } else {
        // console.log("tools-loader.js: tools-list-container not found on this page, skipping tools loading.");
        // ツールリストを表示するコンテナがないページでは何もしない (今回は必ず存在する想定)
    }
});
