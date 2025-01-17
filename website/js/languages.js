import utils from './utils.js';

const translations = {
    de: {
        nav: {
            home: "Startseite",
            about: "Über Uns",
            menu: "Speisekarte",
            services: "Dienstleistungen",
            gallery: "Galerie",
            contact: "Kontakt",
            reservations: "Reservierungen"
        },
        hero: {
            welcome: "Willkommen bei",
            subtitle: "Nachhaltige Kulinarik auf höchstem Niveau",
            cta: "Reservieren Sie Jetzt"
        }
        // Add more translations as needed
    },
    en: {
        nav: {
            home: "Home",
            about: "About",
            menu: "Menu",
            services: "Services",
            gallery: "Gallery",
            contact: "Contact",
            reservations: "Reservations"
        },
        hero: {
            welcome: "Welcome to",
            subtitle: "Sustainable Culinary Excellence",
            cta: "Book Now"
        }
        // Add more translations as needed
    }
};

class LanguageManager {
    constructor() {
        this.defaultLanguage = 'de';
        this.currentLanguage = utils.storage.get('selectedLanguage', this.defaultLanguage);
        this.init();
    }

    init() {
        this.setupLanguageSelector();
        this.updateContent();
        this.setupKeyboardNavigation();
    }

    setupLanguageSelector() {
        const selector = document.querySelector('.language-selector');
        if (!selector) return;

        // Add ARIA labels
        utils.makeAccessible(selector, 'Sprache auswählen', 'Klicken Sie, um die Websitesprache zu ändern');

        // Setup buttons
        const buttons = selector.querySelectorAll('.language-btn');
        buttons.forEach(btn => {
            const lang = btn.dataset.lang;
            utils.makeAccessible(btn, `Sprache auf ${lang === 'de' ? 'Deutsch' : 'Englisch'} ändern`);
            
            btn.addEventListener('click', () => this.setLanguage(lang));
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.setLanguage(lang);
                }
            });
        });
    }
    setLanguage(lang) {
    if (!translations[lang]) return;
        this.currentLanguage = lang;
        utils.storage.set('selectedLanguage', lang);
        this.updateContent();
        
        // Update button states
        document.querySelectorAll('.language-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
            btn.setAttribute('aria-pressed', btn.dataset.lang === lang);
        });

        // Announce language change to screen readers
        this.announceLanguageChange(lang);
    }

    updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(async element => {
        const key = element.getAttribute('data-i18n');
            const value = this.getTranslationByKey(key);
        if (value) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
                    element.setAttribute('aria-label', value);
                } else {
                    element.textContent = value;
        }

                // Handle images with translations
                if (element.dataset.i18nImg) {
                    const imgSrc = await utils.loadImage(
                        `assets/images/${this.currentLanguage}/${element.dataset.i18nImg}`
                    );
                    element.src = imgSrc;
}
            }
        });
    }

    getTranslationByKey(key) {
        try {
            return key.split('.').reduce((obj, k) => obj[k], translations[this.currentLanguage]);
        } catch (error) {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }

    setupKeyboardNavigation() {
        const buttons = document.querySelectorAll('.language-btn');
        buttons.forEach((btn, index) => {
            btn.addEventListener('keydown', (e) => {
                let targetBtn = null;

                switch (e.key) {
                    case 'ArrowRight':
                        targetBtn = buttons[index + 1] || buttons[0];
                        break;
                    case 'ArrowLeft':
                        targetBtn = buttons[index - 1] || buttons[buttons.length - 1];
                        break;
                }

                if (targetBtn) {
                    e.preventDefault();
                    targetBtn.focus();
                }
            });
        });
    }

    announceLanguageChange(lang) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Sprache wurde zu ${lang === 'de' ? 'Deutsch' : 'English'} geändert`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }
}

export default new LanguageManager();