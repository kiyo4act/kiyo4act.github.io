// tools-loader.js
document.addEventListener('DOMContentLoaded', function() {
    const toolsListContainer = document.getElementById('tools-list-container');
    const toolsJsonPath = '/Tools/tools-list.json'; // ToolsリポジトリのJSONへのパス

    // ダミーデータ（JSON読み込み失敗時や開発初期用）
    const dummyToolsData = [
        { name: "プレースホルダーツール１ (ローカル)", url: "#", description: "これはJavaScriptで表示されているダミーのツール情報です。実際のデータは tools-list.json から読み込まれます。", lastUpdated: "2025-01-01", category: "その他" },
        { name: "プレースホルダーツール２ (ローカル)", url: "#", description: "デザインやレイアウト確認のための、もう一つのダミーデータです。", lastUpdated: "2025-01-15", category: "その他" }
    ];

    let allToolsData = []; // フィルタ用に全データを保持
    let activeCategory = null; // 現在選択中のカテゴリ
    let searchQuery = ''; // 現在の検索クエリ

    // カテゴリ一覧を抽出
    function getCategories(tools) {
        const categories = new Set();
        tools.forEach(tool => {
            if (tool.category) categories.add(tool.category);
        });
        return Array.from(categories).sort();
    }

    // フィルタUIを構築
    function buildFilterUI(tools) {
        const categories = getCategories(tools);
        const filterContainer = document.createElement('div');
        filterContainer.className = 'tools-filter-container';

        // 検索ボックス
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'tools-search-wrapper';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'tools-search-input';
        searchInput.placeholder = 'ツールを検索...';
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.trim();
            applyFilters();
        });
        searchWrapper.appendChild(searchInput);

        // カテゴリフィルタボタン群
        const categoryWrapper = document.createElement('div');
        categoryWrapper.className = 'tools-category-filter';

        // 「すべて」ボタン
        const allBtn = document.createElement('button');
        allBtn.className = 'tools-category-btn active';
        allBtn.textContent = 'すべて';
        allBtn.addEventListener('click', function() {
            activeCategory = null;
            updateCategoryButtons();
            applyFilters();
        });
        categoryWrapper.appendChild(allBtn);

        // 各カテゴリボタン
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'tools-category-btn';
            btn.textContent = cat;
            btn.addEventListener('click', function() {
                activeCategory = cat;
                updateCategoryButtons();
                applyFilters();
            });
            categoryWrapper.appendChild(btn);
        });

        filterContainer.appendChild(searchWrapper);
        filterContainer.appendChild(categoryWrapper);
        return filterContainer;
    }

    // カテゴリボタンのactive状態を更新
    function updateCategoryButtons() {
        const buttons = document.querySelectorAll('.tools-category-btn');
        buttons.forEach(btn => {
            if (activeCategory === null) {
                btn.classList.toggle('active', btn.textContent === 'すべて');
            } else {
                btn.classList.toggle('active', btn.textContent === activeCategory);
            }
        });
    }

    // テキストのハイライト処理（XSS対策済み）
    function highlightText(text, query) {
        if (!query || !text) return escapeHtml(text || '');
        const escaped = escapeHtml(text);
        const escapedQuery = escapeHtml(query);
        // 正規表現のメタ文字をエスケープ
        const regexSafe = escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${regexSafe})`, 'gi');
        return escaped.replace(regex, '<mark class="tools-search-highlight">$1</mark>');
    }

    // HTMLエスケープ
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // フィルタを適用してツールを再描画
    function applyFilters() {
        let filtered = allToolsData;

        // カテゴリフィルタ
        if (activeCategory) {
            filtered = filtered.filter(tool => tool.category === activeCategory);
        }

        // 文字列検索フィルタ
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(tool => {
                return (tool.name && tool.name.toLowerCase().includes(q)) ||
                       (tool.description && tool.description.toLowerCase().includes(q)) ||
                       (tool.category && tool.category.toLowerCase().includes(q));
            });
        }

        displayTools(filtered, searchQuery);
    }

    // フィルタUI以外のコンテンツ（リスト・メッセージ）を差し替える
    function replaceToolsContent(newElement) {
        // フィルタUI以外の既存要素を削除
        const children = Array.from(toolsListContainer.children);
        children.forEach(child => {
            if (!child.classList.contains('tools-filter-container')) {
                toolsListContainer.removeChild(child);
            }
        });
        if (newElement) {
            toolsListContainer.appendChild(newElement);
        }
    }

    function displayTools(tools, query) {
        if (!toolsListContainer) {
            console.error('Error in tools-loader.js: tools-list-container element not found.');
            return;
        }

        if (!tools || tools.length === 0) {
            const noResult = document.createElement('p');
            noResult.className = 'tools-no-result';
            noResult.textContent = '該当するツールが見つかりません。';
            replaceToolsContent(noResult);
            return;
        }

        const ul = document.createElement('ul');
        tools.forEach(tool => {
            const li = document.createElement('li');
            li.className = 'tool-item';

            const q = query || '';

            // カード全体をリンクにする
            const link = document.createElement('a');
            link.href = tool.url || '#';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'tool-link';

            // タイトル
            const h3 = document.createElement('h3');
            h3.innerHTML = highlightText(tool.name || '名称未設定', q);
            link.appendChild(h3);

            // 説明文
            if (tool.description) {
                const desc = document.createElement('p');
                desc.innerHTML = highlightText(tool.description, q);
                link.appendChild(desc);
            }

            // フッター行（カテゴリ左・最終更新右）
            const footer = document.createElement('div');
            footer.className = 'tool-footer';

            if (tool.category) {
                const categoryTag = document.createElement('span');
                categoryTag.className = 'tool-category-tag';
                categoryTag.innerHTML = highlightText(tool.category, q);
                footer.appendChild(categoryTag);
            }

            if (tool.lastUpdated) {
                const meta = document.createElement('span');
                meta.className = 'tool-meta';
                meta.textContent = '最終更新: ' + tool.lastUpdated;
                footer.appendChild(meta);
            }

            link.appendChild(footer);

            li.appendChild(link);
            ul.appendChild(li);
        });

        replaceToolsContent(ul);
    }

    // メイン初期化関数
    function initTools(data) {
        allToolsData = data;
        toolsListContainer.innerHTML = '';
        const filterUI = buildFilterUI(data);
        toolsListContainer.appendChild(filterUI);
        displayTools(data, '');
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
                    initTools(data);
                } else {
                    console.warn('Received data is not a valid array for tools in tools-loader.js. Displaying dummy data instead.', data);
                    toolsListContainer.innerHTML = '<p>ツール情報の形式が正しくありません。ダミーデータを表示します。</p>';
                    initTools(dummyToolsData);
                }
            })
            .catch(error => {
                console.error('Error loading tools from tools-list.json in tools-loader.js:', error);
                toolsListContainer.innerHTML = `<p>ツールの読み込みに失敗しました (${error.message})。代わりにダミーデータを表示します。</p>`;
                initTools(dummyToolsData);
            });
    }
});
