// Handles light/dark mode toggling

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme on load
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeToggleBtn.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }
    } else {
        // Default to light mode if no preference is saved
        body.classList.add('light-mode');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.replace('light-mode', 'dark-mode');
                themeToggleBtn.querySelector('i').classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                body.classList.replace('dark-mode', 'light-mode');
                themeToggleBtn.querySelector('i').classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light-mode');
            }
        });
    }
});
