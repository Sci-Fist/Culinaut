// Initialize AOS and handle preloader
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS immediately
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 50
    });

    // Handle preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        // Add fade-out class after a short delay
        setTimeout(() => {
            preloader.classList.add('fade-out');
            // Remove preloader from DOM after fade animation
            setTimeout(() => {
                preloader.remove();
            }, 800);
        }, 500);
    }
});

// Enhanced smooth scroll handling with better positioning
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        const headerHeight = document.querySelector('header').offsetHeight;
        
        // Add active state to nav items
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        
        // Calculate exact scroll position
        let offset = section.offsetTop - headerHeight;
        
        // Adjust offset for specific sections
        if (section.id === 'menu') {
            offset -= 20; // Fine-tune menu section position
        }
        
        window.scrollTo({
            top: offset,
            behavior: 'smooth'
        });
    });
});

// Update active nav item on scroll with improved accuracy
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    const headerHeight = document.querySelector('header').offsetHeight;
    const scrollPosition = window.scrollY + headerHeight + 50; // Added offset for better detection
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const correspondingLink = document.querySelector(`nav a[href="#${section.id}"]`);
            if (correspondingLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        }
    });
});

// Header scroll effect
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for style changes
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Enhanced form handling
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Elegant button state handling
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Wird gesendet...';
        
        // Collect form data
        const formData = new FormData(this);
        
        // Send form data
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Elegant success feedback
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Gesendet';
                submitBtn.style.backgroundColor = 'var(--primary-color)';
                
                // Sophisticated success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.innerHTML = `
                    <div class="success-content">
                        <i class="fas fa-check-circle"></i>
                        <h3>Vielen Dank für Ihre Anfrage</h3>
                        <p>Ich werde mich zeitnah bei Ihnen melden.</p>
                    </div>
                `;
                
                // Animate success message
                successMsg.style.opacity = '0';
                this.appendChild(successMsg);
                setTimeout(() => successMsg.style.opacity = '1', 10);
                
                // Reset form with delay
                setTimeout(() => {
                    this.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Anfrage senden';
                    successMsg.style.opacity = '0';
                    setTimeout(() => successMsg.remove(), 500);
                }, 4000);
            } else {
                throw new Error('Übertragungsfehler');
            }
        })
        .catch(error => {
            // Elegant error handling
            submitBtn.innerHTML = 'Fehler beim Senden';
            submitBtn.style.backgroundColor = '#e74c3c';
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Anfrage senden';
                submitBtn.style.backgroundColor = 'var(--gold)';
            }, 3000);
        });
    });
}

// Smooth reveal animations for sections
const revealSection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

document.querySelectorAll('section').forEach(section => {
    if (!section.classList.contains('hero')) {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        sectionObserver.observe(section);
    }
});

// Elegant hover effects for cards
document.querySelectorAll('.service-card, .philosophy-card, .sustainability-item').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        const icon = card.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1.1)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        const icon = card.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scroll = window.pageYOffset;
        hero.style.backgroundPositionY = `${scroll * 0.5}px`;
    }
});

// Initialize Swiper for menu slider
const menuSwiper = new Swiper('.menu-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 100,
        modifier: 2,
        slideShadows: false,
    },
    pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    speed: 800,
    on: {
        init: function() {
            document.querySelectorAll('.swiper-slide').forEach(slide => {
                slide.style.opacity = '0.4';
            });
            const activeSlide = document.querySelector('.swiper-slide-active');
            if (activeSlide) {
                activeSlide.style.opacity = '1';
            }
        },
        slideChange: function() {
            document.querySelectorAll('.swiper-slide').forEach(slide => {
                slide.style.opacity = '0.4';
                slide.style.transform = 'scale(0.8)';
            });
            const activeSlide = document.querySelector('.swiper-slide-active');
            if (activeSlide) {
                activeSlide.style.opacity = '1';
                activeSlide.style.transform = 'scale(1)';
            }
        }
    }
});

// Seasonal Calendar functionality
function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
}

function initSeasonalCalendar() {
    const currentSeason = getCurrentSeason();
    const buttons = document.querySelectorAll('.season-btn');
    const contents = document.querySelectorAll('.season-content');

    // Set initial active state
    buttons.forEach(btn => {
        if (btn.dataset.season === currentSeason) {
            btn.classList.add('active');
        }
    });

    contents.forEach(content => {
        if (content.dataset.season === currentSeason) {
            content.classList.add('active');
            animateProducts(content);
        }
    });

    // Add click handlers
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const season = btn.dataset.season;
            
            // Update buttons
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update content with fade effect
            contents.forEach(content => {
                if (content.classList.contains('active')) {
                    content.style.opacity = '0';
                    setTimeout(() => {
                        content.classList.remove('active');
                        const newContent = document.querySelector(`.season-content[data-season="${season}"]`);
                        if (newContent) {
                            newContent.classList.add('active');
                            newContent.style.opacity = '1';
                            animateProducts(newContent);
                        }
                    }, 300);
                }
            });
        });
    });
}

function animateProducts(container) {
    const products = container.querySelectorAll('.product-item');
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSeasonalCalendar();
});

// Initialize Leaflet map for sustainability section
const map = L.map('sustainability-map').setView([51.1657, 10.4515], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add markers for local producers
const producers = [
    { lat: 51.1657, lng: 10.4515, name: 'Bio-Hof Schmidt', type: 'Gemüse & Obst' },
    { lat: 51.2, lng: 10.5, name: 'Landwirtschaft Meyer', type: 'Getreide' },
    // Add more producers as needed
];

producers.forEach(producer => {
    const marker = L.marker([producer.lat, producer.lng]).addTo(map);
    marker.bindPopup(`
        <strong>${producer.name}</strong><br>
        ${producer.type}
    `);
});

// Booking system functionality
const bookingTypes = document.querySelectorAll('.booking-type');
const bookingCalendar = document.querySelector('.booking-calendar');

// Menu Modal Functionality with enhanced animations
const menuModal = document.querySelector('.menu-modal');
const closeModal = document.querySelector('.close-modal');
const menuCards = document.querySelectorAll('.menu-card');

// Sample recipe data (in production, this would come from a database)
const recipeData = {
    'Kürbis-Variation': {
        ingredients: [
            '1 Hokkaido-Kürbis aus regionalem Anbau',
            '200g gemischte Waldpilze',
            '100g Maronen',
            'Frische Wildkräuter',
            '200g Belugalinsen',
            'Kürbiskerne für Pesto'
        ],
        preparation: [
            'Kürbis waschen und in Spalten schneiden',
            'Bei 180°C im Ofen rösten bis er weich ist',
            'Pilze und Maronen in Butter anschwitzen',
            'Linsen nach Packungsanweisung kochen',
            'Kürbiskernpesto frisch zubereiten',
            'Alles anrichten und mit Wildkräutern garnieren'
        ],
        sustainability: [
            { icon: 'fa-leaf', text: 'Kürbis aus lokalem Anbau (15km)' },
            { icon: 'fa-seedling', text: 'Wildkräuter aus eigenem Anbau' },
            { icon: 'fa-recycle', text: 'Zero-Waste Zubereitung' }
        ]
    }
    // Add more recipes as needed
};

menuCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        const imgSrc = card.querySelector('img').src;
        
        // Populate modal with smooth transitions
        const modalImage = menuModal.querySelector('.modal-image img');
        const modalTitle = menuModal.querySelector('h2');
        
        modalImage.style.opacity = '0';
        modalTitle.style.opacity = '0';
        
        setTimeout(() => {
            modalImage.src = imgSrc;
            modalTitle.textContent = title;
            
            modalImage.style.opacity = '1';
            modalTitle.style.opacity = '1';
        }, 300);
        
        // Get and populate recipe data
        const recipe = recipeData[title] || {
            ingredients: ['Wird geladen...'],
            preparation: ['Wird geladen...'],
            sustainability: [{ icon: 'fa-leaf', text: 'Wird geladen...' }]
        };
        
        populateRecipeDetails(recipe);
        
        // Show modal with enhanced animation
        menuModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Populate recipe details with animations
const populateRecipeDetails = (recipe) => {
    const ingredientsList = menuModal.querySelector('.ingredients ul');
    const preparationList = menuModal.querySelector('.preparation ol');
    const ecoPoints = menuModal.querySelector('.eco-points');
    
    // Clear existing content
    ingredientsList.innerHTML = '';
    preparationList.innerHTML = '';
    ecoPoints.innerHTML = '';
    
    // Populate with animation
    recipe.ingredients.forEach((ingredient, index) => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        ingredientsList.appendChild(li);
        
        setTimeout(() => {
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
        }, index * 100);
    });
    
    recipe.preparation.forEach((step, index) => {
        const li = document.createElement('li');
        li.textContent = step;
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        preparationList.appendChild(li);
        
        setTimeout(() => {
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
        }, index * 100);
    });
    
    recipe.sustainability.forEach((point, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <i class="fas ${point.icon}"></i>
            <span>${point.text}</span>
        `;
        li.style.opacity = '0';
        li.style.transform = 'translateX(-20px)';
        ecoPoints.appendChild(li);
        
        setTimeout(() => {
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
        }, index * 100);
    });
};

