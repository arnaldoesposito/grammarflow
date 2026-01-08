console.log("[Expressions] Loading...");

let expressionsData = [];
// currentFilter is declared below in global state

const grid = document.getElementById('expressions-grid');
const tabs = document.querySelectorAll('.v-tab');

async function init() {
    try {
        const res = await fetch('../lessons/expressions.json');
        if (!res.ok) throw new Error("Failed to load expressions");
        expressionsData = await res.json();

        render();
    } catch (e) {
        grid.innerHTML = `<div class="error-box">Error: ${e.message}</div>`;
        render(); // Render even on error to show empty state if no data
    }

    setupControls(); // Initialize controls after data is loaded or error handled
}

// Global state
let currentFilter = 'all';
let searchQuery = ''; // Add search state

function setupControls() {
    const tabs = document.querySelectorAll('.v-tab');
    const searchInput = document.getElementById('expr-search'); // Get search input

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add to clicked
            tab.classList.add('active');

            // Update filter
            currentFilter = tab.dataset.filter;
            render();
        });
    });

    // Add search listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            render();
        });
    }
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'flashcard';
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <span class="card-type">${formatType(item.type)}</span>
                <h3>${item.expression}</h3>
                <p class="tap-hint">Tap to flip 👆</p>
            </div>
            <div class="card-back">
                <div class="back-content">
                    <strong>Meaning:</strong>
                    <p>${item.meaning}</p>
                    <strong>Example:</strong>
                    <p class="example">"${item.example}"</p>
                    <div class="translation-pill">${item.translation}</div>
                </div>
            </div>
        </div>
    `;

    // Flip Interaction
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
    });
    return card;
}

function render() {
    grid.innerHTML = '';

    const filtered = expressionsData.filter(item => {
        const matchesType = currentFilter === 'all' || item.type === currentFilter;
        const matchesSearch = item.expression.toLowerCase().includes(searchQuery) ||
            item.meaning.toLowerCase().includes(searchQuery) ||
            item.translation.toLowerCase().includes(searchQuery);

        return matchesType && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state">No expressions found.</div>';
        return;
    }

    filtered.forEach(item => {
        const card = createCard(item);
        grid.appendChild(card);
    });
}

function formatType(type) {
    if (type === 'phrasal_verb') return 'Phrasal Verb';
    if (type === 'idiom') return 'Idiom';
    if (type === 'slang') return 'Slang';
    return type;
}

init();
