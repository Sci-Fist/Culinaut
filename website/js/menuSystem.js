class MenuSystem {
    constructor() {
        this.menuItems = {
            starters: [
                {
                    id: 1,
                    name: 'Geschmorte Herbstkürbissuppe',
                    description: 'Mit gerösteten Kürbiskernen, Kürbiskernöl und Crème fraîche',
                    price: '12',
                    allergens: ['G', 'L'],
                    image: 'assets/images/menu/pumpkin-soup.jpg',
                    seasonal: true,
                    vegan: false,
                    vegetarian: true
                },
                // Add more starters...
            ],
            mains: [
                {
                    id: 101,
                    name: 'Konfiertes Saiblingsfilet',
                    description: 'Auf Beluga-Linsen, glasierte Wurzelgemüse, Schnittlauchsauce',
                    price: '32',
                    allergens: ['F', 'L'],
                    image: 'assets/images/menu/char-fillet.jpg',
                    seasonal: true,
                    vegan: false,
                    vegetarian: false
                },
                // Add more main courses...
            ],
            desserts: [
                {
                    id: 201,
                    name: 'Variation von der Valrhona Schokolade',
                    description: 'Mousse, Ganache, Sorbet, karamellisierte Haselnüsse',
                    price: '14',
                    allergens: ['G', 'L', 'N'],
                    image: 'assets/images/menu/chocolate-variation.jpg',
                    seasonal: false,
                    vegan: false,
                    vegetarian: true
                },
                // Add more desserts...
            ]
        };

        this.init();
    }

    init() {
        this.renderMenus();
        this.initializeEventListeners();
    }

    renderMenus() {
        Object.entries(this.menuItems).forEach(([category, items]) => {
            const container = document.querySelector(`#${category}-container`);
            if (!container) return;

            items.forEach(item => {
                container.appendChild(this.createMenuItem(item));
            });
        });
    }

    createMenuItem(item) {
        const element = document.createElement('div');
        element.className = 'menu-item';
        element.setAttribute('data-id', item.id);
        
        element.innerHTML = `
            <div class="menu-item-inner">
                <div class="menu-item-front">
                    <div class="menu-item-image">
                        <img src="${item.image}" alt="${item.name}">
                        ${this.createDietaryIcons(item)}
                    </div>
                    <div class="menu-item-content">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <div class="menu-item-price">${item.price}€</div>
                    </div>
                </div>
            </div>
        `;

        element.addEventListener('click', () => this.showMenuDetail(item));
        return element;
    }

    createDietaryIcons(item) {
        return `
            <div class="dietary-icons">
                ${item.vegan ? '<span class="icon-vegan" title="Vegan"></span>' : ''}
                ${item.vegetarian ? '<span class="icon-vegetarian" title="Vegetarisch"></span>' : ''}
                ${item.seasonal ? '<span class="icon-seasonal" title="Saisonal"></span>' : ''}
            </div>
        `;
    }

    showMenuDetail(item) {
        const modal = document.createElement('div');
        modal.className = 'menu-modal';
        modal.innerHTML = `
            <div class="menu-modal-content">
                <button class="close-modal">&times;</button>
                <div class="menu-detail-container">
                    <div class="menu-detail-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="menu-detail-info">
                        <h2>${item.name}</h2>
                        <p class="menu-detail-description">${item.description}</p>
                        <div class="menu-detail-price">${item.price}€</div>
                        <div class="menu-detail-allergens">
                            <h4>Allergene:</h4>
                            <p>${this.formatAllergens(item.allergens)}</p>
                        </div>
                        ${this.createDietaryIcons(item)}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
    }

    formatAllergens(allergens) {
        const allergenMap = {
            G: 'Gluten',
            L: 'Laktose',
            N: 'Nüsse',
            F: 'Fisch',
            // Add more allergens...
        };
        return allergens.map(a => allergenMap[a]).join(', ');
    }

    initializeEventListeners() {
        // Add filter functionality if needed
        const filterButtons = document.querySelectorAll('.menu-filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterMenuItems(filter);
            });
        });
    }

    filterMenuItems(filter) {
        const items = document.querySelectorAll('.menu-item');
        items.forEach(item => {
            const shouldShow = filter === 'all' || item.classList.contains(filter);
            item.style.display = shouldShow ? 'block' : 'none';
        });
    }
}