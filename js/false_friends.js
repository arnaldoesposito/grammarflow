console.log("[False Friends] Loading...");

let ffData = [];

const grid = document.getElementById('ff-grid');
const searchInput = document.getElementById('ff-search');

async function init() {
    try {
        const res = await fetch('../lessons/false_friends.json');
        if (!res.ok) throw new Error("Failed to load data");
        ffData = await res.json();

        // Sort alphabetically
        ffData.sort((a, b) => a.word.localeCompare(b.word));

        render();
    } catch (e) {
        grid.innerHTML = `<div class="error-box">Error: ${e.message}</div>`;
    }

    searchInput.addEventListener('input', () => render());
}

function render() {
    const query = searchInput.value.toLowerCase().trim();

    const list = ffData.filter(item => {
        return item.word.toLowerCase().includes(query) ||
            item.false_meaning.toLowerCase().includes(query) ||
            item.true_meaning.toLowerCase().includes(query);
    });

    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = '<div class="empty-state">No words found.</div>';
        return;
    }

    list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'ff-card';
        card.innerHTML = `
            <div class="ff-header">
                <h3>${item.word}</h3>
            </div>
            <div class="ff-body">
                <div class="ff-row bad">
                    <span class="icon">❌</span>
                    <span class="label">Looks like:</span>
                    <span class="value">${item.false_meaning}</span>
                </div>
                <div class="ff-row good">
                    <span class="icon">✅</span>
                    <span class="label">Means:</span>
                    <span class="value">${item.true_meaning}</span>
                </div>
            </div>
            <div class="ff-footer">
                <p>"${item.example}"</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

init();
