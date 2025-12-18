/* ============================================
   projects.js - Projects Page Script
   ============================================
   
   📄 PROJECTS PAGE INITIALIZATION
   
   This script runs on projects.html.
   It handles:
   - Loading project data
   - Rendering carousels
   - Search and filtering
   
   ============================================ */


// Store loaded projects data
let projectsData = null;
let projectsPageInitialized = false;


/**
 * Initialize the projects page
 */
async function initProjectsPage() {
    // Prevent re-initialization (prevents duplicate sections)
    if (projectsPageInitialized) {
        console.log('[Projects] Already initialized, skipping');
        return;
    }
    projectsPageInitialized = true;

    // NOTE: Nav and footer are now rendered by Router

    // Load and render projects
    await loadAndRenderProjects();

    // Initialize search and filters
    initSearch();
    initFilters();
    initCarousels();

    // Initialize scroll-triggered animations for carousels (like home page)
    initProjectsScrollAnimations();
}


/**
 * Initialize scroll-triggered fade-in animations for project carousels
 * Mirrors the home page behavior for smooth, progressive reveal
 */
function initProjectsScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Animate each carousel category
    document.querySelectorAll('#page-projects .project-category').forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(category);
    });

    // Immediately show categories already in viewport
    setTimeout(() => {
        document.querySelectorAll('#page-projects .project-category').forEach(category => {
            const rect = category.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
            }
        });
    }, 100);
}


/**
 * Load project data and render carousels
 */
async function loadAndRenderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    // Load data from Cloudflare Worker API (with fallback to static JSON)
    try {
        const response = await fetch(`${CONFIG.WORKER_API_URL}/projects`);
        if (response.ok) {
            projectsData = await response.json();
        } else {
            throw new Error('Worker API failed');
        }
    } catch (error) {
        console.log('Worker API unavailable, using static fallback...');
        projectsData = await utils.loadJSON('data/projects.json');
    }

    if (!projectsData) {
        container.innerHTML = `
            <div class="no-results">
                <h3>Unable to load projects</h3>
                <p>Please try again later.</p>
            </div>
        `;
        return;
    }

    // Define carousels to show (order matters!)
    const carousels = [
        { id: 'promoted', title: '⭐ Promoted' },
        { id: 'trending', title: '🔥 Trending' },
        { id: 'editorsPick', title: '✨ Editor\'s Pick' },
        { id: 'divisionZero', title: '🔷 Division Zero' },
        { id: 'allTime', title: '👑 All-Time Best' },
        // Categories (nested in projectsData.categories)
        { id: 'categories.productivity', title: '💼 Productivity', key: 'productivity' },
        { id: 'categories.developertools', title: '🛠️ Developer Tools', key: 'developertools' },
        { id: 'categories.games', title: '🎮 Games', key: 'games' },
        { id: 'categories.aiagents', title: '🤖 AI Agents', key: 'aiagents' },
        { id: 'categories.design', title: '🎨 Design', key: 'design' },
        // Saved at bottom - only shows if user has saved projects
        { id: 'saved', title: '❤️ Your Saved Projects', special: 'saved' }
    ];

    // Get all projects for saved lookup
    const allProjects = [];
    ['promoted', 'trending', 'editorsPick', 'divisionZero', 'allTime'].forEach(key => {
        if (projectsData[key]) allProjects.push(...projectsData[key]);
    });
    if (projectsData.categories) {
        Object.values(projectsData.categories).forEach(arr => allProjects.push(...arr));
    }

    // Render each carousel
    carousels.forEach(carousel => {
        let items;

        // Handle saved carousel (from localStorage)
        if (carousel.special === 'saved') {
            const savedIds = getSavedProjectIds ? getSavedProjectIds() : [];
            console.log('📌 Saved project IDs:', savedIds);

            if (savedIds.length === 0) return; // Don't show empty saved carousel

            // Remove duplicates from allProjects by slug
            const uniqueProjects = [];
            const seenSlugs = new Set();
            allProjects.forEach(p => {
                const key = p.slug || p.id;
                if (!seenSlugs.has(key)) {
                    seenSlugs.add(key);
                    uniqueProjects.push(p);
                }
            });

            // Find projects that match saved IDs
            items = savedIds
                .map(id => uniqueProjects.find(p => (p.slug || p.id) === id))
                .filter(Boolean);

            console.log('📌 Matched saved projects:', items.length);
        }
        // Handle nested categories
        else if (carousel.id.startsWith('categories.') && projectsData.categories) {
            items = projectsData.categories[carousel.key];
        } else {
            items = projectsData[carousel.id];
        }

        if (items && items.length > 0) {
            const section = createCategoryCarousel({ id: carousel.id, title: carousel.title }, items);
            if (section) {
                container.appendChild(section);
            }
        }
    });

    // Initialize long-press reporting on all cards
    if (window.initProjectCardReporting) {
        initProjectCardReporting();
    }

    // Initialize share and save button handlers
    if (window.initProjectCardButtons) {
        initProjectCardButtons();
    }
}


/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('project-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', utils.debounce((e) => {
        performSearch(e.target.value);
    }, 300));
}


/**
 * Initialize category filters
 */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            const filter = this.dataset.filter;
            performFilter(filter);
        });
    });
}


/**
 * Search projects by query
 * 
 * @param {string} query - Search query
 */
function performSearch(query) {
    const categories = document.querySelectorAll('.project-category');
    let hasResults = false;

    query = query.toLowerCase().trim();

    categories.forEach(category => {
        const cards = category.querySelectorAll('.project-card-v2');
        let categoryHasResults = false;

        cards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
            const techItems = Array.from(card.querySelectorAll('.inline-tech-item'))
                .map(t => t.textContent.toLowerCase());

            const matchesSearch = !query ||
                title.includes(query) ||
                desc.includes(query) ||
                techItems.some(t => t.includes(query));

            if (matchesSearch) {
                card.style.display = 'block';
                categoryHasResults = true;
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });

        category.style.display = categoryHasResults ? 'block' : 'none';
    });

    toggleNoResults(!hasResults);
}


/**
 * Filter projects by category
 * 
 * @param {string} filter - Category ID or 'all'
 */
function performFilter(filter) {
    const categories = document.querySelectorAll('.project-category');

    if (filter === 'all') {
        categories.forEach(cat => cat.style.display = 'block');
        return;
    }

    categories.forEach(category => {
        const carousel = category.querySelector('.project-carousel');
        const categoryId = carousel?.dataset.category || '';

        if (categoryId === filter || filter === 'all') {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    });
}


/**
 * Show/hide no results message
 */
function toggleNoResults(show) {
    let noResults = document.getElementById('no-results');

    if (show && !noResults) {
        noResults = document.createElement('div');
        noResults.id = 'no-results';
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <h3>No Projects Found</h3>
            <p>Try adjusting your search or filters</p>
        `;
        document.getElementById('projects-container')?.appendChild(noResults);
    } else if (!show && noResults) {
        noResults.remove();
    }
}


// NOTE: initProjectsPage is called by Router when navigating to projects page
// DO NOT add DOMContentLoaded listener here - Router handles page initialization
window.initProjectsPage = initProjectsPage;
