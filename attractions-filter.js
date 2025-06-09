
// Функциональность фильтрации и поиска достопримечательностей
class AttractionsFilter {
    constructor() {
        this.cards = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.cards = Array.from(document.querySelectorAll('.content-card'));
        this.bindEvents();
        this.setupSearch();
    }

    bindEvents() {
        // Обработка кликов по кнопкам фильтров
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleFilterClick(e.target);
            }
        });

        // Обработка ввода в поиск
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value.toLowerCase());
                }, 300); // Debounce на 300ms
            });
        }
    }

    setupSearch() {
        // Настройка автодополнения для поиска
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('focused');
            });

            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.classList.remove('focused');
            });
        }
    }

    handleFilterClick(button) {
        // Удаляем активный класс у всех кнопок
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Добавляем активный класс к выбранной кнопке
        button.classList.add('active');

        // Получаем категорию фильтра
        this.currentFilter = button.dataset.category;

        // Применяем фильтрацию
        this.applyFilters();

        // Добавляем анимацию к кнопке
        this.animateButton(button);
    }

    handleSearch(searchTerm) {
        this.searchTerm = searchTerm;
        this.applyFilters();
    }

    applyFilters() {
        let visibleCount = 0;

        this.cards.forEach((card, index) => {
            const category = card.dataset.category;
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            // Проверяем соответствие фильтру категории
            const categoryMatch = this.currentFilter === 'all' || category === this.currentFilter;

            // Проверяем соответствие поисковому запросу
            const searchMatch = this.searchTerm === '' || 
                               title.includes(this.searchTerm) || 
                               description.includes(this.searchTerm);

            const shouldShow = categoryMatch && searchMatch;

            if (shouldShow) {
                this.showCard(card, visibleCount * 100);
                visibleCount++;
            } else {
                this.hideCard(card);
            }
        });

        // Показываем сообщение если ничего не найдено
        this.toggleEmptyMessage(visibleCount === 0);

        // Обновляем счетчик результатов
        this.updateResultsCounter(visibleCount);
    }

    showCard(card, delay = 0) {
        setTimeout(() => {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            
            // Принудительный reflow для корректной анимации
            card.offsetHeight;
            
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, delay);
    }

    hideCard(card) {
        card.style.transition = 'all 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px) scale(0.95)';
        
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    toggleEmptyMessage(show) {
        let emptyMessage = document.getElementById('empty-message');
        
        if (show && !emptyMessage) {
            emptyMessage = document.createElement('div');
            emptyMessage.id = 'empty-message';
            emptyMessage.className = 'empty-message';
            emptyMessage.innerHTML = `
                <div class="empty-content">
                    <div class="empty-icon">🔍</div>
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить параметры поиска или выбрать другую категорию</p>
                    <button class="reset-filters-btn" onclick="attractionsFilter.resetFilters()">
                        Сбросить фильтры
                    </button>
                </div>
            `;
            
            const grid = document.querySelector('.content-grid');
            grid.appendChild(emptyMessage);
            
            // Анимация появления
            setTimeout(() => {
                emptyMessage.classList.add('show');
            }, 100);
            
        } else if (!show && emptyMessage) {
            emptyMessage.classList.remove('show');
            setTimeout(() => {
                if (emptyMessage.parentNode) {
                    emptyMessage.parentNode.removeChild(emptyMessage);
                }
            }, 300);
        }
    }

    updateResultsCounter(count) {
        let counter = document.getElementById('results-counter');
        
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'results-counter';
            counter.className = 'results-counter';
            
            const filtersSection = document.querySelector('.filters-section');
            filtersSection.appendChild(counter);
        }

        const totalCards = this.cards.length;
        
        if (this.currentFilter === 'all' && this.searchTerm === '') {
            counter.style.display = 'none';
        } else {
            counter.style.display = 'block';
            counter.textContent = `Найдено: ${count} из ${totalCards}`;
        }
    }

    resetFilters() {
        // Сброс фильтра категории
        this.currentFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.filter-btn[data-category="all"]').classList.add('active');

        // Сброс поиска
        this.searchTerm = '';
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }

        // Применение фильтров
        this.applyFilters();
    }

    // Метод для программной фильтрации (для использования из других скриптов)
    filterByCategory(category) {
        const button = document.querySelector(`[data-category="${category}"]`);
        if (button) {
            this.handleFilterClick(button);
        }
    }

    // Метод для программного поиска
    search(term) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = term;
            this.handleSearch(term.toLowerCase());
        }
    }
}

// Создание стилей для фильтрации
const filterStyles = `
    .search-box.focused {
        transform: scale(1.02);
    }
    
    .results-counter {
        background: rgba(111, 163, 91, 0.1);
        color: #4a7c59;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        display: inline-block;
        border: 1px solid rgba(111, 163, 91, 0.2);
    }
    
    .empty-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem 1rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
    }
    
    .empty-message.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .empty-content {
        max-width: 400px;
        margin: 0 auto;
    }
    
    .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .empty-content h3 {
        color: #4a7c59;
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
    }
    
    .empty-content p {
        color: #666;
        margin-bottom: 2rem;
        line-height: 1.6;
    }
    
    .reset-filters-btn {
        background: linear-gradient(135deg, #6fa35b, #4a7c59);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
    }
    
    .reset-filters-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(111, 163, 91, 0.4);
    }
    
    /* Улучшенные анимации для карточек */
    .content-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .content-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 15px 35px rgba(45, 90, 61, 0.2);
    }
    
    /* Адаптивность для мобильных */
    @media (max-width: 768px) {
        .filters-section {
            gap: 1rem;
        }
        
        .search-box {
            max-width: 100%;
        }
        
        .filter-buttons {
            gap: 0.25rem;
        }
        
        .empty-content {
            padding: 1rem;
        }
        
        .empty-icon {
            font-size: 3rem;
        }
    }
`;

// Добавление стилей для фильтрации
const filterStyleSheet = document.createElement('style');
filterStyleSheet.textContent = filterStyles;
document.head.appendChild(filterStyleSheet);

// Глобальная переменная для доступа к фильтру
let attractionsFilter;

// Инициализация фильтрации
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.content-grid')) {
        attractionsFilter = new AttractionsFilter();
    }
});

// Улучшение hover эффектов для карточек
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.content-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
});
