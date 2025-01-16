// Initialize AOS with slower animations
AOS.init({
    duration: 1200,
    easing: 'ease-out',
    once: true,
    offset: 100
});

// Smooth scroll handling with elegant easing
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
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
const menuSlider = new Swiper('.menu-slider', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    centeredSlides: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
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

// Initialize Flatpickr calendar
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
    onChange: function(selectedDates, dateStr) {
        updateBookingForm(dateStr);
    }
});

// Booking type selection
bookingTypes.forEach(type => {
    type.addEventListener('click', () => {
        // Remove active class from all types
        bookingTypes.forEach(t => t.classList.remove('active'));
        // Add active class to selected type
        type.classList.add('active');
        // Update available time slots based on type
        updateTimeSlots(type.dataset.type);
    });
});

function updateTimeSlots(bookingType) {
    const timeSlots = {
        'private-dining': ['18:00', '19:00', '20:00'],
        'workshop': ['10:00', '14:00', '17:00'],
        'consulting': ['09:00', '11:00', '15:00']
    };
    
    const timeSlotsContainer = document.querySelector('.time-slots');
    if (timeSlotsContainer && timeSlots[bookingType]) {
        timeSlotsContainer.innerHTML = timeSlots[bookingType]
            .map(time => `
                <button class="time-slot" data-time="${time}">
                    ${time} Uhr
                </button>
            `).join('');
    }
}

function updateBookingForm(selectedDate) {
    const selectedDateDisplay = document.querySelector('.selected-date');
    if (selectedDateDisplay) {
        selectedDateDisplay.textContent = new Date(selectedDate)
            .toLocaleDateString('de-DE', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
    }
}

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

// Seasonal Calendar Functionality
const seasonBtns = document.querySelectorAll('.season-btn');
const seasonContents = document.querySelectorAll('.season-content');

// Automatically set current season
const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
};

// Set initial active season
const currentSeason = getCurrentSeason();
document.querySelector(`[data-season="${currentSeason}"]`).classList.add('active');
document.getElementById(currentSeason).classList.add('active');

// Season switching functionality
seasonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active classes
        seasonBtns.forEach(b => b.classList.remove('active'));
        seasonContents.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        const season = btn.dataset.season;
        document.getElementById(season).classList.add('active');
        
        // Animate products
        const products = document.querySelectorAll(`#${season} .product-item`);
        products.forEach((product, index) => {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });
});

// Animate products on initial load
const currentProducts = document.querySelectorAll(`#${currentSeason} .product-item`);
currentProducts.forEach((product, index) => {
    product.style.opacity = '0';
    product.style.transform = 'translateY(20px)';
    setTimeout(() => {
        product.style.opacity = '1';
        product.style.transform = 'translateY(0)';
    }, index * 100);
}); 