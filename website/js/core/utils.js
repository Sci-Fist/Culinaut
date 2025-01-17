import { config } from '../config.js';

export const utils = {
    // DOM Utilities
    dom: {
        select: (selector, parent = document) => parent.querySelector(selector),
        selectAll: (selector, parent = document) => Array.from(parent.querySelectorAll(selector)),
        create: (tag, attributes = {}, children = []) => {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'class') {
                    element.className = value;
                } else if (key === 'dataset') {
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        element.dataset[dataKey] = dataValue;
                    });
                } else {
                    element.setAttribute(key, value);
                }
            });
            children.forEach(child => element.appendChild(
                typeof child === 'string' ? document.createTextNode(child) : child
            ));
            return element;
        }
    },

    // Animation Utilities
    animation: {
        fadeIn: (element, duration = 300) => {
            element.style.opacity = '0';
            element.style.display = 'block';
            element.style.transition = `opacity ${duration}ms ease`;
            setTimeout(() => element.style.opacity = '1', 10);
            return new Promise(resolve => setTimeout(resolve, duration));
        },
        fadeOut: (element, duration = 300) => {
            element.style.opacity = '0';
            return new Promise(resolve => {
                setTimeout(() => {
                    element.style.display = 'none';
                    resolve();
                }, duration);
            });
        },
        slideDown: (element, duration = 300) => {
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.transition = `height ${duration}ms ease`;
            element.style.display = 'block';
            const height = element.scrollHeight;
            element.style.height = height + 'px';
            return new Promise(resolve => {
                setTimeout(() => {
                    element.style.height = '';
                    element.style.overflow = '';
                    resolve();
                }, duration);
            });
        }
    },

    // Image Utilities
    image: {
        load: async (src, options = {}) => {
            const img = new Image();
            const promise = new Promise((resolve, reject) => {
                img.onload = () => resolve(img);
                img.onerror = reject;
            });
            img.src = src;
            return promise;
        },
        optimize: (src, width, format = 'webp') => {
            return `${config.paths.images}/optimized/${width}/${src}.${format}`;
        }
    },

    // Storage Utilities
    storage: {
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.warn('Storage get error:', error);
                return defaultValue;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.warn('Storage set error:', error);
                return false;
            }
        }
    },

    // Date Utilities
    date: {
        format: (date, locale = 'de-DE') => {
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(new Date(date));
        },
        isValid: (date) => {
            const d = new Date(date);
            return d instanceof Date && !isNaN(d);
        }
    },

    // Performance Utilities
    performance: {
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        throttle: (func, limit) => {
            let inThrottle;
            return function executedFunction(...args) {
                if (!inThrottle) {
                    func(...args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    },

    // Validation Utilities
    validate: {
        email: (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        phone: (phone) => {
            const re = /^\+?[\d\s-]{8,}$/;
            return re.test(phone);
        }
    }
};

export default utils;
