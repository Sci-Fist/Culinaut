// Check authentication
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'login.html';
}

// Initialize TinyMCE
tinymce.init({
    selector: '#post-content',
    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
    height: 400,
    language: 'de',
    skin: 'oxide-dark',
    content_css: 'dark'
});

// Blog post management
class BlogManager {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        this.categories = JSON.parse(localStorage.getItem('blogCategories')) || [
            'Nachhaltigkeit',
            'Rezepte',
            'Ernährung',
            'Events'
        ];
        
        this.initializeEventListeners();
        this.loadPosts();
        this.loadCategories();
    }
    
    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.dataset.view;
                this.showView(view);
            });
        });
        
        // New post form
        document.getElementById('new-post-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePost();
        });
        
        // Category form
        document.getElementById('new-category-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });
    }
    
    showView(view) {
        document.querySelectorAll('.admin-view').forEach(v => v.classList.add('hidden'));
        document.querySelector(`#${view}-view`)?.classList.remove('hidden');
        
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === view) {
                link.classList.add('active');
            }
        });
    }
    
    savePost() {
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = tinymce.get('post-content').getContent();
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim());
        const image = document.querySelector('.image-preview img')?.src || '';
        
        const post = {
            id: Date.now(),
            title,
            category,
            content,
            tags,
            image,
            date: new Date().toISOString(),
            status: 'published'
        };
        
        this.posts.unshift(post);
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
        
        this.showSuccessMessage('Beitrag erfolgreich gespeichert');
        this.loadPosts();
        this.resetForm();
    }
    
    loadPosts() {
        const postsGrid = document.querySelector('.posts-grid');
        if (!postsGrid) return;
        
        postsGrid.innerHTML = this.posts.map(post => `
            <div class="post-card" data-id="${post.id}">
                <div class="post-image">
                    <img src="${post.image || 'placeholder.jpg'}" alt="${post.title}">
                </div>
                <div class="post-content">
                    <div class="post-category">${post.category}</div>
                    <h3>${post.title}</h3>
                    <div class="post-meta">
                        <span>${new Date(post.date).toLocaleDateString('de-DE')}</span>
                        <span>${post.status}</span>
                    </div>
                    <div class="post-actions">
                        <button onclick="blogManager.editPost(${post.id})">
                            <i class="fas fa-edit"></i> Bearbeiten
                        </button>
                        <button onclick="blogManager.deletePost(${post.id})">
                            <i class="fas fa-trash"></i> Löschen
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    editPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;
        
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-category').value = post.category;
        tinymce.get('post-content').setContent(post.content);
        document.getElementById('post-tags').value = post.tags.join(', ');
        
        if (post.image) {
            const preview = document.querySelector('.image-preview');
            preview.innerHTML = `<img src="${post.image}" alt="${post.title}">`;
        }
        
        this.showView('new');
    }
    
    deletePost(id) {
        if (!confirm('Möchten Sie diesen Beitrag wirklich löschen?')) return;
        
        this.posts = this.posts.filter(p => p.id !== id);
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
        this.loadPosts();
        this.showSuccessMessage('Beitrag erfolgreich gelöscht');
    }
    
    addCategory() {
        const input = document.getElementById('category-name');
        const category = input.value.trim();
        
        if (!category) return;
        
        if (!this.categories.includes(category)) {
            this.categories.push(category);
            localStorage.setItem('blogCategories', JSON.stringify(this.categories));
            this.loadCategories();
            input.value = '';
            this.showSuccessMessage('Kategorie erfolgreich hinzugefügt');
        }
    }
    
    loadCategories() {
        // Update category select in new post form
        const select = document.getElementById('post-category');
        if (select) {
            select.innerHTML = `
                <option value="">Kategorie wählen</option>
                ${this.categories.map(cat => `
                    <option value="${cat}">${cat}</option>
                `).join('')}
            `;
        }
        
        // Update categories list
        const list = document.querySelector('.categories-list');
        if (list) {
            list.innerHTML = this.categories.map(cat => `
                <div class="category-item">
                    <span>${cat}</span>
                    <button onclick="blogManager.deleteCategory('${cat}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    deleteCategory(category) {
        if (!confirm('Möchten Sie diese Kategorie wirklich löschen?')) return;
        
        this.categories = this.categories.filter(c => c !== category);
        localStorage.setItem('blogCategories', JSON.stringify(this.categories));
        this.loadCategories();
        this.showSuccessMessage('Kategorie erfolgreich gelöscht');
    }
    
    resetForm() {
        document.getElementById('new-post-form').reset();
        tinymce.get('post-content').setContent('');
        document.querySelector('.image-preview').innerHTML = '';
    }
    
    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize blog manager
const blogManager = new BlogManager(); 