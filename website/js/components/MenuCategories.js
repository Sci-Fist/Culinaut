export const menuCategories = {
    seasonal: {
        title: 'Saisonale Kreationen',
        description: 'Inspiriert von den besten Zutaten der Saison',
        items: [
            {
                id: 'season1',
                name: 'Herbstlicher Kürbis-Risotto',
                description: 'Cremiges Risotto mit Hokkaido-Kürbis, gebratenen Waldpilzen und Parmesan',
                price: 24.50,
                image: 'menu/seasonal/pumpkin-risotto.jpg',
                allergens: ['G', 'L'],
                dietary: {
                    vegetarian: true,
                    vegan: false,
                    glutenFree: false
                },
                seasonal: true
            },
            {
                id: 'season2',
                name: 'Konfierter Saibling',
                description: 'Auf Beluga-Linsen mit glacierten Wurzelgemüse und Schnittlauchsauce',
                price: 32.00,
                image: 'menu/seasonal/char.jpg',
                allergens: ['F'],
                dietary: {
                    vegetarian: false,
                    vegan: false,
                    glutenFree: true
                },
                seasonal: true
            }
            // Add more seasonal items
        ]
    },
    starters: {
        title: 'Vorspeisen',
        description: 'Der perfekte Start in Ihr Menü',
        items: [
            {
                id: 'start1',
                name: 'Variation von der Rote Bete',
                description: 'Mariniert, geschmort und als Espuma mit Ziegenkäse und Walnüssen',
                price: 16.50,
                image: 'menu/starters/beetroot.jpg',
                allergens: ['L', 'H'],
                dietary: {
                    vegetarian: true,
                    vegan: false,
                    glutenFree: true
                }
            },
            // Add more starters
        ]
    },
    mains: {
        title: 'Hauptgerichte',
        description: 'Raffinierte Hauptgänge aus regionalen Produkten',
        items: [
            {
                id: 'main1',
                name: 'Geschmorte Ochsenbacken',
                description: 'Mit Selleriepüree, glasierten Karotten und Rotweinreduktion',
                price: 34.00,
                image: 'menu/mains/beef-cheeks.jpg',
                allergens: ['L', 'I'],
                dietary: {
                    vegetarian: false,
                    vegan: false,
                    glutenFree: true
                }
            },
            // Add more main courses
        ]
    },
    desserts: {
        title: 'Desserts',
        description: 'Süßer Abschluss für Ihr Menü',
        items: [
            {
                id: 'dessert1',
                name: 'Variation von der Valrhona Schokolade',
                description: 'Mousse, Ganache, Sorbet und karamellisierte Haselnüsse',
                price: 14.50,
                image: 'menu/desserts/chocolate.jpg',
                allergens: ['L', 'H', 'G'],
                dietary: {
                    vegetarian: true,
                    vegan: false,
                    glutenFree: false
                }
            },
            // Add more desserts
        ]
    },
    drinks: {
        title: 'Getränke',
        description: 'Sorgfältig ausgewählte Weine und hausgemachte Getränke',
        items: [
            {
                id: 'drink1',
                name: 'Hausgemachte Limonade',
                description: 'Saisonal wechselnde Kreationen aus frischen Früchten',
                price: 6.50,
                image: 'menu/drinks/lemonade.jpg',
                allergens: [],
                dietary: {
                    vegetarian: true,
                    vegan: true,
                    glutenFree: true
                }
            },
            // Add more drinks
        ]
    }
};

