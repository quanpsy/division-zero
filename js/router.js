/* ============================================
   router.js - Simple SPA Router
   ============================================
   
   Handles client-side navigation without page reloads.
   Pages are sections in the DOM, shown/hidden based on route.
   
   ============================================ */

const Router = {
    routes: {
        '': 'home',
        'home': 'home',
        'projects': 'projects',
        'tools': 'tools',
        'dictionary': 'dictionary',
        'submit': 'submit'
    },

    currentPage: null,

    init() {
        // Handle initial route
        this.handleRoute();

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.handleRoute());

        // Intercept all internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Skip external links and anchors
            if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
                return;
            }

            // Handle internal navigation
            e.preventDefault();
            const page = href.replace(/^\//, '').replace('.html', '') || 'home';
            this.navigate(page);
        });

        console.log('[Router] Initialized');
    },

    navigate(page) {
        if (page === this.currentPage) return;

        // Update URL without reload
        const url = page === 'home' ? '/' : '/' + page;
        history.pushState({ page }, '', url);

        // Show the page
        this.showPage(page);
    },

    handleRoute() {
        let path = window.location.pathname.replace(/^\//, '').replace('.html', '');
        let page = this.routes[path] || 'home';
        this.showPage(page);
    },

    showPage(page) {
        // Hide all pages
        document.querySelectorAll('.spa-page').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });

        // Show target page
        const targetPage = document.getElementById('page-' + page);
        if (targetPage) {
            targetPage.classList.add('active');
            targetPage.style.display = 'block';
        }

        // Update nav active state
        this.updateNav(page);

        // Update document title
        this.updateTitle(page);

        // Scroll to top
        window.scrollTo(0, 0);

        // Run page-specific init if needed
        this.initPage(page);

        this.currentPage = page;
        console.log('[Router] Navigated to:', page);
    },

    updateNav(page) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href') || '';
            const linkPage = href.replace(/^\//, '').replace('.html', '') || 'home';
            if (linkPage === page) {
                link.classList.add('active');
            }
        });
    },

    updateTitle(page) {
        const titles = {
            'home': 'divisionzero - Where Ideas Become Reality Through AI',
            'projects': 'Projects | divisionzero',
            'tools': 'Tools | divisionzero',
            'dictionary': 'Dictionary | divisionzero',
            'submit': 'Submit | divisionzero'
        };
        document.title = titles[page] || titles['home'];
    },

    initPage(page) {
        // Trigger page-specific initialization
        const event = new CustomEvent('spa:pageload', { detail: { page } });
        window.dispatchEvent(event);
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Router.init();
});

// Make globally available
window.Router = Router;
