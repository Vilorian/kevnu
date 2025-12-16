/**
 * Reusable UI Components
 */

// Navigation component
function renderNavigation() {
    const currentPath = window.location.pathname;
    const isLoggedIn = authManager.isLoggedIn();
    const user = authManager.getUser();

    return `
        <nav class="navbar" id="navbar">
            <div class="container">
                <div class="navbar__content">
                    <a href="/" class="navbar__logo">
                        <span class="navbar__logo-icon">✓</span>
                        <span class="navbar__logo-text">
                            <span class="ornate">Kevin</span> Courses
                        </span>
                    </a>
                    
                    <button class="navbar__toggle" id="navToggle" aria-label="Toggle navigation">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <ul class="navbar__menu" id="navMenu">
                        <li><a href="/" class="navbar__link ${currentPath === '/' ? 'active' : ''}">Home</a></li>
                        <li><a href="/courses" class="navbar__link ${currentPath === '/courses' ? 'active' : ''}">Courses</a></li>
                        <li><a href="/commission" class="navbar__link ${currentPath === '/commission' ? 'active' : ''}">Commission</a></li>
                        <li><a href="/blog" class="navbar__link ${currentPath === '/blog' ? 'active' : ''}">Blog</a></li>
                        <li><a href="/about" class="navbar__link ${currentPath === '/about' ? 'active' : ''}">About</a></li>
                        <li><a href="/contact" class="navbar__link ${currentPath === '/contact' ? 'active' : ''}">Contact</a></li>
                    </ul>

                    <div class="navbar__actions">
                        ${isLoggedIn ? `
                            <a href="/dashboard" class="btn btn--secondary btn--small">
                                <span class="navbar__user-avatar">${user.name.charAt(0).toUpperCase()}</span>
                                Dashboard
                            </a>
                            <button class="btn btn--outline btn--small" onclick="authManager.logout()">Logout</button>
                        ` : `
                            <a href="/login" class="btn btn--outline btn--small">Login</a>
                            <a href="/register" class="btn btn--primary btn--small">Sign Up</a>
                        `}
                    </div>
                </div>
            </div>
        </nav>
    `;
}

// Footer component
function renderFooter() {
    const currentYear = new Date().getFullYear();
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer__content">
                    <div class="footer__section">
                        <div class="footer__brand">
                            <span class="footer__logo-icon">✓</span>
                            <span class="footer__logo-text">
                                <span class="ornate">Kevin</span> Courses
                            </span>
                        </div>
                        <p class="footer__description">Learn web development and UI/UX design with professional courses. Transform your skills and advance your career.</p>
                        <div class="footer__social">
                            <a href="#" class="footer__social-link" aria-label="Facebook">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </a>
                            <a href="#" class="footer__social-link" aria-label="Twitter">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M23 3A10.9 10.9 0 0 1 20.281 4.281L20.086 4.477A10.933 10.933 0 0 1 19.477 5.086L19.281 5.281A10.9 10.9 0 0 1 18 6.719V7A10 10 0 0 1 8 17H6A10 10 0 0 1 4 27H2A12 12 0 0 0 14 15A4 4 0 0 1 10 11A4 4 0 0 1 14 7H15A12 12 0 0 0 27 2V0A10.9 10.9 0 0 1 23 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </a>
                            <a href="#" class="footer__social-link" aria-label="LinkedIn">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 8A6 6 0 0 1 22 14V21H18V14A2 2 0 0 0 16 12A2 2 0 0 0 14 14V21H10V8H14V9.5A4 4 0 0 1 16 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <rect x="2" y="9" width="4" height="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </a>
                            <a href="#" class="footer__social-link" aria-label="Instagram">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="footer__section">
                        <h3 class="footer__heading">Menu</h3>
                        <ul class="footer__links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/courses">Courses</a></li>
                            <li><a href="/commission">Commission</a></li>
                            <li><a href="/blog">Blog</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    <div class="footer__section">
                        <h3 class="footer__heading">Courses</h3>
                        <ul class="footer__links">
                            <li><a href="/courses?category=web-development">Web Development</a></li>
                            <li><a href="/courses?category=ui-ux-design">UI/UX Design</a></li>
                            <li><a href="/courses?category=full-stack">Full Stack</a></li>
                            <li><a href="/courses?category=frontend">Frontend</a></li>
                            <li><a href="/courses?category=backend">Backend</a></li>
                        </ul>
                    </div>

                    <div class="footer__section">
                        <h3 class="footer__heading">Resources</h3>
                        <ul class="footer__links">
                            <li><a href="/resources">Resources</a></li>
                            <li><a href="/contact">Support</a></li>
                            <li><a href="/blog">Blog</a></li>
                            <li><a href="/dashboard">Dashboard</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer__bottom">
                    <p class="footer__copyright">&copy; ${currentYear} <span class="ornate">Kevin</span> Courses. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
}

// Header template
function renderHeader(pageTitle = '', pageDescription = '', additionalCSS = []) {
    const title = pageTitle ? `${pageTitle} - ` : '';
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="description" content="${pageDescription || 'Learn web development and UI/UX design with professional courses. Commission custom projects.'}">
            <meta name="keywords" content="web development, UI/UX design, courses, online learning, programming">
            <title>${title}Kevin Courses</title>
            
            <!-- Fonts -->
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Cinzel+Decorative:wght@400;700;900&display=swap" rel="stylesheet">
            
            <!-- Stylesheets -->
            <link rel="stylesheet" href="/css/main.css">
            <link rel="stylesheet" href="/css/components.css">
            <link rel="stylesheet" href="/css/animations.css">
            <link rel="stylesheet" href="/css/responsive.css">
            ${additionalCSS.map(css => `<link rel="stylesheet" href="${css}">`).join('\n            ')}
        </head>
        <body>
            ${renderNavigation()}
    `;
}

