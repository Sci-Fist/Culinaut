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
        },
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
        },
        // Add more translations as needed
    }
};

const defaultLanguage = 'de';
let currentLanguage = localStorage.getItem('selectedLanguage') || defaultLanguage;

function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    updateContent();
}

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = translations[currentLanguage];
        keys.forEach(k => {
            value = value[k];
        });
        if (value) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else {
                element.textContent = value;
            }
        }
    });
}
