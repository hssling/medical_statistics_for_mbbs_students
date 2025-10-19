// Medical Statistics Website - Main JavaScript

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuToggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Smooth scrolling for navigation links
    const navAnchors = document.querySelectorAll('a[href^="#"]');
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu after clicking
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    featureCards.forEach(card => {
        card.style.transform = 'translateY(30px)';
        card.style.opacity = '0';
        card.style.transition = 'transform 0.6s, opacity 0.6s';
        observer.observe(card);
    });

    // Learning path step animations
    const pathSteps = document.querySelectorAll('.path-step');
    pathSteps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.2}s`;
        step.classList.add('animate-up');
    });

    // Initialize tooltips for interactive elements
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });

    // Responsive design adjustments
    function adjustLayout() {
        const width = window.innerWidth;

        if (width <= 768) {
            // Mobile layout adjustments
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    // Initialize layout and add resize listener
    adjustLayout();
    window.addEventListener('resize', adjustLayout);

    // Add loading animation to navigation
    const navLinksClickable = document.querySelectorAll('.nav-links a, .feature-link');
    navLinksClickable.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) return;

            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + originalText;
            this.style.pointerEvents = 'none';

            // Re-enable after 2 seconds (in case page doesn't redirect)
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
            }, 2000);
        });
    });
});

// Tooltip functionality
function showTooltip(event) {
    const tooltip = createTooltip(event.target.title);
    document.body.appendChild(tooltip);
    positionTooltip(tooltip, event);
}

function hideTooltip(event) {
    const tooltips = document.querySelectorAll('.custom-tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
}

function createTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.innerHTML = text;
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        max-width: 200px;
    `;
    return tooltip;
}

function positionTooltip(tooltip, event) {
    const rect = tooltip.getBoundingClientRect();
    const x = event.pageX + 10;
    const y = event.pageY + 10;

    // Check if tooltip goes off screen
    if (x + rect.width > window.innerWidth) {
        tooltip.style.left = (x - rect.width - 20) + 'px';
    } else {
        tooltip.style.left = x + 'px';
    }

    tooltip.style.top = y + 'px';
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for additional styles
const additionalCSS = `
<style>
.nav-links.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.no-scroll {
    overflow: hidden;
}

.animate-up {
    animation: slideUp 0.6s ease-out forwards;
}

@keyframes slideUp {
    from {
        transform: translateY(30px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.custom-tooltip {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    line-height: 1.4;
}

body.mobile {
    font-size: 14px;
}

/* Loading spinner */
.fa-spinner {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>`;

document.head.insertAdjacentHTML('beforeend', additionalCSS);
