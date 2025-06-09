
// Places page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const placeCards = document.querySelectorAll('.place-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter places
            placeCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Place card hover effects
    const placeCardsElements = document.querySelectorAll('.place-card');
    
    placeCardsElements.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.querySelector('.place-image').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.querySelector('.place-image').style.transform = 'scale(1)';
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards for scroll animations
    const allCards = document.querySelectorAll('.place-card, .recommendation-card');
    allCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Smooth scroll for filter buttons
    function smoothScroll() {
        const filterSection = document.querySelector('.places-filters');
        if (filterSection) {
            filterSection.style.scrollBehavior = 'smooth';
        }
    }
    
    smoothScroll();

    // Add loading effect for images
    const images = document.querySelectorAll('.place-image');
    images.forEach(img => {
        const imageUrl = img.style.backgroundImage.slice(5, -2);
        const tempImg = new Image();
        
        tempImg.onload = function() {
            img.style.opacity = '1';
        };
        
        img.style.opacity = '0.7';
        img.style.transition = 'opacity 0.3s ease';
        tempImg.src = imageUrl;
    });

    // Filter button animations
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Stagger animation for cards
    function staggerCards() {
        const visibleCards = Array.from(placeCards).filter(card => 
            card.style.display !== 'none'
        );
        
        visibleCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            }, index * 100);
        });
    }

    // Rating stars hover effect
    const ratingStars = document.querySelectorAll('.stars');
    ratingStars.forEach(starGroup => {
        const stars = starGroup.querySelectorAll('i');
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.style.color = '#ffd700';
                        s.style.transform = 'scale(1.1)';
                    }
                });
            });
            
            star.addEventListener('mouseleave', () => {
                stars.forEach(s => {
                    s.style.transform = 'scale(1)';
                });
            });
        });
    });

    // Initialize stagger animation on load
    setTimeout(staggerCards, 500);
});

// Add CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .filter-btn.active {
        animation: pulse 0.3s ease;
    }
    
    .place-card:hover .place-badge {
        animation: slideInRight 0.3s ease;
    }
    
    .recommendation-card:hover .recommendation-icon {
        animation: pulse 0.5s ease infinite;
    }
`;
document.head.appendChild(style);
