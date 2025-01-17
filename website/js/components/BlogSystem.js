import { config } from '../config.js';
import utils from '../core/utils.js';

class EnhancedBlogSystem {
    constructor() {
        this.state = {
            posts: [],
            currentPage: 1,
            postsPerPage: 6,
            currentCategory: 'all',
            searchTerm: '',
            loading: false
        };
        
        this.init();
    }

    async init() {
        try {
            await this.loadPosts();
            this.setupEventListeners();
            this.setupSearch();
            this.setupFilters();
            this.renderPosts();
            this.initializePagination();
        } catch (error) {
            console.error('Blog initialization failed:', error);
            this.showError('Fehler beim Laden der Blog-Beiträge');
        }
    }

    async loadPosts() {
        this.state.loading = true;
        try {
            const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.blog}`);
            if (!response.ok) throw new Error('Blog fetch failed');
            this.state.posts = await response.json();
        } catch (error) {
            throw new Error('Failed to load blog posts');
        } finally {
            this.state.loading = false;
        }
    }

    setupEventListeners() {
        // Category filters
        utils.dom.selectAll('.blog-category').forEach(category => {
            category.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByCategory(e.target.dataset.category);
            });
        });

        // Search input
        const searchInput = utils.dom.select('.blog-search');
        if (searchInput) {
            searchInput.addEventListener('input', utils.performance.debounce((e) => {
                this.searchPosts(e.target.value);
            }, 300));
        }
    }

    setupSearch() {
        const searchForm = utils.dom.select('.blog-search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const searchTerm = new FormData(e.target).get('search');
                this.searchPosts(searchTerm);
            });
        }
    }

    searchPosts(term) {
        this.state.searchTerm = term.toLowerCase();
        this.state.currentPage = 1;
        this.renderPosts();
    }

    filterByCategory(category) {
        this.state.currentCategory = category;
        this.state.currentPage = 1;
        this.renderPosts();
        
        // Update active state of category buttons
        utils.dom.selectAll('.blog-category').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
    }

    getFilteredPosts() {
        return this.state.posts.filter(post => {
            const matchesSearch = this.state.searchTerm === '' ||
                post.title.toLowerCase().includes(this.state.searchTerm) ||
                post.content.toLowerCase().includes(this.state.searchTerm);

            const matchesCategory = this.state.currentCategory === 'all' ||
                post.categories.includes(this.state.currentCategory);

            return matchesSearch && matchesCategory;
        });
    }

    renderPosts() {
        const container = utils.dom.select('.blog-posts-container');
        if (!container) return;

        const filteredPosts = this.getFilteredPosts();
        const start = (this.state.currentPage - 1) * this.state.postsPerPage;
        const paginatedPosts = filteredPosts.slice(start, start + this.state.postsPerPage);

        if (paginatedPosts.length === 0) {
            container.innerHTML = this.createEmptyState();
            return;
        }

        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        paginatedPosts.forEach(post => {
            fragment.appendChild(this.createBlogPost(post));
        });

        container.appendChild(fragment);
        this.updatePagination(filteredPosts.length);
    }

    createBlogPost(post) {
        const element = utils.dom.create('article', {
            class: 'blog-post',
            'data-aos': 'fade-up'
        });

        const readingTime = this.calculateReadingTime(post.content);
        const formattedDate = utils.date.format(post.date);

        element.innerHTML = `
            <div class="blog-post-inner">
                <div class="blog-post-image">
                    <img data-src="${post.image}" alt="${post.title}" loading="lazy">
                </div>
                <div class="blog-post-content">
                    <div class="blog-meta">
                        <span class="date">${formattedDate}</span>
                        <span class="author">${post.author}</span>
                        <span class="reading-time">${readingTime} min Lesezeit</span>
                    </div>
                    <h2>${post.title}</h2>
                    <p>${post.excerpt}</p>
                    <div class="blog-tags">
                        ${post.tags.map(tag => `
                            <span class="tag">${tag}</span>
                        `).join('')}
                    </div>
                    <button class="read-more-btn" onclick="showBlogDetail(${post.id})">
                        Weiterlesen
                    </button>
                </div>
            </div>
        `;

        return element;
    }

    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.trim().split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    }

    createEmptyState() {
        return `
            <div class="empty-state">
                <h3>Keine Blog-Beiträge gefunden</h3>
                <p>Versuchen Sie es mit anderen Suchkriterien.</p>
            </div>
        `;
    }

    async showBlogDetail(id) {
        const post = this.state.posts.find(p => p.id === id);
        if (!post) return;

        const modal = utils.dom.create('div', { class: 'blog-modal' });
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" aria-label="Schließen">&times;</button>
                <article class="blog-detail">
                    <img src="${post.image}" alt="${post.title}" class="blog-detail-image">
                    <div class="blog-detail-content">
                        <h1>${post.title}</h1>
                        <div class="blog-meta">
                            <span class="date">${utils.date.format(post.date)}</span>
                            <span class="author">${post.author}</span>
                            <span class="reading-time">
                                ${this.calculateReadingTime(post.content)} min Lesezeit
                            </span>
                        </div>
                        <div class="blog-content">
                            ${post.content}
                        </div>
                        <div class="blog-tags">
                            ${post.tags.map(tag => `
                                <span class="tag">${tag}</span>
                            `).join('')}
                        </div>
                        <div class="blog-share">
                            <h4>Teilen Sie diesen Artikel:</h4>
                            ${this.createShareButtons(post)}
                        </div>
                        ${await this.getRelatedPosts(post)}
                    </div>
                </article>
            </div>
        `;

        document.body.appendChild(modal);
        await utils.animation.fadeIn(modal);

        modal.querySelector('.close-modal').addEventListener('click', async () => {
            await utils.animation.fadeOut(modal);
            modal.remove();
        });
    }

