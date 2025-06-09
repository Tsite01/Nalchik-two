
// Cuisine page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const dishCards = document.querySelectorAll('.dish-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter dishes
            dishCards.forEach(card => {
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

    // Restaurant card hover effects
    const restaurantCards = document.querySelectorAll('.restaurant-card');
    
    restaurantCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Dish card hover effects
    const dishCardsElements = document.querySelectorAll('.dish-card');
    
    dishCardsElements.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.querySelector('.dish-image').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.querySelector('.dish-image').style.transform = 'scale(1)';
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
    const allCards = document.querySelectorAll('.dish-card, .restaurant-card, .tip-card');
    allCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Restaurant button actions
    const restaurantButtons = document.querySelectorAll('.restaurant-btn');
    
    restaurantButtons.forEach(button => {
        button.addEventListener('click', function() {
            const restaurantName = this.closest('.restaurant-card').querySelector('h3').textContent;
            
            // Simple action for now - could be extended to open modal or redirect
            if (this.textContent === 'Забронировать') {
                alert(`Функция бронирования для "${restaurantName}" будет доступна в ближайшее время!`);
            } else {
                alert(`Подробная информация о "${restaurantName}" загружается...`);
            }
            
            // Add button click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Smooth scroll for sections
    function smoothScroll() {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.scrollBehavior = 'smooth';
        });
    }
    
    smoothScroll();

    // Add loading effect for images
    const images = document.querySelectorAll('.dish-image, .restaurant-image');
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
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .filter-btn.active {
        animation: pulse 0.3s ease;
    }
`;
document.head.appendChild(style);