// Close modal with animation
closeModal.addEventListener('click', () => {
    menuModal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal on outside click
menuModal.addEventListener('click', (e) => {
    if (e.target === menuModal) {
        menuModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Enhanced Booking System
const bookingSystem = {
    init() {
        this.setupCalendar();
        this.setupTimeSlots();
        this.handleBookingTypeSelection();
    },
    
    setupCalendar() {
        const calendar = flatpickr(bookingCalendar, {
            inline: true,
            minDate: 'today',
            dateFormat: 'Y-m-d',
            locale: 'de',
            disable: [
                function(date) {
                    // Disable Sundays and past dates
                    return (date.getDay() === 0);
                }
            ],
            onChange: (selectedDates, dateStr) => {
                this.updateAvailableTimeSlots(dateStr);
            }
        });
    },
    
    setupTimeSlots() {
        const container = document.createElement('div');
        container.className = 'time-slots-container';
        bookingCalendar.after(container);
    },
    
    handleBookingTypeSelection() {
        bookingTypes.forEach(type => {
            type.addEventListener('click', () => {
                bookingTypes.forEach(t => t.classList.remove('active'));
                type.classList.add('active');
                this.updateAvailableTimeSlots();
            });
        });
    },
    
    updateAvailableTimeSlots(selectedDate) {
        const activeType = document.querySelector('.booking-type.active');
        if (!activeType) return;
        
        const bookingType = activeType.dataset.type;
        const timeSlots = this.getTimeSlotsForType(bookingType);
        
        const container = document.querySelector('.time-slots-container');
        container.innerHTML = `
            <h3>Verfügbare Zeiten</h3>
            <div class="time-slots">
                ${timeSlots.map(time => `
                    <button class="time-slot" data-time="${time}">
                        ${time} Uhr
                    </button>
                `).join('')}
            </div>
        `;
        
        // Add click handlers for time slots
        container.querySelectorAll('.time-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                container.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
                slot.classList.add('active');
                this.updateBookingSummary(selectedDate, slot.dataset.time);
            });
        });
    },
    
    getTimeSlotsForType(type) {
        const slots = {
            'private-dining': ['18:00', '19:00', '20:00'],
            'workshop': ['10:00', '14:00', '17:00'],
            'consulting': ['09:00', '11:00', '15:00']
        };
        return slots[type] || [];
    },
    
    updateBookingSummary(date, time) {
        const summary = document.querySelector('.booking-summary') || document.createElement('div');
        summary.className = 'booking-summary';
        
        const formattedDate = new Date(date).toLocaleDateString('de-DE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        summary.innerHTML = `
            <h3>Ihre Auswahl</h3>
            <p><i class="far fa-calendar"></i> ${formattedDate}</p>
            <p><i class="far fa-clock"></i> ${time} Uhr</p>
        `;
        
        const container = document.querySelector('.time-slots-container');
        container.appendChild(summary);
    }
};

// Initialize booking system
bookingSystem.init();

// Blog interaction enhancements
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', function() {
        const blogId = this.dataset.blogId;
        // Smooth transition to blog detail view
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            // Navigate to blog detail page if implemented
            // window.location.href = `/blog/${blogId}`;
        }, 200);
    });
});

// Eco-stats animation
const ecoStats = document.querySelectorAll('.stat-card');
const animateValue = (element, start, end, duration) => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const updateValue = () => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = Math.round(end);
            return;
        }
        element.textContent = Math.round(current);
        requestAnimationFrame(updateValue);
    };
    
    requestAnimationFrame(updateValue);
};

// Animate eco-stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValue = entry.target.querySelector('strong');
            const endValue = parseInt(statValue.dataset.value);
            animateValue(statValue, 0, endValue, 2000);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

ecoStats.forEach(stat => statsObserver.observe(stat));

// Scroll Progress Indicator
const scrollProgress = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const height = document.documentElement;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = height.scrollHeight - height.clientHeight;
    const progress = `${(scrollTop / scrollHeight) * 100}%`;
    
    scrollProgress.style.transform = `scaleX(${scrollTop / scrollHeight})`;
});

// Lazy Loading Images with Intersection Observer
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px 0px',
    threshold: 0.1
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Smooth Page Transitions
const transitionElement = document.createElement('div');
transitionElement.className = 'page-transition';
document.body.appendChild(transitionElement);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        // Activate transition
        transitionElement.classList.add('active');
        
        // After transition completes
        setTimeout(() => {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Hide transition
            setTimeout(() => {
                transitionElement.classList.remove('active');
            }, 600);
        }, 600);
    });
});

// Enhanced Seasonal Calendar
const seasonBtns = document.querySelectorAll('.season-btn');
const seasonContents = document.querySelectorAll('.season-content');

// Get current season based on month
const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
};

// Set initial active season with animation
const initializeSeasonalCalendar = () => {
    const currentSeason = getCurrentSeason();
    const activeBtn = document.querySelector(`[data-season="${currentSeason}"]`);
    const activeContent = document.getElementById(currentSeason);
    
    if (activeBtn && activeContent) {
        // Remove active classes
        seasonBtns.forEach(btn => btn.classList.remove('active'));
        seasonContents.forEach(content => content.classList.remove('active'));
        
        // Add active classes
        activeBtn.classList.add('active');
        activeContent.classList.add('active');
        
        // Animate products
        animateProducts(activeContent);
    }
};

// Animate products with stagger effect
const animateProducts = (container) => {
    const products = container.querySelectorAll('.product-item');
    products.forEach((product, index) => {
        product.style.opacity = '0';
        product.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            product.style.opacity = '1';
            product.style.transform = 'translateY(0)';
        }, index * 100);
    });
};

// Season switching with enhanced animations
seasonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const season = btn.dataset.season;
        const content = document.getElementById(season);
        
        if (content) {
            // Remove active classes with fade out
            seasonContents.forEach(c => {
                if (c.classList.contains('active')) {
                    c.style.opacity = '0';
                    setTimeout(() => {
                        c.classList.remove('active');
                        c.style.opacity = '';
                    }, 300);
                }
            });
            
            seasonBtns.forEach(b => b.classList.remove('active'));
            
            // Add active classes with animation
            setTimeout(() => {
                btn.classList.add('active');
                content.classList.add('active');
                animateProducts(content);
            }, 300);
        }
    });
});

// Initialize seasonal calendar
document.addEventListener('DOMContentLoaded', initializeSeasonalCalendar); 