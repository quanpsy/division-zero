/* ============================================
   tool-card.js - Tool Card Pod
   ============================================
   
   🔲 ISOLATED COMPONENT: TOOL CARD
   
   Creates HTML for tool cards on Tools page.
   
   TO EDIT TOOL CARDS:
   - Styling: css/pods/tool-card.css
   - Structure: Edit createToolCard() below
   
   ============================================ */


/**
 * Create a tool card HTML string
 * 
 * @param {Object} tool - Tool data
 * @param {string} tool.name - Tool name
 * @param {string} tool.description - Description
 * @param {string} tool.logo - Logo URL
 * @param {string} tool.url - Tool website URL
 * @param {string[]} tool.features - Feature list
 * @param {string} tool.skillLevel - Required skill level
 * @param {string} tool.pricing - Pricing info
 * 
 * @returns {string} HTML string for the card
 */
function createToolCard(tool = {}) {

    // ========================================
    // DEFAULTS - Handle missing data
    // ========================================

    const {
        name = 'Tool Name',
        description = 'No description available.',
        logo = 'https://via.placeholder.com/60x60/8b5cf6/ffffff?text=?',
        url = '#',
        features = [],
        skillLevel = 'All levels',
        pricing = 'See website'
    } = tool;


    // ========================================
    // FEATURES - Badge list
    // ========================================

    const featuresHTML = features.length > 0
        ? features.map(f => `<span class="feature-badge">${f}</span>`).join('')
        : '';


    // ========================================
    // FINAL CARD HTML
    // ========================================

    return `
        <div class="tool-card glass">
            
            <!-- HEADER: Logo + Name + Skill -->
            <div class="tool-header">
                <img src="${logo}" 
                     alt="${name}" 
                     class="tool-logo"
                     style="filter: invert(1);"
                     onerror="this.src='https://via.placeholder.com/60x60/8b5cf6/ffffff?text=?'">
                <div>
                    <h3 class="tool-name">${name}</h3>
                    <span class="tool-skill">${skillLevel}</span>
                </div>
            </div>
            
            <!-- DESCRIPTION -->
            <p class="tool-description">${description}</p>
            
            <!-- FEATURES -->
            <div class="tool-features">
                ${featuresHTML}
            </div>
            
            <!-- FOOTER: Pricing + Link -->
            <div class="tool-footer">
                <span class="tool-pricing">${pricing}</span>
                <a href="${url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="tool-link">
                    Visit →
                </a>
            </div>
            
        </div>
    `;
}


/**
 * Create a tools category section
 * 
 * @param {Object} category - Category data
 * @param {string} category.id - Category ID
 * @param {string} category.title - Category title
 * @param {string} category.description - Category description
 * @param {Object[]} tools - Array of tools in this category
 * 
 * @returns {string} HTML string for the category section
 */
function createToolsCategory(category, tools) {

    if (!tools || tools.length === 0) return '';

    const toolCardsHTML = tools.map(tool => createToolCard(tool)).join('');

    return `
        <div class="tools-category" id="category-${category.id}">
            
            <!-- CATEGORY HEADER -->
            <div class="category-header">
                <h2 class="category-title">${category.title}</h2>
                <p class="category-description">${category.description}</p>
            </div>
            
            <!-- TOOLS GRID -->
            <div class="tools-grid">
                ${toolCardsHTML}
            </div>
            
        </div>
    `;
}


// Make functions available globally
window.createToolCard = createToolCard;
window.createToolsCategory = createToolsCategory;
