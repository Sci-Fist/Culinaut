// Utility functions for error handling and common operations
const utils = {
    // Storage handling with fallback
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('Storage error:', error);
                return false;
            }
        },
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('Storage error:', error);
                return defaultValue;
            }
        }
    },

    // Image handling with fallback
    loadImage(src, fallbackSrc = '/assets/images/fallback.jpg') {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(fallbackSrc);
            img.src = src;
        });
    },

    // Accessibility helpers
    makeAccessible(element, label, description = '') {
        element.setAttribute('aria-label', label);
        if (description) {
            const id = `desc-${Math.random().toString(36).substr(2, 9)}`;
            element.setAttribute('aria-describedby', id);
            const descElement = document.createElement('span');
            descElement.id = id;
            descElement.className = 'sr-only';
            descElement.textContent = description;
            element.appendChild(descElement);
        }
    },

    // Lazy loading implementation
    lazyLoad(elements, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                    }
                    observer.unobserve(element);
                }
            });
        }, { ...defaultOptions, ...options });

        elements.forEach(element => observer.observe(element));
    }
};

export default utils;
