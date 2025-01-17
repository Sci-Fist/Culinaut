import { config, theme } from '../config.js';
import utils from '../core/utils.js';

class MenuSystem {
    constructor() {
        this.state = {
            items: [],
            filters: {
                category: 'all',
                dietary: {
                    vegan: false,
                    vegetarian: false,
                    glutenFree: false
                },
                priceRange: {
                    min: 0,
                    max: 100
                },
                allergens: new Set()
            },
            currentView: 'grid',
            sortBy: 'recommended'
        };

        this.init();
    }

    async init() {
        try {
            await this.loadMenuItems();
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.render();
        } catch (error) {
            console.error('Menu initialization failed:', error);
            this.showError('Fehler beim Laden der Speisekarte');
        }
    }

    async loadMenuItems() {
        try {
            const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.menu}`);
            if (!response.ok) throw new Error('Menu fetch failed');
            this.state.items = await response.json();
        } catch (error) {
            throw new Error('Failed to load menu items');
        }
    }

    setupEventListeners() {
        // Filter listeners
        utils.dom.selectAll('.menu-filter').forEach(filter => {
            filter.addEventListener('change', (e) => {
                const { name, value, type, checked } = e.target;
                if (type === 'checkbox') {
                    this.state.filters.dietary[name] = checked;
                } else {
                    this.state.filters[name] = value;
                }
                this.updateMenu();
            });
        });

        // Sort listeners
        utils.dom.select('.menu-sort').addEventListener('change', (e) => {
            this.state.sortBy = e.target.value;
            this.updateMenu();
        });

        // View toggle
        utils.dom.select('.view-toggle').addEventListener('click', (e) => {
            this.state.currentView = e.target.dataset.view;
            this.updateMenu();
        });

        // Price range slider
        const priceSlider = utils.dom.select('.price-range');
        if (priceSlider) {
            noUiSlider.create(priceSlider, {
                start: [0, 100],
                connect: true,
                range: {
                    'min': 0,
                    'max': 100
                }
            });

            priceSlider.noUiSlider.on('update', (values) => {
                this.state.filters.priceRange = {
                    min: parseInt(values[0]),
                    max: parseInt(values[1])
                };
                this.updateMenu();
            });
        }
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        utils.image.load(img.dataset.src)
                            .then(() => {
                                img.src = img.dataset.src;
                                img.classList.add('loaded');
                            })
                            .catch(() => {
                                img.src = '/assets/images/fallback-dish.jpg';
                            });
                        observer.unobserve(img);
                    }
                }
            });
        }, options);

        utils.dom.selectAll('.menu-item-image img').forEach(img => {
            observer.observe(img);
        });
    }

    updateMenu() {
        const filteredItems = this.filterItems();
        const sortedItems = this.sortItems(filteredItems);
        this.renderItems(sortedItems);
    }

    filterItems() {
        return this.state.items.filter(item => {
            const { dietary, priceRange, allergens } = this.state.filters;
            
            // Dietary requirements
            if (dietary.vegan && !item.vegan) return false;
            if (dietary.vegetarian && !item.vegetarian) return false;
            if (dietary.glutenFree && !item.glutenFree) return false;

            // Price range
            if (item.price < priceRange.min || item.price > priceRange.max) return false;

            // Allergens
            if (allergens.size > 0) {
                const hasAllergies = Array.from(allergens).some(allergen => 
                    item.allergens.includes(allergen)
                );
                if (hasAllergies) return false;
            }

            return true;
        });
    }

    sortItems(items) {
        switch (this.state.sortBy) {
            case 'price-asc':
                return [...items].sort((a, b) => a.price - b.price);
            case 'price-desc':
                return [...items].sort((a, b) => b.price - a.price);
            case 'name':
                return [...items].sort((a, b) => a.name.localeCompare(b.name));
            default:
                return items; // Keep recommended order
        }
    }

    renderItems(items) {
        const container = utils.dom.select('.menu-items-container');
        container.innerHTML = '';

        if (items.length === 0) {
            container.appendChild(this.createEmptyState());
            return;
        }

        const fragment = document.createDocumentFragment();
        items.forEach(item => {
            fragment.appendChild(this.createMenuItem(item));
        });

        container.appendChild(fragment);
        this.setupIntersectionObserver();
    }

    createMenuItem(item) {
        const element = utils.dom.create('div', {
            class: `menu-item ${this.state.currentView}-view`,
            'data-id': item.id
        });

        element.innerHTML = `
            <div class="menu-item-inner">
                <div class="menu-item-image">
                    <img data-src="${item.image}" alt="${item.name}" loading="lazy">
                    ${this.createDietaryIcons(item)}
                </div>
                <div class="menu-item-content">
                    <h3>${item.name}</h3>
                    <p class="description">${item.description}</p>
                    <div class="price">${item.price.toFixed(2)} €</div>
                    ${this.createAllergenInfo(item)}
                </div>
            </div>
        `;

        element.addEventListener('click', () => this.showItemDetail(item));
        return element;
    }

    createDietaryIcons(item) {
        const icons = [];
        if (item.vegan) icons.push('vegan');
        if (item.vegetarian) icons.push('vegetarian');
        if (item.glutenFree) icons.push('gluten-free');

        return `
            <div class="dietary-icons">
                ${icons.map(icon => `
                    <span class="icon icon-${icon}" 
                          title="${icon.charAt(0).toUpperCase() + icon.slice(1)}">
                    </span>
                `).join('')}
            </div>
        `;
    }

    createAllergenInfo(item) {
        if (!item.allergens.length) return '';

        return `
            <div class="allergen-info">
                <span class="allergen-label">Allergene:</span>
                ${item.allergens.map(allergen => `
                    <span class="allergen-tag" title="${this.getAllergenName(allergen)}">
                        ${allergen}
                    </span>
                `).join('')}
            </div>
        `;
    }

    getAllergenName(code) {
        const allergenMap = {
            A: 'Glutenhaltiges Getreide',
            B: 'Krebstiere',
            C: 'Ei',
            D: 'Fisch',
            E: 'Erdnüsse',
            F: 'Soja',
            G: 'Milch/Laktose',
            H: 'Schalenfrüchte',
            I: 'Sellerie',
            J: 'Senf',
            K: 'Sesam',
            L: 'Sulfite',
            M: 'Lupinen',
            N: 'Weichtiere'
        };
        return allergenMap[code] || code;
    }

    createEmptyState() {
        return utils.dom.create('div', { class: 'empty-state' }, [
            `<h3>Keine Gerichte gefunden</h3>
             <p>Bitte passen Sie Ihre Filtereinstellungen an.</p>`
        ]);
    }

    async showItemDetail(item) {
        const modal = utils.dom.create('div', { class: 'menu-modal' });
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" aria-label="Schließen">&times;</button>
                <div class="modal-body">
                    <div class="item-gallery">
                        <img src="${item.image}" alt="${item.name}">
                        ${item.gallery ? this.createGallery(item.gallery) : ''}
                    </div>
                    <div class="item-details">
                        <h2>${item.name}</h2>
                        <p class="description">${item.description}</p>
                        <div class="price">${item.price.toFixed(2)} €</div>
                        ${this.createDietaryIcons(item)}
                        ${this.createAllergenInfo(item)}
                        ${item.ingredients ? this.createIngredientsList(item.ingredients) : ''}
                        ${item.nutritionalInfo ? this.createNutritionalInfo(item.nutritionalInfo) : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        await utils.animation.fadeIn(modal);

        modal.querySelector('.close-modal').addEventListener('click', async () => {
            await utils.animation.fadeOut(modal);
            modal.remove();
        });
    }

    createGallery(images) {
        return `
            <div class="item-gallery-thumbs">
                ${images.map(img => `
                    <img src="${img}" alt="" class="gallery-thumb">
                `).join('')}
            </div>
        `;
    }

    createIngredientsList(ingredients) {
        return `
            <div class="ingredients">
                <h4>Zutaten</h4>
                <ul>
                    ${ingredients.map(ingredient => `
                        <li>${ingredient}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    createNutritionalInfo(info) {
        return `
            <div class="nutritional-info">
                <h4>Nährwerte pro 100g</h4>
                <table>
                    ${Object.entries(info).map(([key, value]) => `
                        <tr>
                            <td>${key}</td>
                            <td>${value}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    }

    showError(message) {
        const errorElement = utils.dom.create('div', { class: 'error-message' }, [message]);
        utils.dom.select('.menu-container').prepend(errorElement);
        setTimeout(() => errorElement.remove(), 5000);
    }
}

export default new MenuSystem();
