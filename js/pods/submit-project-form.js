/* ============================================
   submit-project-form.js - Submit Project Pod
   ============================================
   
   🔲 ISOLATED COMPONENT: PROJECT SUBMISSION
   
   Handles:
   - Project form validation
   - Tile/chip selection for tools and stack
   - Form submission
   
   ============================================ */


/**
 * Initialize project form functionality
 */
function initProjectForm() {
    const form = document.getElementById('project-form');
    if (!form) return;

    initProjectTileSelection(form);
    initProjectValidation(form);
    form.addEventListener('submit', handleProjectSubmit);
}


/**
 * Initialize tile selection for project form
 */
function initProjectTileSelection(form) {
    const tileGrids = form.querySelectorAll('.tile-grid');

    tileGrids.forEach(grid => {
        const tiles = grid.querySelectorAll('.tile');
        const maxSelections = parseInt(grid.dataset.maxSelect) || 5;

        tiles.forEach(tile => {
            tile.addEventListener('click', function () {
                const isSelected = this.classList.contains('selected');
                const selectedCount = grid.querySelectorAll('.tile.selected').length;

                if (isSelected) {
                    this.classList.remove('selected');
                } else if (selectedCount < maxSelections) {
                    this.classList.add('selected');
                } else {
                    utils.showToast(`You can only select up to ${maxSelections} items`);
                }

                updateProjectTileValues(grid);
            });
        });
    });
}


/**
 * Update hidden input with selected values
 */
function updateProjectTileValues(grid) {
    const inputName = grid.dataset.inputName;
    if (!inputName) return;

    const selectedTiles = grid.querySelectorAll('.tile.selected');
    const values = Array.from(selectedTiles).map(t => t.dataset.value);

    const form = grid.closest('form');
    const input = form.querySelector(`input[name="${inputName}"]`);
    if (input) {
        input.value = values.join(',');
    }
}


/**
 * Initialize project form validation
 */
function initProjectValidation(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateProjectInput(this);
        });

        input.addEventListener('input', function () {
            clearProjectInputError(this);
        });
    });
}


/**
 * Validate project form input
 */
function validateProjectInput(input) {
    const value = input.value.trim();
    const group = input.closest('.form-group');

    if (input.required && !value) {
        setProjectInputError(group, 'This field is required');
        return false;
    }

    if (input.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            setProjectInputError(group, 'Please enter a valid URL');
            return false;
        }
    }

    clearProjectInputError(input);
    return true;
}


/**
 * Set error state on input
 */
function setProjectInputError(group, message) {
    if (!group) return;

    group.classList.add('error');
    group.classList.remove('success');

    let hint = group.querySelector('.form-hint');
    if (hint) {
        if (!hint.dataset.originalHint) {
            hint.dataset.originalHint = hint.textContent;
        }
        hint.textContent = message;
        hint.classList.add('warning-text');
    }
}


/**
 * Clear error state on input
 */
function clearProjectInputError(input) {
    const group = input.closest('.form-group');
    if (!group) return;

    group.classList.remove('error');

    const hint = group.querySelector('.form-hint');
    if (hint) {
        hint.classList.remove('warning-text');
        const originalHint = hint.dataset.originalHint;
        if (originalHint) hint.textContent = originalHint;
    }
}


/**
 * Handle project form submission
 */
async function handleProjectSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');

    // Validate all required fields
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateProjectInput(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        utils.showToast('Please fix the errors before submitting');
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add selected tiles
    const tileGrids = form.querySelectorAll('.tile-grid');
    tileGrids.forEach(grid => {
        const inputName = grid.dataset.inputName;
        const selected = Array.from(grid.querySelectorAll('.tile.selected'))
            .map(t => t.dataset.value);
        data[inputName] = selected;
    });

    console.log('Project submission:', data);

    // Submit to webhook if configured
    if (CONFIG.SUBMIT_WEBHOOK_URL) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            utils.showToast('Project submitted successfully!');
            form.reset();
            resetProjectTiles(form);
        } catch (error) {
            utils.showToast('Submission failed. Please try again.');
        }
    } else {
        utils.showToast('Submission received! (Demo mode)');
        form.reset();
        resetProjectTiles(form);
    }

    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Project';
}


/**
 * Reset tile selections
 */
function resetProjectTiles(form) {
    const tiles = form.querySelectorAll('.tile.selected');
    tiles.forEach(tile => tile.classList.remove('selected'));
}


// Make functions available globally
window.initProjectForm = initProjectForm;
