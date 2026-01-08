document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('col-grid');
    const searchInput = document.getElementById('col-search');
    const tabs = document.querySelectorAll('.v-tab');

    let allItems = [];
    let currentCategory = 'all';

    // Fetch Data
    fetch('../lessons/collocations.json')
        .then(response => response.json())
        .then(data => {
            // Flatten data
            Object.keys(data).forEach(category => {
                data[category].forEach(item => {
                    allItems.push({ ...item, category });
                });
            });

            // Initial Render
            render(allItems);
        })
        .catch(err => {
            console.error(err);
            grid.innerHTML = '<div class="error">Failed to load content.</div>';
        });

    // Tab Filtering
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            currentCategory = tab.dataset.type;
            filterAndRender();
        });
    });

    // Search Filtering
    searchInput.addEventListener('input', () => {
        filterAndRender();
    });

    function filterAndRender() {
        const query = searchInput.value.toLowerCase();

        let filtered = allItems.filter(item => {
            if (currentCategory !== 'all' && item.category !== currentCategory) {
                return false;
            }

            const matchPair = item.pair.toLowerCase().includes(query);
            const matchTrans = item.translation.toLowerCase().includes(query);

            return matchPair || matchTrans;
        });

        render(filtered);
    }

    function render(items) {
        grid.innerHTML = '';

        if (items.length === 0) {
            grid.innerHTML = '<div class="empty-state">No matches found.</div>';
            return;
        }

        items.forEach(item => {
            const card = createCard(item);
            grid.appendChild(card);
        });
    }

    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'ff-card'; // Reuse generic card container

        const categoryLabels = {
            'make_do': 'Make vs Do',
            'adj_prep': 'Adjective + Prep',
            'verb_prep': 'Verb + Prep',
            'business': 'Business'
        };

        const label = categoryLabels[item.category] || item.category;

        // Conditional Badge Color could be added here if desired

        let noteHtml = '';
        if (item.note) {
            noteHtml = `<div class="ff-row" style="margin-top: 0.5rem;">
                            <span class="value" style="color: #ef4444; font-size: 0.85rem;">⚠️ ${item.note}</span>
                        </div>`;
        }

        card.innerHTML = `
            <div class="ff-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3>${item.pair}</h3>
                <span style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary); background: #fff0f5; padding: 2px 6px; border-radius: 4px;">${label}</span>
            </div>
            <div class="ff-body">
                <div class="ff-row">
                    <span class="value" style="color: var(--text-secondary); font-style: italic; font-size: 1rem;">${item.translation}</span>
                </div>
                ${noteHtml}
            </div>
            <div class="ff-footer" style="background:var(--bg-gradient-start); color: var(--text-main);">
                <p><strong>Ex:</strong> ${formatExample(item.example)}</p>
            </div>
        `;

        return card;
    }

    function formatExample(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
});
