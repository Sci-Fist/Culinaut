class BlogSystem {
    constructor() {
        this.blogs = [
            {
                id: 1,
                title: 'Saisonale Küche im Frühling',
                excerpt: 'Entdecken Sie die frischen Aromen des Frühlings in unserer Küche...',
                content: `
                    <p>Der Frühling bringt eine Fülle von frischen, lokalen Zutaten mit sich...</p>
                    <h3>Unsere Frühlingsschätze</h3>
                    <ul>
                        <li>Frischer Spargel aus lokalem Anbau</li>
                        <li>Wilde Kräuter aus dem Umland</li>
                        <li>Erste Erdbeeren der Saison</li>
                    </ul>
                `,
                image: 'assets/images/blog/spring-kitchen.jpg',
                date: '2024-03-15',
                author: 'Chef Michael',
                tags: ['Saisonal', 'Frühling', 'Local Food']
            },
            // Add more blog posts...
        ];

        this.init();
    }

    init() {
        this.renderBlogPreviews();
        this.setupBlogNavigation();
    }

    renderBlogPreviews() {
        const container = document.querySelector('.blog-preview-container');
        if (!container) return;

        this.blogs.slice(0, 3).forEach(blog => {
            container.appendChild(this.createBlogPreview(blog));
        });
    }

    createBlogPreview(blog) {
        const element = document.createElement('article');
        element.className = 'blog-preview';
        element.innerHTML = `
            <div class="blog-preview-image">
                <img src="${blog.image}" alt="${blog.title}">
            </div>
            <div class="blog-preview-content">
                <h3>${blog.title}</h3>
                <div class="blog-meta">
                    <span class="date">${this.formatDate(blog.date)}</span>
                    <span class="author">${blog.author}</span>
                </div>
                <p>${blog.excerpt}</p>
                <a href="/blog/${blog.id}" class="read-more-btn">Weiterlesen</a>
            </div>
        `;
        return element;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    setupBlogNavigation() {
        const blogLinks = document.querySelectorAll('.read-more-btn');
        blogLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const blogId = link.getAttribute('href').split('/').pop();
                this.showBlogDetail(blogId);
            });
        });
    }

    showBlogDetail(blogId) {
        const blog = this.blogs.find(b => b.id === parseInt(blogId));
        if (!blog) return;

        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = `
            <div class="blog-modal-content">
                <button class="close-modal">&times;</button>
                <article class="blog-detail">
                    <div class="blog-header">
                        <h2>${blog.title}</h2>
                        <div class="blog-meta">
                            <span class="date">${this.formatDate(blog.date)}</span>
                            <span class="author">${blog.author}</span>
                        </div>
                    </div>
                    <div class="blog-image">
                        <img src="${blog.image}" alt="${blog.title}">
                    </div>
                    <div class="blog-content">
                        ${blog.content}
                    </div>
                    <div class="blog-tags">
                        ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </article>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
    }
}
