// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const sidebar = document.querySelector('.sidebar');
mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});
// Copy code functionality
const copyButtons = document.querySelectorAll('.copy-button');
copyButtons.forEach(button => {
    button.addEventListener('click', event => {
        const codeBlock = event.target.closest('.code-block');
        const codeContent = codeBlock.querySelector('.code-content').textContent;
        navigator.clipboard.writeText(codeContent).then(() => {
            button.textContent = 'Copied!'; // Use textContent for performance
            setTimeout(() => {
                button.textContent = 'Copy'; // Use textContent for performance
            }, 2000);
        });
    });
});
// Background dots animation
const bgDots = document.getElementById('bg-dots');
const dotCount = 100;
const fragment = document.createDocumentFragment(); // Use DocumentFragment for performance
for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.style.top = `${Math.random() * 100}vh`;
    dot.style.left = `${Math.random() * 100}vw`;
    dot.style.animationDelay = `${Math.random() * 2}s`;
    fragment.appendChild(dot); // Append to fragment
}
bgDots.appendChild(fragment); // Append fragment to DOM in one go
// Smooth scrolling for anchor links
const anchors = document.querySelectorAll('a[href^="#"]');
anchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
    });
});
// Sidebar category toggle
const sidebarCategories = document.querySelectorAll('.docs-nav-category-title');
sidebarCategories.forEach(category => {
    category.addEventListener('click', () => {
        const parentCategory = category.parentElement;
        parentCategory.classList.toggle('active');
    });
});
// Scroll event handling
const sections = document.querySelectorAll('.doc-section');
const navLinks = document.querySelectorAll('.docs-nav-link');
let lastScrollTop = 0; // Keep track of last scroll position
const handleScroll = () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
};
window.addEventListener('scroll', () => {
    // Throttle scroll event
    if (Math.abs(window.pageYOffset - lastScrollTop) > 50) {
        handleScroll();
        lastScrollTop = window.pageYOffset;
    }
});