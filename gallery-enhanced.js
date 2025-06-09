
// Enhanced Gallery JavaScript

class EnhancedGallery {
    constructor() {
        this.photos = [];
        this.filteredPhotos = [];
        this.currentFilter = 'all';
        this.currentView = 'masonry';
        this.currentSort = 'date-desc';
        this.searchQuery = '';
        this.itemsPerPage = 24;
        this.currentPage = 1;
        this.favorites = JSON.parse(localStorage.getItem('galleryFavorites') || '[]');
        this.isSlideshow = false;
        this.slideshowInterval = null;
        this.slideshowIndex = 0;
        
        this.init();
    }

    init() {
        this.generatePhotos();
        this.setupEventListeners();
        this.renderGallery();
        this.updateResultsInfo();
    }

    generatePhotos() {
        const categories = ['nature', 'architecture', 'events', 'panorama', 'culture'];
        const locations = [
            'Парк культуры и отдыха',
            'Кабардинская улица',
            'Атажукинский сад',
            'Нальчикский парк',
            'Зеленый театр',
            'Курортное озеро',
            'Крепость Нальчик',
            'Центральная площадь',
            'Кафедральный собор',
            'Музей изобразительных искусств',
            'Театр оперы и балета',
            'Канатная дорога'
        ];

        const descriptions = [
            'Живописный вид на горные вершины в золотых лучах заката',
            'Архитектурное наследие города с уникальными деталями',
            'Яркие моменты культурных мероприятий нашего города',
            'Панорамный вид на Нальчик с высоты птичьего полета',
            'Традиционные праздники и народные гуляния',
            'Природная красота окрестностей города',
            'Историческое место с многовековой историей',
            'Современная архитектура в гармонии с природой'
        ];

        const imageUrls = [
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1517022812141-23620dba5c23?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        ];

        for (let i = 0; i < 150; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const description = descriptions[Math.floor(Math.random() * descriptions.length)];
            const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
            
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));
            
