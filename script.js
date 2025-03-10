document.addEventListener('DOMContentLoaded', () => {
    const setupNpmDownloads = async () => {
        try {
            const response = await fetch('https://api.npmjs.org/downloads/point/last-week/aqualink');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            const downloadsBadge = document.querySelector('.downloads-badge');
            if (downloadsBadge) {
                downloadsBadge.src = `https://img.shields.io/badge/downloads-${data.downloads}%20weekly-2962FF?style=flat`;
            }
        } catch (error) {
            console.error('Failed to fetch npm downloads:', error);
            const downloadsBadge = document.querySelector('.downloads-badge');
            if (downloadsBadge) {
                downloadsBadge.src = `https://img.shields.io/badge/downloads-error-FF0000?style=flat`; 
            }
        }
    };

    const setupNpmVersion = async () => {
        try {
            const response = await fetch('https://registry.npmjs.org/aqualink/latest');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            const versionBadge = document.querySelector('.badge.version');
            if (versionBadge) {
                versionBadge.textContent = `v${data.version}`;
            }
        } catch (error) {
            console.error('Failed to fetch npm version:', error);
            const versionBadge = document.querySelector('.badge.version');
            if (versionBadge) {
                versionBadge.textContent = 'Error loading version'; 
            }
        }
    };

    const setupThemeToggle = () => {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) {
            console.error('Theme toggle button not found!');
            return; 
        }
        const html = document.documentElement;

        const savedTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            document.body.classList.add('theme-transition');

            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 300);
        });
    };

    const setupSidebarToggle = () => {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const container = document.querySelector('.container');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                container.classList.toggle('sidebar-hidden');

                const icon = sidebarToggle.querySelector('i');
                if (container.classList.contains('sidebar-hidden')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-arrow-right');
                } else {
                    icon.classList.remove('fa-arrow-right');
                    icon.classList.add('fa-bars');
                }

                localStorage.setItem('sidebar-hidden', container.classList.contains('sidebar-hidden'));
            });
        }

        const sidebarHidden = localStorage.getItem('sidebar-hidden') === 'true';
        if (sidebarHidden) {
            container.classList.add('sidebar-hidden');
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-arrow-right');
            }
        }
    };

    const setupMobileMenu = () => {
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(menuToggle);

        const sidebar = document.querySelector('.sidebar');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            menuToggle.innerHTML = sidebar.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && 
                !menuToggle.contains(e.target) && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    };

    const setupClipboard = () => {
        const clipboard = new ClipboardJS('.copy-btn');

        clipboard.on('success', (e) => {
            const button = e.trigger;
            const originalHTML = button.innerHTML;

            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.color = 'var(--success-color)';

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.color = '';
            }, 2000);
        });

        clipboard.on('error', (e) => {
            const button = e.trigger;
            const originalHTML = button.innerHTML;

            button.innerHTML = '<i class="fas fa-times"></i>';
            button.style.color = 'var(--danger-color)';

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.color = '';
            }, 2000);
        });
    };

    const setupSearch = () => {
        const searchInput = document.getElementById('search-input');
        const navSections = document.querySelectorAll('.nav-section');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            navSections.forEach(section => {
                const links = section.querySelectorAll('ul li a');
                let hasVisibleItems = false;

                links.forEach(link => {
                    const text = link.textContent.toLowerCase();
                    const listItem = link.parentElement;

                    if (text.includes(searchTerm)) {
                        listItem.style.display = 'block';
                        hasVisibleItems = true;
                    } else {
                        listItem.style.display = 'none';
                    }
                });

                section.querySelector('h3').style.display = 
                    hasVisibleItems ? 'flex' : 'none';
            });
        });
    };

    const setupSmoothScrolling = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Close mobile menu if open
                    const sidebar = document.querySelector('.sidebar');
                    if (sidebar.classList.contains('active')) {
                        sidebar.classList.remove('active');
                        document.querySelector('.mobile-menu-toggle').innerHTML = 
                            '<i class="fas fa-bars"></i>';
                    }

                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    history.pushState(null, '', `#${targetId}`);

                    targetElement.classList.add('highlight');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight');
                    }, 1000);
                }
            });
        });
    };
    const setupKeyboardNavigation = () => {
        const searchInput = document.getElementById('search-input');

        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
            }

            if (e.key === 'Escape') {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    document.querySelector('.mobile-menu-toggle').innerHTML = 
                        '<i class="fas fa-bars"></i>';
                }
            }
        });
    };

    setupThemeToggle();
    setupSidebarToggle();
    setupMobileMenu();
    setupClipboard();
    setupSearch();
    setupSmoothScrolling();
    setupKeyboardNavigation();
    setupNpmDownloads();
    setupNpmVersion();

    setInterval(setupNpmDownloads, 3600000); 
    setInterval(setupNpmVersion, 3600000);

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});
