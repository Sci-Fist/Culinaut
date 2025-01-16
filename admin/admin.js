// Check authentication and initialize immediately
if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'login.html';
} else {
    // Initialize blog manager when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        try {
            window.blogManager = new BlogManager();
            console.log('Admin panel initialized successfully');
        } catch (error) {
            console.error('Failed to initialize admin panel:', error);
            alert('Fehler beim Laden des Admin Panels. Bitte laden Sie die Seite neu.');
        }
    });
}

// Blog post management
class BlogManager {
    constructor() {
        console.log('Initializing BlogManager');
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
        this.setupImageUpload();
    }
    
    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.target.closest('a').dataset.view;
                if (view) {
                    this.showView(view);
                    // Initialize TinyMCE when switching to new post view
                    if (view === 'new' && !window.tinymceInitialized) {
                        this.initializeTinyMCE();
                    }
                } else if (e.target.closest('#logout')) {
                    this.handleLogout();
                }
            });
        });
        
        // Forms
        document.getElementById('new-post-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePost();
        });
        
        document.getElementById('new-category-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });
    }
    
    initializeTinyMCE() {
        if (window.tinymce_config && !window.tinymceInitialized) {
            tinymce.init(window.tinymce_config)
                .then(() => {
                    window.tinymceInitialized = true;
                })
                .catch(error => {
                    console.error('TinyMCE initialization failed:', error);
                    this.showError('Editor konnte nicht geladen werden. Bitte laden Sie die Seite neu.');
                });
        }
    }
    
    setupImageUpload() {
        const fileInput = document.getElementById('post-image');
        const preview = document.querySelector('.image-preview');
        const uploadLabel = document.querySelector('.file-upload-label');
        
        if (fileInput && preview) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.type.startsWith('image/')) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                        };
                        reader.readAsDataURL(file);
                    } else {
                        this.showError('Bitte wählen Sie eine gültige Bilddatei aus.');
                    }
                }
            });
            
            // Drag and drop support
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadLabel?.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            
            uploadLabel?.addEventListener('dragover', () => {
                uploadLabel.style.borderColor = 'var(--primary-light)';
                uploadLabel.style.background = 'var(--glass-effect-hover)';
            });
            
            uploadLabel?.addEventListener('dragleave', () => {
                uploadLabel.style.borderColor = '';
                uploadLabel.style.background = '';
            });
            
            uploadLabel?.addEventListener('drop', (e) => {
                const file = e.dataTransfer.files[0];
                if (file) {
                    fileInput.files = e.dataTransfer.files;
                    const event = new Event('change');
                    fileInput.dispatchEvent(event);
                }
                uploadLabel.style.borderColor = '';
                uploadLabel.style.background = '';
            });
        }
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
        try {
            const title = document.getElementById('post-title').value;
            const category = document.getElementById('post-category').value;
            const content = tinymce.get('post-content').getContent();
            const tags = document.getElementById('post-tags').value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag);
            const image = document.querySelector('.image-preview img')?.src || '';
            
            if (!title || !category || !content) {
                throw new Error('Bitte füllen Sie alle erforderlichen Felder aus.');
            }
            
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
            
            this.showSuccess('Beitrag erfolgreich gespeichert');
            this.loadPosts();
            this.resetForm();
        } catch (error) {
            this.showError(error.message);
        }
    }
    
    loadPosts() {
        const postsGrid = document.querySelector('.posts-grid');
        if (!postsGrid) return;
        
        postsGrid.innerHTML = this.posts.map(post => `
            <article class="post-card" data-id="${post.id}">
                <div class="post-image">
                    <img src="${post.image || 'placeholder.jpg'}" alt="${post.title}">
                </div>
                <div class="post-content">
                    <div class="post-category">${post.category}</div>
                    <h3>${post.title}</h3>
                    <div class="post-meta">
                        <span><i class="far fa-calendar"></i> ${new Date(post.date).toLocaleDateString('de-DE')}</span>
                        <span><i class="far fa-bookmark"></i> ${post.status}</span>
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
            </article>
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
        if (confirm('Möchten Sie diesen Beitrag wirklich löschen?')) {
            this.posts = this.posts.filter(p => p.id !== id);
            localStorage.setItem('blogPosts', JSON.stringify(this.posts));
            this.loadPosts();
            this.showSuccess('Beitrag erfolgreich gelöscht');
        }
    }
    
    addCategory() {
        const input = document.getElementById('category-name');
        const category = input.value.trim();
        
        if (!category) {
            this.showError('Bitte geben Sie einen Kategorienamen ein.');
            return;
        }
        
        if (this.categories.includes(category)) {
            this.showError('Diese Kategorie existiert bereits.');
            return;
        }
        
        this.categories.push(category);
        localStorage.setItem('blogCategories', JSON.stringify(this.categories));
        this.loadCategories();
        input.value = '';
        this.showSuccess('Kategorie erfolgreich hinzugefügt');
    }
    
    loadCategories() {
        // Update category select
        const select = document.getElementById('post-category');
        if (select) {
            select.innerHTML = `
                <option value="">Bitte wählen Sie eine Kategorie</option>
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
                    <span><i class="fas fa-folder"></i> ${cat}</span>
                    <button onclick="blogManager.deleteCategory('${cat}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }
    
    deleteCategory(category) {
        if (confirm('Möchten Sie diese Kategorie wirklich löschen?')) {
            this.categories = this.categories.filter(c => c !== category);
            localStorage.setItem('blogCategories', JSON.stringify(this.categories));
            this.loadCategories();
            this.showSuccess('Kategorie erfolgreich gelöscht');
        }
    }
    
    resetForm() {
        document.getElementById('new-post-form').reset();
        tinymce.get('post-content').setContent('');
        document.querySelector('.image-preview').innerHTML = '';
    }
    
    handleLogout() {
        if (confirm('Möchten Sie sich wirklich abmelden?')) {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'login.html';
        }
    }
    
    showSuccess(message) {
        this.showToast(message, 'success');
    }
    
    showError(message) {
        this.showToast(message, 'error');
    }
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Trigger reflow for animation
        toast.offsetHeight;
        
        // Add animation class
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
} 