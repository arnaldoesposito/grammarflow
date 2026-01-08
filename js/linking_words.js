document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('lw-grid');
    const searchInput = document.getElementById('lw-search');
    const tabs = document.querySelectorAll('.v-tab');

    let allConnectors = [];
    let currentCategory = 'all';

    // Fetch Data
    fetch('../lessons/linking_words.json')
        .then(response => response.json())
        .then(data => {
            // Flatten data for "all" view but keep track of categories
            // Or just store the raw object.
            // Let's create a flat array with category tags
            Object.keys(data).forEach(category => {
                data[category].forEach(item => {
                    allConnectors.push({ ...item, category });
                });
            });

            // Initial Render
            render(allConnectors);
        })
        .catch(err => {
            console.error(err);
            grid.innerHTML = '<div class="error">Failed to load connectors.</div>';
        });

    // Tab Filtering
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // UI Update
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Logic Update
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

        let filtered = allConnectors.filter(item => {
            // Category Filter
            if (currentCategory !== 'all' && item.category !== currentCategory) {
                return false;
            }

            // Search Filter
            const matchWord = item.word.toLowerCase().includes(query);
            const matchTrans = item.translation.toLowerCase().includes(query);

            return matchWord || matchTrans;
        });

        render(filtered);
    }

    function render(items) {
        grid.innerHTML = '';

        if (items.length === 0) {
            grid.innerHTML = '<div class="empty-state">No connectors found.</div>';
            return;
        }

        items.forEach(item => {
            const card = createCard(item);
            grid.appendChild(card);
        });
    }

    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'ff-card'; // Reuse False Friends card style

        // Determine Badge Color/Label based on category
        let badgeClass = 'card-type'; // Reuse existing
        // We can add specific colors inline or via new classes later if needed

        const categoryLabels = {
            'contrast': 'Contrast',
            'addition': 'Addition',
            'cause_effect': 'Cause & Effect',
            'sequence': 'Sequence'
        };

        const label = categoryLabels[item.category] || item.category;

        card.innerHTML = `
            <div class="ff-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3>${item.word}</h3>
                <span style="font-size: 0.7rem; text-transform: uppercase; color: var(--text-secondary); background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${label}</span>
            </div>
            <div class="ff-body">
                <div class="ff-row">
                    <span class="label">Translation:</span>
                    <span class="value" style="color: var(--text-secondary); font-style: italic;">${item.translation}</span>
                </div>
                <div class="ff-row" style="align-items: flex-start; margin-top: 1rem; display: block;">
                    <span class="label" style="display: block; margin-bottom: 0.3rem;">Usage:</span>
                    <span class="value" style="font-weight: 500; font-size: 0.9rem; line-height: 1.4; display: block;">${item.usage}</span>
                </div>
            </div>
            <div class="ff-footer" style="background: #fdf2f8; color: #831843;">
                <p><strong>Ex:</strong> ${formatExample(item.example)}</p>
            </div>
        `;

        return card;
    }

    function formatExample(text) {
        // Bold logic handled in JSON with ** **, let's parse it
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
});
