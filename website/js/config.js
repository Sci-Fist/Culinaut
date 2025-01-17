export const config = {
    api: {
        baseUrl: '/api',
        endpoints: {
            menu: '/menu',
            blog: '/blog',
            seasonal: '/seasonal',
            reservations: '/reservations'
        }
    },
    images: {
        sizes: {
            thumbnail: 300,
            medium: 600,
            large: 1200
        },
        formats: ['webp', 'jpg'],
        quality: 80
    },
    pagination: {
        itemsPerPage: 6,
        maxPages: 5
    },
    languages: ['de', 'en'],
    defaultLanguage: 'de',
    features: {
        darkMode: true,
        animations: true,
        lazyLoading: true,
        offlineSupport: true
    },
    paths: {
        assets: '/assets',
        images: '/assets/images',
        icons: '/assets/icons'
    }
};

export const theme = {
    colors: {
        primary: '#1a1a1a',
        secondary: '#333333',
        accent: '#e6b17e',
        text: '#ffffff',
        textSecondary: '#cccccc',
        background: '#121212',
        error: '#ff4444',
        success: '#44ff44',
        warning: '#ffaa44'
    },
    fonts: {
        primary: "'Montserrat', sans-serif",
        secondary: "'Playfair Display', serif"
    },
    breakpoints: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1440px'
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '2rem',
        xl: '4rem'
    }
};
