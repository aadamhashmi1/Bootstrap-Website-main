const navbarData = [
    { text: 'Game #1', href: '/tictactoe-game/tictactoe.html' },
    { text: 'Game #2', href: '/number-game/number.html' },
    { text: 'Game #3', href: '/snake-game/snake.html' },
    { text: 'Game #4', href: '/brick-game/brick.html' },
    { text: 'Contact', href: 'mailto:muhammadaadamhashmi@gmail.com', icon: 'fas fa-envelope' },
    { text: 'GitHub', href: 'https://github.com/aadamhashmi1', icon: 'fab fa-github', target: '_blank' },
    { text: 'Twitter', href: 'https://twitter.com/yourusername', icon: 'fab fa-twitter', target: '_blank' }
];

function createNavItem(item) {
    if (item.icon) {
        return `<li class="nav-item">
                    <a class="nav-link" href="${item.href}"${item.target ? ` target="${item.target}"` : ''}>
                        <i class="${item.icon}"></i> ${item.text}
                    </a>
                </li>`;
    } else {
        return `<li class="nav-item">
                    <a class="nav-link${item.href === window.location.pathname.split('/').pop() ? ' active' : ''}" href="${item.href}">
                        ${item.text}
                    </a>
                </li>`;
    }
}

function generateNavbar() {
    const navbarContainer = document.getElementById('navbar-placeholder');
    const navbarHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="index.html">Aadam Hashmi</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    ${navbarData.filter(item => !item.icon).map(createNavItem).join('')}
                </ul>
                <ul class="navbar-nav ml-auto">
                    ${navbarData.filter(item => item.icon).map(createNavItem).join('')}
                </ul>
            </div>
        </nav>
    `;

    navbarContainer.innerHTML = navbarHTML;
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateNavbar };
} else {
    // Non-module environment, directly call the function
    window.onload = generateNavbar;
}
