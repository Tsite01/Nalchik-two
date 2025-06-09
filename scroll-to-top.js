
// Enhanced Scroll to top functionality with smooth appearance at 60%
function initScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Прокрутить наверх');
    document.body.appendChild(scrollButton);
    
    // Function to calculate scroll percentage
    function getScrollPercentage() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return (scrollTop / scrollHeight) * 100;
    }
    
    // Show/hide button based on 60% scroll with smooth transition
    function handleScroll() {
        const scrollPercentage = getScrollPercentage();
        
        if (scrollPercentage >= 60) {
            scrollButton.classList.add('show');
        } else {
            scrollButton.classList.remove('show');
        }
    }
    
    // Add event listener with throttling for better performance
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Smooth scroll to top when clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initial check for scroll position
    handleScroll();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initScrollToTop);
