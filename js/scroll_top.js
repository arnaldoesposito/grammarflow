document.addEventListener('DOMContentLoaded', () => {
    // Create the button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    // Use an SVG Icon for "Beauty"
    scrollBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    scrollBtn.ariaLabel = 'Back to top';
    document.body.appendChild(scrollBtn);

    // Show/Hide logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    // Scroll logic
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
