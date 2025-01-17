import { config } from '../config.js';
import utils from '../core/utils.js';

class SeasonalCalendar {
    constructor() {
        this.state = {
            currentSeason: this.getCurrentSeason(),
            products: {},
            recipes: {},
            suppliers: {},
            activeProduct: null
        };
        
        this.init();
    }

    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month >= 2 && month <= 4) return 'spring';
        if (month >= 5 && month <= 7) return 'summer';
        if (month >= 8 && month <= 10) return 'autumn';
        return 'winter';
    }

    async init() {
        try {
            await Promise.all([
                this.loadSeasonalData(),
                this.loadRecipes(),
                this.loadSuppliers()
            ]);
            this.setupEventListeners();
            this.render();
        } catch (error) {
            console.error('Seasonal Calendar initialization failed:', error);
            this.showError('Fehler beim Laden der Saisonalen Daten');
        }
    }

    async loadSeasonalData() {
        try {
            const response = await fetch(`${config.api.baseUrl}/seasonal-products`);
            if (!response.ok) throw new Error('Failed to load seasonal data');
            this.state.products = await response.json();
        } catch (error) {
            throw new Error('Failed to load seasonal products');
        }
    }

    async loadRecipes() {
        try {
            const response = await fetch(`${config.api.baseUrl}/seasonal-recipes`);
            if (!response.ok) throw new Error('Failed to load recipes');
            this.state.recipes = await response.json();
        } catch (error) {
            throw new Error('Failed to load seasonal recipes');
        }
    }

    async loadSuppliers() {
        try {
            const response = await fetch(`${config.api.baseUrl}/local-suppliers`);
            if (!response.ok) throw new Error('Failed to load suppliers');
            this.state.suppliers = await response.json();
        } catch (error) {
            throw new Error('Failed to load local suppliers');
        }
    }

    setupEventListeners() {
        // Season buttons
        utils.dom.selectAll('.season-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.changeSeason(btn.dataset.season);
            });
        });

        // Product interactions
        utils.dom.select('.seasonal-grid').addEventListener('click', (e) => {
            const productItem = e.target.closest('.seasonal-item');
            if (productItem) {
                this.showProductDetails(productItem.dataset.productId);
            }
        });

        // Setup touch interactions
        this.setupTouchInteractions();
    }

    setupTouchInteractions() {
        let startX, startY;
        const container = utils.dom.select('.seasonal-calendar');

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            // Ensure horizontal swipe
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > 50) { // Minimum swipe distance
                    if (diffX > 0) {
                        this.nextSeason();
                    } else {
                        this.previousSeason();
                    }
                }
            }
        }, { passive: true });
    }

    nextSeason() {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        const currentIndex = seasons.indexOf(this.state.currentSeason);
        const nextIndex = (currentIndex + 1) % seasons.length;
        this.changeSeason(seasons[nextIndex]);
    }

    previousSeason() {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        const currentIndex = seasons.indexOf(this.state.currentSeason);
        const prevIndex = (currentIndex - 1 + seasons.length) % seasons.length;
        this.changeSeason(seasons[prevIndex]);
    }

    changeSeason(season) {
        if (this.state.currentSeason === season) return;

        this.state.currentSeason = season;
        this.updateSeasonalContent();
    }

    updateSeasonalContent() {
        // Update active states
        utils.dom.selectAll('.season-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.season === this.state.currentSeason);
        });

        // Update content with animation
        const currentContent = utils.dom.select('.season-content.active');
        const newContent = utils.dom.select(`.season-content[data-season="${this.state.currentSeason}"]`);

        if (currentContent && newContent) {
            currentContent.style.opacity = '0';
            setTimeout(() => {
                currentContent.classList.remove('active');
                newContent.classList.add('active');
                newContent.style.opacity = '1';
                this.animateProducts(newContent);
            }, 300);
        }
    }

    animateProducts(container) {
        const products = container.querySelectorAll('.seasonal-item');
        products.forEach((product, index) => {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            setTimeout(() => {
                product.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    async showProductDetails(productId) {
        const product = this.state.products[this.state.currentSeason]
            .find(p => p.id === productId);
        
        if (!product) return;

        const modal = utils.dom.create('div', { class: 'product-modal' });
        modal.innerHTML = await this.createProductDetailContent(product);

        document.body.appendChild(modal);
        await utils.animation.fadeIn(modal);

        // Setup modal interactions
        this.setupModalInteractions(modal, product);
    }

    async createProductDetailContent(product) {
        const recipes = await this.getProductRecipes(product.id);
        const suppliers = this.getLocalSuppliers(product.id);

        return `
            <div class="modal-content">
                <button class="close-modal" aria-label="Schließen">&times;</button>
                <div class="product-detail">
                    <div class="product-info">
                        <h2>${product.name}</h2>
                        <div class="availability">
                            <h3>Saisonalität</h3>
                            ${this.createAvailabilityChart(product.availability)}
                        </div>
                        <div class="nutrition">
                            <h3>Nährwerte pro 100g</h3>
                            ${this.createNutritionTable(product.nutrition)}
                        </div>
                        <div class="preparation">
                            <h3>Zubereitung & Lagerung</h3>
                            <p>${product.preparation}</p>
                            <p>${product.storage}</p>
                        </div>
                    </div>
                    <div class="product-recipes">
                        <h3>Rezeptvorschläge</h3>
                        ${this.createRecipesList(recipes)}
                    </div>
                    <div class="local-suppliers">
                        <h3>Lokale Bezugsquellen</h3>
                        ${this.createSuppliersList(suppliers)}
                    </div>
                </div>
            </div>
        `;
    }

    createAvailabilityChart(availability) {
        const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
        
        return `
            <div class="availability-chart">
                ${months.map((month, index) => `
                    <div class="month ${availability.includes(index) ? 'available' : ''}">
                        <span class="month-label">${month}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createNutritionTable(nutrition) {
        return `
            <table class="nutrition-table">
                ${Object.entries(nutrition).map(([key, value]) => `
                    <tr>
                        <td>${key}</td>
                        <td>${value}</td>
                    </tr>
                `).join('')}
            </table>
        `;
    }

    createRecipesList(recipes) {
        if (recipes.length === 0) {
            return '<p>Keine Rezepte verfügbar</p>';
        }

        return `
            <div class="recipes-grid">
                ${recipes.map(recipe => `
                    <div class="recipe-card">
                        <img src="${recipe.image}" alt="${recipe.name}">
                        <h4>${recipe.name}</h4>
                        <p>${recipe.description}</p>
                        <button onclick="showRecipeDetail(${recipe.id})">
                            Zum Rezept
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createSuppliersList(suppliers) {
        if (suppliers.length === 0) {
            return '<p>Keine lokalen Anbieter verfügbar</p>';
        }

        return `
            <div class="suppliers-list">
                ${suppliers.map(supplier => `
                    <div class="supplier-card">
                        <h4>${supplier.name}</h4>
                        <p>${supplier.address}</p>
                        <p>${supplier.distance} km entfernt</p>
                        <a href="${supplier.maps}" target="_blank" rel="noopener noreferrer">
                            Auf der Karte anzeigen
                        </a>
                    </div>
                `).join('')}
            </div>
        `;
    }

    async getProductRecipes(productId) {
        return this.state.recipes.filter(recipe => 
            recipe.ingredients.some(ing => ing.productId === productId)
        );
    }

    getLocalSuppliers(productId) {
        return this.state.suppliers.filter(supplier =>
            supplier.products.includes(productId)
        );
    }

    setupModalInteractions(modal, product) {
        // Close button
        modal.querySelector('.close-modal').addEventListener('click', async () => {
            await utils.animation.fadeOut(modal);
            modal.remove();
        });

        // Close on outside click
        modal.addEventListener('click', async (e) => {
            if (e.target === modal) {
                await utils.animation.fadeOut(modal);
                modal.remove();
            }
        });

        // Setup recipe buttons
        modal.querySelectorAll('.recipe-card button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipeId = parseInt(button.dataset.recipeId);
                this.showRecipeDetail(recipeId);
            });
        });

        // Prevent modal content clicks from closing modal
        modal.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                utils.animation.fadeOut(modal).then(() => modal.remove());
            }
        });
    }

    // Add missing methods referenced in the code
    async showRecipeDetail(recipeId) {
        const recipe = this.state.recipes.find(r => r.id === recipeId);
        if (!recipe) return;

        const recipeModal = utils.dom.create('div', { class: 'recipe-modal' });
        recipeModal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" aria-label="Schließen">&times;</button>
                <div class="recipe-detail">
                    <img src="${recipe.image}" alt="${recipe.name}" class="recipe-image">
                    <h2>${recipe.name}</h2>
                    <div class="recipe-info">
                        <span>Zubereitungszeit: ${recipe.prepTime} Min.</span>
                        <span>Schwierigkeit: ${recipe.difficulty}</span>
                        <span>Portionen: ${recipe.servings}</span>
                    </div>
                    <div class="recipe-ingredients">
                        <h3>Zutaten</h3>
                        <ul>
                            ${recipe.ingredients.map(ing => `
                                <li>${ing.amount} ${ing.unit} ${ing.name}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="recipe-steps">
                        <h3>Zubereitung</h3>
                        <ol>
                            ${recipe.steps.map(step => `
                                <li>${step}</li>
                            `).join('')}
                        </ol>
                    </div>
                    <div class="recipe-tips">
                        <h3>Tipps</h3>
                        <p>${recipe.tips}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(recipeModal);
        await utils.animation.fadeIn(recipeModal);
        this.setupModalInteractions(recipeModal);
    }

    showError(message) {
        const errorElement = utils.dom.create('div', { 
            class: 'error-message',
            'aria-live': 'polite'
        }, [message]);
        
        utils.dom.select('.seasonal-calendar').prepend(errorElement);
        setTimeout(() => errorElement.remove(), 5000);
    }
}

export default new SeasonalCalendar();