    createShareButtons(post) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(post.title);

        return `
            <div class="share-buttons">
                <button onclick="window.open('https://twitter.com/share?url=${url}&text=${title}', '_blank')"
                        aria-label="Auf Twitter teilen">
                    <i class="fab fa-twitter"></i>
                </button>
                <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${url}', '_blank')"
                        aria-label="Auf Facebook teilen">
                    <i class="fab fa-facebook"></i>
                </button>
                <button onclick="window.open('https://www.linkedin.com/shareArticle?url=${url}&title=${title}', '_blank')"
                        aria-label="Auf LinkedIn teilen">
                    <i class="fab fa-linkedin"></i>
                </button>
            </div>
        `;
    }

    async getRelatedPosts(currentPost) {
        const related = this.state.posts
            .filter(post => 
                post.id !== currentPost.id &&
                post.tags.some(tag => currentPost.tags.includes(tag))
            )
            .slice(0, 3);

        if (related.length === 0) return '';

        return `
            <div class="related-posts">
                <h3>Ähnliche Artikel</h3>
                <div class="related-posts-grid">
                    ${related.map(post => `
                        <div class="related-post" onclick="showBlogDetail(${post.id})">
                            <img src="${post.image}" alt="${post.title}">
                            <h4>${post.title}</h4>
                            <p>${post.excerpt.substring(0, 100)}...</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    initializePagination() {
        const paginationContainer = utils.dom.select('.blog-pagination');
        if (!paginationContainer) return;

        paginationContainer.addEventListener('click', (e) => {
            if (e.target.matches('.pagination-button')) {
                const page = parseInt(e.target.dataset.page);
                this.changePage(page);
            }
        });
    }

    updatePagination(totalPosts) {
        const paginationContainer = utils.dom.select('.blog-pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(totalPosts / this.state.postsPerPage);
        let paginationHtml = '';

        if (totalPages > 1) {
            paginationHtml = `
                <button class="pagination-button" 
                        data-page="${this.state.currentPage - 1}"
                        ${this.state.currentPage === 1 ? 'disabled' : ''}>
                    Zurück
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                paginationHtml += `
                    <button class="pagination-button ${i === this.state.currentPage ? 'active' : ''}"
                            data-page="${i}">
                        ${i}
                    </button>
                `;
            }

            paginationHtml += `
                <button class="pagination-button"
                        data-page="${this.state.currentPage + 1}"
                        ${this.state.currentPage === totalPages ? 'disabled' : ''}>
                    Weiter
                </button>
            `;
        }

        paginationContainer.innerHTML = paginationHtml;
    }

    changePage(page) {
        if (page < 1 || page > Math.ceil(this.getFilteredPosts().length / this.state.postsPerPage)) {
            return;
        }
        this.state.currentPage = page;
        this.renderPosts();
        window.scrollTo({
            top: utils.dom.select('.blog-section').offsetTop - 100,
            behavior: 'smooth'
        });
    }

    showError(message) {
        const errorElement = utils.dom.create('div', { 
            class: 'error-message',
            'aria-live': 'polite'
        }, [message]);
        
        utils.dom.select('.blog-section').prepend(errorElement);
        setTimeout(() => errorElement.remove(), 5000);
    }
}

export default new EnhancedBlogSystem();
