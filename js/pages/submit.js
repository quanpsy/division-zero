/* ============================================
   submit.js - Submit Page Script
   ============================================
   
   📄 SUBMIT PAGE INITIALIZATION
   
   This script runs on submit.html.
   It handles:
   - Form toggle (project vs idea)
   - Initializes both form pods
   
   ============================================ */


/**
 * Initialize the submit page
 */
function initSubmitPage() {

    // Render nav and footer
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        const activePage = navPlaceholder.dataset.page || 'submit';
        renderNavigation(activePage);
    }
    renderFooter();

    // Initialize form toggle
    initFormToggle();

    // Initialize form pods
    initProjectForm();
    initIdeaForm();
}


/**
 * Initialize form toggle (project vs idea)
 */
function initFormToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const projectForm = document.getElementById('project-form');
    const ideaForm = document.getElementById('idea-form');

    if (!toggleBtns.length || !projectForm || !ideaForm) return;

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Update active button
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Show/hide forms
            const formType = this.dataset.form;
            if (formType === 'project') {
                projectForm.classList.remove('hidden');
                ideaForm.classList.add('hidden');
            } else {
                projectForm.classList.add('hidden');
                ideaForm.classList.remove('hidden');
            }
        });
    });
}


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSubmitPage);
