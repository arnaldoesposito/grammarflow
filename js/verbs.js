console.log("[Verbs] Loading...");

// Data
let verbsData = { regular: [], irregular: [] };
let currentTab = 'all'; // Default to All

// DOM
const container = document.getElementById('verbs-container');
const tabs = document.querySelectorAll('.v-tab');
const searchInput = document.getElementById('verb-search');

// Init
async function init() {
    try {
        const res = await fetch('../lessons/verbs.json');
        if (!res.ok) throw new Error("Failed to load verbs");
        verbsData = await res.json();

        render();
    } catch (e) {
        container.innerHTML = `<div class="error-box">Error: ${e.message}</div>`;
    }

    // Listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.type;
            render();
        });
    });

    searchInput.addEventListener('input', () => render());
}

function render() {
    let list = [];
    if (currentTab === 'all') {
        list = [...verbsData.regular, ...verbsData.irregular];
        // Optional: Sort alphabetically by base if combined (or keep them grouped)
        list.sort((a, b) => a.base.localeCompare(b.base));
    } else {
        list = verbsData[currentTab] || [];
    }

    const query = searchInput.value.toLowerCase().trim();

    // Filter
    const filtered = list.filter(v => {
        return v.base.toLowerCase().includes(query) ||
            v.past.toLowerCase().includes(query) ||
            v.participle.toLowerCase().includes(query) ||
            v.translation.toLowerCase().includes(query);
    });

    // Clear
    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state">No verbs found.</div>';
        return;
    }

    // Render Rows
    filtered.forEach(v => {
        const row = document.createElement('div');
        row.className = 'verb-row';
        row.innerHTML = `
            <div class="col base"><strong>${v.base}</strong></div>
            <div class="col">${v.past}</div>
            <div class="col">${v.participle}</div>
            <div class="col translation">${v.translation}</div>
        `;
        container.appendChild(row);
    });
}

// Start
init();
