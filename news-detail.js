
// News detail page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Share functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            const title = document.querySelector('.article-title').textContent;
            const url = window.location.href;
            
            shareNews(platform, title, url);
            
            // Add click animation
            this.style.transform = 'translateY(-3px) scale(0.95)';
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
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    // Gallery lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${this.src}" alt="${this.alt}">
                    <span class="lightbox-close">&times;</span>
                </div>
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Animate lightbox appearance
            lightbox.style.opacity = '0';
            setTimeout(() => {
                lightbox.style.opacity = '1';
            }, 10);
            
            // Close lightbox
            const closeBtn = lightbox.querySelector('.lightbox-close');
            const closeLightbox = () => {
                lightbox.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(lightbox)) {
                        document.body.removeChild(lightbox);
                    }
                    document.body.style.overflow = 'auto';
                }, 300);
            };
            
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
        });
    });

    // Booking button functionality
    const bookingBtn = document.querySelector('.booking-btn');
    if (bookingBtn) {
        bookingBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'translateY(-2px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show booking modal or redirect
            alert('Форма бронирования будет доступна в ближайшее время. Пожалуйста, свяжитесь с нами по телефону.');
        });
    }

    // Smooth scroll for related links
    const relatedLinks = document.querySelectorAll('.related-item, .recipe-link');
    relatedLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'translateX(10px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Animate elements on scroll
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

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.highlight-item, .dish-card, .testimonial, .program-day, .sidebar-widget');
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });

    // Add loading effect for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        if (!img.complete) {
            img.style.opacity = '0.7';
            img.style.transition = 'opacity 0.3s ease';
        }
    });

    // Reading progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const article = document.querySelector('.article-text');
        if (article) {
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.scrollY;
            
            const progress = Math.min(100, Math.max(0, 
                ((scrollTop - articleTop + windowHeight) / articleHeight) * 100
            ));
            
            progressBar.style.width = progress + '%';
        }
    });

    // Table of contents (if article has h3 headings)
    const headings = document.querySelectorAll('.article-text h3');
    if (headings.length > 0) {
        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h4>Содержание</h4><ul></ul>';
        
        const tocList = toc.querySelector('ul');
        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            
            const tocItem = document.createElement('li');
            tocItem.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
            tocList.appendChild(tocItem);
        });
        
        // Insert TOC after the lead paragraph
        const lead = document.querySelector('.lead');
        if (lead) {
            lead.parentNode.insertBefore(toc, lead.nextSibling);
        }
    }

    // Add estimated reading time
    const articleText = document.querySelector('.article-text');
    if (articleText) {
        const wordCount = articleText.textContent.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Average reading speed
        
        const readingTimeElement = document.createElement('div');
        readingTimeElement.className = 'reading-time';
        readingTimeElement.innerHTML = `<i class="fas fa-clock"></i> Время чтения: ${readingTime} мин`;
        readingTimeElement.style.cssText = `
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        const articleMeta = document.querySelector('.article-meta');
        if (articleMeta) {
            articleMeta.appendChild(readingTimeElement);
        }
    }
});

// Add lightbox styles
const lightboxStyles = `
.lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    transition: opacity 0.3s ease;
}

.lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    animation: lightboxZoom 0.3s ease;
}

@keyframes lightboxZoom {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.lightbox img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.lightbox-close {
    position: absolute;
    top: -50px;
    right: 0;
    color: white;
    font-size: 2.5rem;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.3s ease;
}

.lightbox-close:hover {
    transform: scale(1.1);
    color: #667eea;
}

.table-of-contents {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 15px;
    margin: 2rem 0;
    border-left: 4px solid #667eea;
}

.table-of-contents h4 {
    color: #2d3748;
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.table-of-contents ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.table-of-contents li {
    margin-bottom: 0.5rem;
}

.table-of-contents a {
    color: #667eea;
    text-decoration: none;
    transition: color 0.3s ease;
    font-weight: 500;
}

.table-of-contents a:hover {
    color: #764ba2;
    text-decoration: underline;
}

@media (max-width: 768px) {
    .lightbox-content {
        max-width: 95%;
        max-height: 95%;
    }
    
    .lightbox-close {
        top: -40px;
        font-size: 2rem;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);
