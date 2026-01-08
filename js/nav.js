/**
 * Navigation Logic
 * Dynamically generates the navigation menu to ensure consistency across pages.
 */

(function initNav() {
    // 1. Definition of Menu Items
    // Link paths are relative to the root (index.html location)
    const menuItems = [
        { name: 'Lessons', link: 'index.html' },
        { name: 'Verbs', link: 'pages/verbs.html' },
        { name: 'Expressions', link: 'pages/expressions.html' },
        { name: 'False Friends', link: 'pages/false_friends.html' },
        { name: 'Linking Words', link: 'pages/linking_words.html' },
        { name: 'Collocations', link: 'pages/collocations.html' }
    ];

    // 2. Detect Context (Root vs Pages Subfolder)
    // Simple heuristic: if window.location.pathname ends with 'index.html' or '/', we are likely at root.
    // However, a more robust way relative to this script:
    // This script is at /js/nav.js.
    // If the page is in /pages/, we need to go up one level for root links.

    // Check if we are in the 'pages' directory based on URL
    const path = window.location.pathname;
    const isPagesDir = path.includes('/pages/');

    // Prefix for links
    // If we are in /pages/, we need '../' to go to root.
    // But wait, the targets in menuItems are defined from root.
    // So 'index.html' becomes '../index.html'
    // 'pages/verbs.html' becomes '../pages/verbs.html' -> which simplifies to 'verbs.html' if we are in pages/ ?
    // Actually, safer to always go to root then down.

    // Let's standardise:
    // Root prefix logic:
    // If inside pages/: root is "../"
    // If at root: root is "./" or ""

    const rootPrefix = isPagesDir ? '../' : '';

    // 3. Find/Create Container
    // We expect a container with class 'main-nav' or distinct ID. 
    // The user request said: "The script must inject the HTML of the <nav> inside a container element (e.g. a header or a specific ID)"
    // The implementation plan proposed replacing <nav> with <div id="nav-placeholder"></div>

    const container = document.getElementById('nav-placeholder');
    if (!container) {
        console.warn('Navigation placeholder #nav-placeholder not found.');
        return;
    }

    // 4. Build HTML
    const navEl = document.createElement('nav');
    navEl.className = 'main-nav';

    // Create Toggle Button (Hamburger)
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-toggle';
    toggleBtn.innerHTML = '☰'; // Simple text icon, can be SVG
    toggleBtn.ariaLabel = 'Toggle navigation';

    // Create Links Container
    const linksContainer = document.createElement('div');
    linksContainer.className = 'nav-links';

    // Helper to get current filename for 'active' class
    const currentFile = path.split('/').pop() || 'index.html';

    menuItems.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.textContent = item.name;

        // Resolve Path
        let finalPath = rootPrefix + item.link;

        btn.onclick = () => window.location.href = finalPath;

        // Active State Logic
        if (item.link.endsWith(currentFile)) {
            btn.classList.add('active');
        }
        else if (currentFile === 'index.html' && item.link === 'index.html') {
            btn.classList.add('active');
        }
        else if (currentFile === '' && item.link === 'index.html') {
            btn.classList.add('active');
        }

        linksContainer.appendChild(btn);
    });

    // Toggle Logic
    toggleBtn.onclick = (e) => {
        e.stopPropagation();
        linksContainer.classList.toggle('active');
        toggleBtn.innerHTML = linksContainer.classList.contains('active') ? '✕' : '☰';
    };

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!navEl.contains(e.target)) {
            linksContainer.classList.remove('active');
            toggleBtn.innerHTML = '☰';
        }
    });

    // 5. Inject
    navEl.appendChild(toggleBtn);
    navEl.appendChild(linksContainer);
    container.appendChild(navEl);

    // --- Shared Header Logic (Scroll) ---
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

})();
