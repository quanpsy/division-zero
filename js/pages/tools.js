/* ============================================
   tools.js - Tools Page Script
   ============================================
   
   📄 TOOLS PAGE INITIALIZATION
   
   This script runs on tools.html.
   It handles:
   - Loading tools data
   - Rendering tool categories and cards
   
   ============================================ */


/**
 * Initialize the tools page
 */
async function initToolsPage() {

    // Render nav and footer
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        const activePage = navPlaceholder.dataset.page || 'tools';
        renderNavigation(activePage);
    }
    renderFooter();

    // Load and render tools
    await loadAndRenderTools();
}


/**
 * Load tools data and render categories
 */
async function loadAndRenderTools() {
    const container = document.getElementById('tools-container');
    if (!container) return;

    // Load data from JSON
    const toolsData = await utils.loadJSON('data/tools.json');

    if (!toolsData) {
        container.innerHTML = `
            <div class="no-results">
                <h3>Unable to load tools</h3>
                <p>Please try again later.</p>
            </div>
        `;
        return;
    }

    // Define categories to show (in order)
    const categories = [
        { id: 'ai', title: 'AI Assistants', description: 'Your coding co-pilots. Describe what you want, they write the code.' },
        { id: 'nocode', title: 'No-Code Vibecoding Tools', description: 'Build full apps without writing code yourself. AI does the heavy lifting.' },
        { id: 'backend', title: 'Backend Services', description: 'Database and auth without writing backend code. Just connect and use.' },
        { id: 'hosting', title: 'Hosting & Deployment', description: 'Push to deploy. Your code live in seconds, for free.' }
    ];

    // Render each category
    categories.forEach(category => {
        const tools = toolsData[category.id];
        if (tools && tools.length > 0) {
            const sectionHTML = createToolsCategory(category, tools);
            container.insertAdjacentHTML('beforeend', sectionHTML);
        }
    });
}


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initToolsPage);