            this.photos.push({
                id: i + 1,
                title: `${location} ${i + 1}`,
                description: description,
                category: category,
                image: imageUrl,
                date: date,
                author: 'Администрация города',
                views: Math.floor(Math.random() * 5000) + 100,
                isFavorite: this.favorites.includes(i + 1)
            });
        }

        this.filteredPhotos = [...this.photos];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.filterPhotos();
            clearSearch.style.display = e.target.value ? 'block' : 'none';
        });

        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.searchQuery = '';
            this.filterPhotos();
            clearSearch.style.display = 'none';
        });

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.currentPage = 1;
                this.filterPhotos();
            });
        });

        // View buttons
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                this.renderGallery();
            });
        });

        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortPhotos();
            this.renderGallery();
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.addEventListener('click', () => {
            this.currentPage++;
            this.renderGallery(true);
        });

        // Reset filters
        const resetFilters = document.getElementById('resetFilters');
        resetFilters.addEventListener('click', () => {
            this.resetFilters();
        });

        // Slideshow
        const startSlideshow = document.getElementById('startSlideshow');
        startSlideshow.addEventListener('click', () => {
            this.startSlideshow();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isSlideshow) {
                if (e.key === 'Escape') {
                    this.stopSlideshow();
                } else if (e.key === ' ') {
                    e.preventDefault();
                    this.toggleSlideshowPause();
                }
            }
        });
    }

    filterPhotos() {
        this.filteredPhotos = this.photos.filter(photo => {
            const matchesCategory = this.currentFilter === 'all' || photo.category === this.currentFilter;
            const matchesSearch = !this.searchQuery || 
                photo.title.toLowerCase().includes(this.searchQuery) ||
                photo.description.toLowerCase().includes(this.searchQuery);
            
            return matchesCategory && matchesSearch;
        });

        this.sortPhotos();
        this.currentPage = 1;
        this.renderGallery();
        this.updateResultsInfo();
        
        // Show/hide no results
        const noResults = document.getElementById('noResults');
        noResults.style.display = this.filteredPhotos.length === 0 ? 'block' : 'none';
    }

    sortPhotos() {
        this.filteredPhotos.sort((a, b) => {
            switch (this.currentSort) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'name-asc':
                    return a.title.localeCompare(b.title);
                case 'name-desc':
                    return b.title.localeCompare(a.title);
                case 'popular':
                    return b.views - a.views;
                default:
                    return 0;
            }
        });
    }

    renderGallery(append = false) {
        const galleryGrid = document.getElementById('galleryGrid');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (!append) {
            galleryGrid.innerHTML = '';
            loadingIndicator.style.display = 'flex';
        }

        // Update grid class
        galleryGrid.className = `gallery-grid ${this.currentView}`;

        setTimeout(() => {
            const startIndex = append ? (this.currentPage - 1) * this.itemsPerPage : 0;
            const endIndex = this.currentPage * this.itemsPerPage;
            const photosToShow = this.filteredPhotos.slice(startIndex, endIndex);

            photosToShow.forEach((photo, index) => {
                const item = this.createGalleryItem(photo, startIndex + index);
                galleryGrid.appendChild(item);
            });

            // Update masonry heights
            if (this.currentView === 'masonry') {
                this.updateMasonryHeights();
            }

            // Update load more button
            const hasMore = endIndex < this.filteredPhotos.length;
            loadMoreBtn.style.display = hasMore ? 'flex' : 'none';
            
            loadingIndicator.style.display = 'none';
            
            // Update total photos count
            document.getElementById('totalPhotos').textContent = `${this.photos.length}+`;
        }, append ? 500 : 1000);
    }

    createGalleryItem(photo, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = `${(index % 6) * 0.1}s`;
        
        const height = this.currentView === 'masonry' ? Math.floor(Math.random() * 10) + 10 : 15;
        item.style.setProperty('--row-span', height);

        item.innerHTML = `
            <div class="image-container">
                <img src="${photo.image}" alt="${photo.title}" loading="lazy">
                <div class="image-overlay">
                    <div class="item-info">
                        <h3 class="item-title">${photo.title}</h3>
                        <p class="item-description">${photo.description}</p>
                        <div class="item-meta">
                            <span>${this.formatDate(photo.date)}</span>
                            <span>${photo.views} просмотров</span>
                        </div>
                    </div>
                </div>
                <span class="item-category ${photo.category}">${this.getCategoryName(photo.category)}</span>
                <div class="item-actions">
                    <button class="action-icon favorite-icon ${photo.isFavorite ? 'favorited' : ''}" 
                            data-id="${photo.id}" title="В избранное">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-icon share-icon" data-id="${photo.id}" title="Поделиться">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
            </div>
        `;

        // Add click listeners
        const img = item.querySelector('img');
        img.addEventListener('click', () => this.openModal(photo.id));

        const favoriteBtn = item.querySelector('.favorite-icon');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(photo.id);
        });

        const shareBtn = item.querySelector('.share-icon');
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openShareModal(photo.id);
        });

        return item;
    }

    updateMasonryHeights() {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach(item => {
            const img = item.querySelector('img');
            img.onload = () => {
                const aspectRatio = img.naturalHeight / img.naturalWidth;
                const spans = Math.ceil(aspectRatio * 15);
                item.style.setProperty('--row-span', spans);
            };
        });
    }

    getCategoryName(category) {
        const categoryNames = {
            nature: 'Природа',
            architecture: 'Архитектура',
            events: 'События',
            panorama: 'Панорамы',
            culture: 'Культура'
        };
        return categoryNames[category] || category;
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(date));
    }

    updateResultsInfo() {
        const resultsCount = document.getElementById('resultsCount');
        const showing = Math.min(this.currentPage * this.itemsPerPage, this.filteredPhotos.length);
        resultsCount.textContent = `Показано: ${showing} из ${this.filteredPhotos.length} фотографий`;
    }

    toggleFavorite(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) return;

        photo.isFavorite = !photo.isFavorite;
        
        if (photo.isFavorite) {
            this.favorites.push(photoId);
        } else {
            this.favorites = this.favorites.filter(id => id !== photoId);
        }

        localStorage.setItem('galleryFavorites', JSON.stringify(this.favorites));
        
        // Update button state
        const favoriteBtn = document.querySelector(`[data-id="${photoId}"].favorite-icon`);
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('favorited', photo.isFavorite);
        }

        this.updateFavoritesSection();
    }

    updateFavoritesSection() {
        const favoritesSection = document.getElementById('favoritesSection');
        const favoritesGrid = document.getElementById('favoritesGrid');
        
        const favoritePhotos = this.photos.filter(p => p.isFavorite);
        
        if (favoritePhotos.length > 0) {
            favoritesSection.style.display = 'block';
            favoritesGrid.innerHTML = '';
            
            favoritePhotos.forEach(photo => {
                const item = this.createGalleryItem(photo, 0);
                item.classList.add('favorite-item');
                favoritesGrid.appendChild(item);
            });
        } else {
            favoritesSection.style.display = 'none';
        }
    }

    openModal(photoId) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) return;

        const modal = document.getElementById('photoModal');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const photoDate = document.getElementById('photoDate');
        const photoAuthor = document.getElementById('photoAuthor');
        const photoViews = document.getElementById('photoViews');
        const photoCategory = document.getElementById('photoCategory');
        const photoDescription = document.getElementById('photoDescription');
        const imageCounter = document.getElementById('imageCounter');

        // Update modal content
        modalImage.src = photo.image;
        modalTitle.textContent = photo.title;
        photoDate.textContent = this.formatDate(photo.date);
        photoAuthor.textContent = photo.author;
        photoViews.textContent = `${photo.views} просмотров`;
        photoCategory.textContent = this.getCategoryName(photo.category);
        photoDescription.textContent = photo.description;

        // Update counter
        const currentIndex = this.filteredPhotos.findIndex(p => p.id === photoId);
        imageCounter.textContent = `${currentIndex + 1} / ${this.filteredPhotos.length}`;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Increment views
        photo.views++;
        photoViews.textContent = `${photo.views} просмотров`;
    }

    openShareModal(photoId) {
        const shareModal = document.getElementById('shareModal');
        shareModal.dataset.photoId = photoId;
        shareModal.classList.add('show');
    }

    resetFilters() {
        // Reset all filter states
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.currentPage = 1;
        
        // Update UI
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearch').style.display = 'none';
        
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === 'all');
        });
        
        document.getElementById('sortSelect').value = 'date-desc';
        this.currentSort = 'date-desc';
        
        this.filterPhotos();
    }

    startSlideshow() {
        if (this.filteredPhotos.length === 0) return;

        this.isSlideshow = true;
        this.slideshowIndex = 0;
        
        const slideshowOverlay = document.getElementById('slideshowOverlay');
        slideshowOverlay.style.display = 'flex';
        
        this.showSlideshowImage();
        this.slideshowInterval = setInterval(() => {
            this.nextSlideshowImage();
        }, 4000);

        // Setup slideshow controls
        this.setupSlideshowControls();
    }

    showSlideshowImage() {
        if (!this.isSlideshow || this.slideshowIndex >= this.filteredPhotos.length) return;

        const photo = this.filteredPhotos[this.slideshowIndex];
        const slideshowImage = document.getElementById('slideshowImage');
        const slideshowTitle = document.getElementById('slideshowTitle');
        const slideshowDescription = document.getElementById('slideshowDescription');

        slideshowImage.src = photo.image;
        slideshowTitle.textContent = photo.title;
        slideshowDescription.textContent = photo.description;

        // Update progress
        this.updateSlideshowProgress();
    }

    nextSlideshowImage() {
        this.slideshowIndex = (this.slideshowIndex + 1) % this.filteredPhotos.length;
        this.showSlideshowImage();
    }

    updateSlideshowProgress() {
        const progressBar = document.getElementById('progressBar');
        let progress = 0;
        const duration = 4000;
        const interval = 50;
        const increment = (interval / duration) * 100;

        const progressInterval = setInterval(() => {
            progress += increment;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                progressBar.style.width = '0%';
            }
        }, interval);
    }

    setupSlideshowControls() {
        const pauseBtn = document.getElementById('pauseSlideshow');
        const stopBtn = document.getElementById('stopSlideshow');

        pauseBtn.onclick = () => this.toggleSlideshowPause();
        stopBtn.onclick = () => this.stopSlideshow();
    }

    toggleSlideshowPause() {
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
            this.slideshowInterval = null;
            document.getElementById('pauseSlideshow').innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.slideshowInterval = setInterval(() => {
                this.nextSlideshowImage();
            }, 4000);
            document.getElementById('pauseSlideshow').innerHTML = '<i class="fas fa-pause"></i>';
        }
    }

    stopSlideshow() {
        this.isSlideshow = false;
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
            this.slideshowInterval = null;
        }
        
        const slideshowOverlay = document.getElementById('slideshowOverlay');
        slideshowOverlay.style.display = 'none';
        
        document.getElementById('pauseSlideshow').innerHTML = '<i class="fas fa-pause"></i>';
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new EnhancedGallery();
    
    // Setup modal close functionality
    const closeModal = document.getElementById('closeModal');
    const closeShareModal = document.getElementById('closeShareModal');
    const photoModal = document.getElementById('photoModal');
    const shareModal = document.getElementById('shareModal');

    closeModal.addEventListener('click', () => {
        photoModal.classList.remove('show');
        document.body.style.overflow = '';
    });

    closeShareModal.addEventListener('click', () => {
        shareModal.classList.remove('show');
    });

    // Close modals on backdrop click
    [photoModal, shareModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                if (modal === photoModal) {
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Modal navigation
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    
    prevBtn.addEventListener('click', () => {
        // Navigate to previous image
        const currentPhotoId = parseInt(document.getElementById('modalImage').dataset.currentId || '1');
        const currentIndex = gallery.filteredPhotos.findIndex(p => p.id === currentPhotoId);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : gallery.filteredPhotos.length - 1;
        gallery.openModal(gallery.filteredPhotos[prevIndex].id);
    });

    nextBtn.addEventListener('click', () => {
        // Navigate to next image
        const currentPhotoId = parseInt(document.getElementById('modalImage').dataset.currentId || '1');
        const currentIndex = gallery.filteredPhotos.findIndex(p => p.id === currentPhotoId);
        const nextIndex = currentIndex < gallery.filteredPhotos.length - 1 ? currentIndex + 1 : 0;
        gallery.openModal(gallery.filteredPhotos[nextIndex].id);
    });

    // Share functionality
    const shareOptions = document.querySelectorAll('.share-option');
    shareOptions.forEach(option => {
        option.addEventListener('click', () => {
            const platform = option.dataset.platform;
            const photoId = shareModal.dataset.photoId;
            // Handle sharing logic here
            console.log(`Sharing photo ${photoId} on ${platform}`);
            shareModal.classList.remove('show');
        });
    });

    // Copy link functionality
    const copyLink = document.getElementById('copyLink');
    copyLink.addEventListener('click', () => {
        const photoId = shareModal.dataset.photoId;
        const url = `${window.location.origin}${window.location.pathname}?photo=${photoId}`;
        navigator.clipboard.writeText(url).then(() => {
            copyLink.innerHTML = '<i class="fas fa-check"></i><span>Скопировано!</span>';
            setTimeout(() => {
                copyLink.innerHTML = '<i class="fas fa-link"></i><span>Копировать ссылку</span>';
            }, 2000);
        });
        shareModal.classList.remove('show');
    });

    // Keyboard navigation for modal
    document.addEventListener('keydown', (e) => {
        if (photoModal.classList.contains('show')) {
            if (e.key === 'Escape') {
                closeModal.click();
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });
});
