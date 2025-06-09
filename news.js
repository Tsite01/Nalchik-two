
// News page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsCards = document.querySelectorAll('.news-card');
    const searchInput = document.getElementById('newsSearch');

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 6;
    let filteredCards = [...newsCards];

    // Add sort controls
    addSortControls();
    
    // Add news statistics
    addNewsStats();

    // Filter by category
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter news cards
            filterNewsCards(filterValue, searchInput.value);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Search functionality
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const searchTerm = this.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-category');
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            filterNewsCards(activeFilter, searchTerm);
        }, 300);
    });

    // Filter function
    function filterNewsCards(category, searchTerm) {
        filteredCards = [];
        
        newsCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('.news-title').textContent.toLowerCase();
            const cardExcerpt = card.querySelector('.news-excerpt').textContent.toLowerCase();
            
            const matchesCategory = category === 'all' || cardCategory === category;
            const matchesSearch = searchTerm === '' || 
                                cardTitle.includes(searchTerm) || 
                                cardExcerpt.includes(searchTerm);
            
            if (matchesCategory && matchesSearch) {
                filteredCards.push(card);
                card.classList.remove('hidden');
                // Staggered animation
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.6s ease forwards';
                }, index * 100);
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Reset to first page
        currentPage = 1;
        updatePagination();
        updateNewsStats();
    }

    // Sort functionality
    function addSortControls() {
        const controlsContainer = document.querySelector('.news-controls .container');
        const sortControlsHTML = `
            <div class="sort-controls">
                <button class="sort-btn active" data-sort="date-desc">Новые первые</button>
                <button class="sort-btn" data-sort="date-asc">Старые первые</button>
                <button class="sort-btn" data-sort="title">По названию</button>
                <button class="sort-btn" data-sort="category">По категории</button>
            </div>
        `;
        
        const searchContainer = controlsContainer.querySelector('.news-search');
        searchContainer.insertAdjacentHTML('beforebegin', sortControlsHTML);
        
        // Add sort event listeners
        const sortButtons = document.querySelectorAll('.sort-btn');
        sortButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sortType = this.getAttribute('data-sort');
                
                // Update active button
                sortButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Sort cards
                sortNewsCards(sortType);
                
                // Click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    // News statistics
    function addNewsStats() {
        const contentSection = document.querySelector('.news-content .container');
        const statsHTML = `
            <div class="news-stats">
                <h3>Статистика новостей</h3>
                <p id="newsStatsText">Показано все новости</p>
            </div>
        `;
        
        const newsGrid = contentSection.querySelector('.news-grid');
        newsGrid.insertAdjacentHTML('beforebegin', statsHTML);
    }

    function updateNewsStats() {
        const statsText = document.getElementById('newsStatsText');
        const activeFilter = document.querySelector('.filter-btn.active').textContent;
        const totalVisible = filteredCards.length;
        const totalNews = newsCards.length;
        
        if (filteredCards.length === newsCards.length) {
            statsText.textContent = `Показано все ${totalNews} новостей`;
        } else {
            statsText.textContent = `Найдено ${totalVisible} из ${totalNews} новостей в категории "${activeFilter}"`;
        }
    }

    // Sort function
    function sortNewsCards(sortType) {
        const newsGrid = document.getElementById('newsGrid');
        const cardsArray = Array.from(filteredCards);
        
        cardsArray.sort((a, b) => {
            switch(sortType) {
                case 'date-desc':
                    return new Date(b.querySelector('.news-date').textContent) - 
                           new Date(a.querySelector('.news-date').textContent);
                case 'date-asc':
                    return new Date(a.querySelector('.news-date').textContent) - 
                           new Date(b.querySelector('.news-date').textContent);
                case 'title':
                    return a.querySelector('.news-title').textContent
                            .localeCompare(b.querySelector('.news-title').textContent);
                case 'category':
                    return a.getAttribute('data-category')
                            .localeCompare(b.getAttribute('data-category'));
                default:
                    return 0;
            }
        });
        
        // Reorder DOM elements
        cardsArray.forEach(card => {
            newsGrid.appendChild(card);
        });
        
        // Re-animate cards
        cardsArray.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            }, index * 50);
        });
    }

    // Enhanced pagination functionality
    function updatePagination() {
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const currentPageSpan = document.getElementById('currentPage');
        const totalPagesSpan = document.getElementById('totalPages');
        
        // Update page info
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages || 1;
        
        // Enable/disable pagination buttons
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages || totalPages <= 1;
        
        // Show/hide cards based on current page
        filteredCards.forEach((card, index) => {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            if (index >= startIndex && index < endIndex) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Pagination event listeners
    document.getElementById('prevBtn').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            scrollToTop();
        }
    });

    document.getElementById('nextBtn').addEventListener('click', function() {
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            scrollToTop();
        }
    });

    function scrollToTop() {
        document.querySelector('.news-content').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    // Share functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            const newsCard = this.closest('.news-card');
            const title = newsCard.querySelector('.news-title').textContent;
            const url = window.location.href;
            
            shareNews(platform, title, url);
            
            // Click animation
            this.style.transform = 'translateY(-2px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    function shareNews(platform, title, url) {
        let shareUrl = '';
        
        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('hidden')) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe all news cards for scroll animations
    newsCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Enhanced search with suggestions
    const searchSuggestions = ['туризм', 'культура', 'фестиваль', 'маршрут', 'горы', 'кухня'];
    
    searchInput.addEventListener('focus', function() {
        if (!this.value) {
            showSearchSuggestions();
        }
    });

    function showSearchSuggestions() {
        // This could be expanded to show actual search suggestions
        const placeholder = searchInput.getAttribute('placeholder');
        const randomSuggestion = searchSuggestions[Math.floor(Math.random() * searchSuggestions.length)];
        searchInput.setAttribute('placeholder', `Попробуйте: ${randomSuggestion}`);
        
        setTimeout(() => {
            if (!searchInput.value) {
                searchInput.setAttribute('placeholder', placeholder);
            }
        }, 3000);
    }

    // Smooth scroll for read more buttons
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'translateY(-2px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Initialize pagination and stats
    updatePagination();
    updateNewsStats();

    // Add loading effect for images
    const images = document.querySelectorAll('.news-image img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        if (!img.complete) {
            img.style.opacity = '0.7';
            img.style.transition = 'opacity 0.3s ease';
        }
    });

    // Auto-hide search placeholder on focus
    searchInput.addEventListener('focus', function() {
        this.setAttribute('data-placeholder', this.placeholder);
        this.placeholder = '';
    });

    searchInput.addEventListener('blur', function() {
        if (this.hasAttribute('data-placeholder')) {
            this.placeholder = this.getAttribute('data-placeholder');
            this.removeAttribute('data-placeholder');
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'f':
                case 'F':
                    e.preventDefault();
                    searchInput.focus();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    document.getElementById('prevBtn').click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    document.getElementById('nextBtn').click();
                    break;
            }
        }
    });
});

// Add news-specific styles via JavaScript
const newsStyles = document.createElement('style');
newsStyles.textContent = `
    .news-card.hidden {
        display: none !important;
    }
    
    .filter-btn.active {
        animation: pulse 0.3s ease;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .share-btn:active {
        transform: translateY(-2px) scale(0.9);
    }
    
    .read-more-btn:active {
        transform: translateY(-2px) scale(0.95);
    }
    
    .news-card:hover .news-category {
        transform: scale(1.1);
        transition: transform 0.3s ease;
    }
    
    .pagination-btn:hover:not(:disabled) {
        box-shadow: 0 4px 15px rgba(74, 124, 89, 0.3);
    }
    
    .sort-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 10px rgba(74, 124, 89, 0.2);
    }
`;
document.head.appendChild(newsStyles);
