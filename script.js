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