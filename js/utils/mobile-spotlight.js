/* ============================================
   mobile-spotlight.js - Mobile Hover Simulator
   ============================================
   
   📱 MOBILE SPOTLIGHT SYSTEM
   
   Simulates hover effects on mobile by treating
   the center of the screen as a "spotlight".
   
   HOW IT WORKS:
   - Vertical scroll: horizontal center line is the spotlight
   - Horizontal scroll: vertical center line is the spotlight
   - Elements passing through spotlight get hover class
   
   ONLY ACTIVE ON MOBILE/TOUCH DEVICES
   
   ============================================ */


/**
 * Mobile Spotlight System
 */
const MobileSpotlight = {

    // Elements that should respond to spotlight
    spotlightSelectors: [
        '.project-card-v2',
        '.project-card',
        '.term-card',
        '.tool-card',
        '.tile',
        '.carousel-item',
        '.nav-btn-join',
        '.btn',
        '.btn-primary',
        '.btn-secondary',
        '.hero-external-link'
    ],

    // Class added when element is in spotlight
    spotlightClass: 'spotlight-hover',

    // Track currently spotlighted elements
    currentSpotlighted: new Set(),

    // Scroll tracking
    lastScrollY: 0,
    lastScrollX: 0,
    scrollDirection: 'vertical',
    horizontalContainers: [],


    /**
     * Initialize the spotlight system
     */
    init() {
        // Only run on touch devices
        if (!this.isTouchDevice()) {
            return;
        }

        console.log('📱 Mobile Spotlight initialized');

        // Find horizontal scroll containers
        this.findHorizontalContainers();

        // Add scroll listeners
        this.addScrollListeners();

        // Initial spotlight check
        this.updateSpotlight();
    },


    /**
     * Check if device is touch-enabled
     */
    isTouchDevice() {
        return ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0) ||
            (window.innerWidth <= 768);
    },


    /**
     * Find all horizontal scroll containers
     */
    findHorizontalContainers() {
        // Carousels and other horizontal scrollers
        const containers = document.querySelectorAll(
            '.carousel-track, .carousel-container, [data-horizontal-scroll]'
        );
        this.horizontalContainers = Array.from(containers);
    },


    /**
     * Add scroll event listeners
     */
    addScrollListeners() {
        // Debounced scroll handler
        let scrollTimeout;
        const handleScroll = () => {
            if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
            scrollTimeout = requestAnimationFrame(() => {
                this.scrollDirection = 'vertical';
                this.updateSpotlight();
            });
        };

        // Vertical scroll (main page)
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Horizontal scroll (carousels)
        this.horizontalContainers.forEach(container => {
            container.addEventListener('scroll', () => {
                if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
                scrollTimeout = requestAnimationFrame(() => {
                    this.scrollDirection = 'horizontal';
                    this.activeHorizontalContainer = container;
                    this.updateSpotlight();
                });
            }, { passive: true });
        });

        // Also check on touch move for smoother feel
        document.addEventListener('touchmove', () => {
            if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
            scrollTimeout = requestAnimationFrame(() => {
                this.updateSpotlight();
            });
        }, { passive: true });
    },


    /**
     * Update which elements are in the spotlight
     */
    updateSpotlight() {
        // Get viewport center
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;

        // Spotlight zone (percentage of viewport)
        const spotlightZoneY = window.innerHeight * 0.15; // 15% buffer above/below center
        const spotlightZoneX = window.innerWidth * 0.20; // 20% buffer left/right of center

        // Get all spotlight-able elements
        const elements = document.querySelectorAll(this.spotlightSelectors.join(','));

        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;

            let isInSpotlight = false;

            if (this.scrollDirection === 'vertical') {
                // Vertical scroll: check if element center is near horizontal center line
                isInSpotlight = (
                    elementCenterY > (viewportCenterY - spotlightZoneY) &&
                    elementCenterY < (viewportCenterY + spotlightZoneY) &&
                    rect.left < window.innerWidth &&
                    rect.right > 0
                );
            } else {
                // Horizontal scroll: check if element center is near vertical center line
                isInSpotlight = (
                    elementCenterX > (viewportCenterX - spotlightZoneX) &&
                    elementCenterX < (viewportCenterX + spotlightZoneX) &&
                    rect.top < window.innerHeight &&
                    rect.bottom > 0
                );
            }

            // Apply or remove spotlight class
            if (isInSpotlight) {
                if (!this.currentSpotlighted.has(element)) {
                    element.classList.add(this.spotlightClass);
                    this.currentSpotlighted.add(element);
                }
            } else {
                if (this.currentSpotlighted.has(element)) {
                    element.classList.remove(this.spotlightClass);
                    this.currentSpotlighted.delete(element);
                }
            }
        });
    },


    /**
     * Manually refresh (call after DOM changes)
     */
    refresh() {
        this.findHorizontalContainers();
        this.updateSpotlight();
    }
};


// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    MobileSpotlight.init();
});

// Re-initialize after dynamic content loads
window.addEventListener('load', () => {
    setTimeout(() => MobileSpotlight.refresh(), 500);
});

// Make available globally
window.MobileSpotlight = MobileSpotlight;
