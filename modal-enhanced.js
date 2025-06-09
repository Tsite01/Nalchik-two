
// Enhanced Modal functionality for attractions
class AttractionsModal {
    constructor() {
        this.modal = null;
        this.currentAttraction = null;
        this.init();
    }

    init() {
        // Create modal HTML with improved structure
        const modalHTML = `
            <div id="attraction-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modal-title"></h2>
                        <button class="modal-close" onclick="closeModal()" aria-label="Закрыть модальное окно">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-loading" id="modal-loading" style="display: none;">
                            <div class="modal-spinner"></div>
                        </div>
                        <div id="modal-content-wrapper">
                            <img id="modal-image" class="modal-image" src="" alt="" loading="lazy">
                            <div class="modal-rating">
                                <span class="modal-stars">★★★★★</span>
                                <span>4.8 из 5 (324 отзыва)</span>
                            </div>
                            <div id="modal-description" class="modal-description"></div>
                            <div class="modal-details">
                                <h3>Полезная информация</h3>
                                <ul id="modal-details-list"></ul>
                            </div>
                            <div class="modal-actions">
                                <a href="#" class="modal-btn modal-btn-primary" id="modal-route-btn">
                                    🗺️ Построить маршрут
                                </a>
                                <button class="modal-btn modal-btn-secondary" onclick="shareAttraction()">
                                    📤 Поделиться
                                </button>
                                <button class="modal-btn modal-btn-secondary" onclick="saveToFavorites()">
                                    ❤️ В избранное
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('attraction-modal');
        
        // Enhanced attraction data with more details
        this.attractionsData = {
            'elbrus': {
                title: 'Гора Эльбрус',
                image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Эльбрус — величественная двуглавая вершина, являющаяся высочайшей точкой России и всей Европы. Этот стратовулкан, покрытый вечными снегами и ледниками, возвышается на 5642 метра над уровнем моря. Западная вершина немного выше восточной, и именно она считается высочайшей точкой континента. Гора окружена 22 ледниками, которые питают множество горных рек, включая Кубань и Малку. Эльбрус не только природная достопримечательность, но и важный культурный символ Кавказа, место паломничества альпинистов со всего мира.',
                details: [
                    'Высота западной вершины: 5642 м, восточной: 5621 м',
                    'Расстояние от Нальчика: 120 км (2-2.5 часа на автомобиле)',
                    'Канатная дорога "Эльбрус" работает круглогодично',
                    'Стоимость подъема на канатной дороге: от 1500₽',
                    'Лучшее время для восхождения: май-сентябрь',
                    'Температура на вершине: -20°C даже летом',
                    'Необходимо специальное альпинистское снаряжение',
                    'Доступны услуги горных гидов и инструкторов',
                    'Есть горные приюты для ночевки альпинистов'
                ],
                mapUrl: 'https://yandex.ru/maps/?text=Эльбрус'
            },
            'blue-lakes': {
                title: 'Голубые озера',
                image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Голубые озера — уникальный природный комплекс из пяти карстовых озер, расположенных в живописном Черекском ущелье. Главная жемчужина — Нижнее Голубое озеро (Церик-Кёль), которое поражает своей невероятной глубиной в 258 метров и удивительным голубым цветом воды. Этот цвет обусловлен особенностями преломления света и содержанием сероводорода. Температура воды остается постоянной круглый год — около +9°C, поэтому озеро никогда не замерзает. Местные легенды гласят, что на дне озера живет водяной дух, охраняющий сокровища.',
                details: [
                    'Глубина Нижнего Голубого озера: 258 метров',
                    'Постоянная температура воды: +9°C круглый год',
                    'Расстояние от Нальчика: 60 км (1.5 часа на автомобиле)',
                    'Входная плата: 100₽ с взрослого, дети до 12 лет бесплатно',
                    'Озеро не замерзает даже в сильные морозы',
                    'Можно купаться (для очень закаленных людей)',
                    'Рядом работают кафе национальной кухни',
                    'Есть сувенирные лавки с местными изделиями',
                    'Организуются экскурсии с гидом и дегустацией'
                ],
                mapUrl: 'https://yandex.ru/maps/?text=Голубые озера КБР'
            },
            'national-park': {
                title: 'Приэльбрусский национальный парк',
                image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Приэльбрусский национальный парк — настоящая сокровищница кавказской природы, созданная в 1986 году для охраны уникальных высокогорных экосистем. Парк охватывает территорию в 101 тысячу гектаров и включает разнообразные ландшафты: от лиственных лесов в долинах до альпийских лугов и ледников на высочайших вершинах. Здесь произрастает более 2500 видов растений, многие из которых являются эндемиками Кавказа. Фауна парка не менее богата — здесь обитают кавказский тур, серна, бурый медведь, рысь, беркут и многие другие виды.',
                details: [
                    'Площадь парка: 101 037 гектаров',
                    'Высотный диапазон: от 1400 до 5642 метров',
                    'Более 2500 видов растений, включая редкие эндемики',
                    'Около 200 видов животных и 160 видов птиц',
                    'Разработано более 15 туристических маршрутов',
                    'Работают гостевые дома и горные приюты',
                    'Обязательны экскурсии с сертифицированными гидами',
                    'Въезд в парк по пропускам (оформление бесплатное)',
                    'Сезон активного туризма: май-октябрь'
                ],
                mapUrl: 'https://yandex.ru/maps/?text=Приэльбрусский национальный парк'
            },
            'atazhukinsky-garden': {
                title: 'Атажукинский сад',
                image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Атажукинский сад — историческое сердце Нальчика и один из самых больших парков на Северном Кавказе. Основанный в 1847 году, парк назван в честь кабардинского князя Атажуко Нагоева, который внес значительный вклад в развитие региона. На территории 250 гектаров создан удивительный ботанический мир, где произрастает более 150 видов деревьев и кустарников со всех континентов. Парк является не только местом отдыха, но и важным культурным центром с многочисленными памятниками, фонтанами и культурными объектами.',
                details: [
                    'Площадь парка: 250 гектаров',
                    'Год основания: 1847 (один из старейших парков России)',
                    'Коллекция включает более 150 видов растений',
                    'Бесплатный вход в любое время суток',
                    'Работает круглосуточно без выходных',
                    'Прокат велосипедов, роликов и самокатов',
                    'Детские площадки и спортивные зоны',
                    'Многочисленные кафе и точки питания',
                    'Регулярные культурные мероприятия и фестивали'
                ],
                mapUrl: 'https://yandex.ru/maps/?text=Атажукинский сад Нальчик'
            },
            'chegem-waterfalls': {
                title: 'Чегемские водопады',
                image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Чегемские водопады — одно из самых захватывающих природных чудес Кабардино-Балкарии, расположенное в узком Чегемском ущелье. Главный водопад "Девичья коса" эффектно низвергается с высоты более 50 метров, создавая облако водяной пыли. Особенно впечатляющими водопады становятся зимой, когда частично замерзают, образуя фантастические ледяные колонны и сосульки, переливающиеся на солнце всеми цветами радуги. Ущелье окружено отвесными скалами высотой до 300 метров, что создает уникальную акустику — каждый звук многократно отражается от стен.',
                details: [
                    'Высота главного водопада "Девичья коса": более 50 метров',
                    'Расстояние от Нальчика: 45 км (1 час на автомобиле)',
                    'Лучшее время посещения: весна (полноводность) и зима (ледяные образования)',
                    'Зимой водопады превращаются в ледяные колонны',
                    'Оборудованы смотровые площадки с ограждениями',
                    'Платная парковка: 50₽, есть охраняемая стоянка',
                    'Работают кафе с национальной кухней',
                    'Продаются сувениры местных мастеров',
                    'Возможны конные прогулки по окрестностям'
                ],
                mapUrl: 'https://yandex.ru/maps/?text=Чегемские водопады'
            },
            'narzan-valley': {
                title: 'Долина Нарзанов',
                image: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Долина Нарзанов — уникальное место на планете, где из недр земли бьют более 20 источников целебной минеральной воды различного состава. Название "нарзан" происходит от кабардинского "нарт санэ", что означает "напиток богатырей-нартов". Вода содержит углекислоту, железо, магний и другие полезные элементы. Каждый источник имеет свой неповторимый вкус и лечебные свойства. Долина расположена на высоте 1300 метров над уровнем моря в окружении величественных горных пейзажей, что делает посещение не только полезным, но и невероятно красивым.',
                details: [
                    'Более 20 источников с различным составом воды',
                    'Постоянная температура воды: +10-12°C',
                    'Расстояние от Нальчика: 100 км (2.5 часа на автомобиле)',
                    'Высота над уровнем моря: 1300 метров',
                    'Вода обладает доказанными лечебными свойствами',
                    'Свободный забор воды для личного употребления',
                    'Организуются экскурсии с дегустацией различных источников',
                    'Есть гостевые дома для многодневного отдыха',
                    'Работает медицинский центр природной терапии'
                ],
                mapUrl: 'https://yandex.ru/maps/?text=Долина Нарзанов КБР'
            },
            'thermal-springs': {
                title: 'Термальные источники Аушигер',
                image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Уникальные горячие термальные источники с температурой воды +50°C. Круглогодичное купание и spa-процедуры в окружении гор.',
                details: [
                    'Температура воды: +50°C круглый год',
                    'Расстояние от Нальчика: 85 км (2 часа на автомобиле)',
                    'Круглогодичная работа, включая зимний период',
                    'Лечебные свойства воды подтверждены медицински',
                    'Доступны spa-процедуры и массаж',
                    'Гостиничные комплексы рядом с источниками',
                    'Кафе и рестораны национальной кухни',
                    'Организация трансфера из Нальчика'
                ],
                mapUrl: 'https://yandex.ru/maps/?text=Термальные источники Аушигер'
            },
            'chateau-erken': {
                title: 'Замок Шато Эркен',
                image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Современный винодельческий комплекс в средневековом стиле. Дегустация местных вин, экскурсии по винодельне и изысканный ресторан.',
                details: [
                    'Собственное производство вин из местного винограда',
                    'Расстояние от Нальчика: 25 км (45 минут на автомобиле)',
                    'Экскурсии по винодельне с дегустацией',
                    'Ресторан высокой кухни с винной картой',
                    'Возможность проведения свадеб и мероприятий',
                    'Гостиничный комплекс на территории',
                    'Живописные виды на горы и виноградники'
                ],
                mapUrl: 'https://yandex.ru/maps/?text=Шато Эркен КБР'
            },
            'national-museum': {
                title: 'Национальный музей КБР',
                image: 'https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                description: 'Богатейшая коллекция истории, культуры и природы Кабардино-Балкарии. Археологические находки и интерактивные выставки.',
                details: [
                    'Более 100 000 экспонатов в коллекции',
                    'Расположен в центре Нальчика',
                    'Археологические находки возрастом до 5000 лет',
                    'Интерактивные выставки и мультимедийные экспозиции',
                    'Экскурсии на русском, кабардинском и балкарском языках',
                    'Сувенирный магазин с изделиями местных мастеров',
                    'Регулярные временные выставки и культурные события'
                ],
                mapUrl: 'https://yandex.ru/maps/?text=Национальный музей КБР Нальчик'
            }
        };
        
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Setup click handlers for detail buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('details-btn')) {
                e.preventDefault();
                const card = e.target.closest('.content-card');
                if (card) {
                    const attraction = card.getAttribute('data-attraction');
                    if (attraction) {
                        this.openModal(attraction);
                    }
                }
            }
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    openModal(attractionKey) {
        const data = this.attractionsData[attractionKey];
        if (!data) return;
        
        const loading = document.getElementById('modal-loading');
        const content = document.getElementById('modal-content-wrapper');
        
        // Show modal
        this.modal.classList.add('show');
        loading.style.display = 'flex';
        content.style.display = 'none';
        document.body.style.overflow = 'hidden';
        
        // Simulate loading for better UX
        setTimeout(() => {
            // Set content
            document.getElementById('modal-title').textContent = data.title;
            
            const modalImage = document.getElementById('modal-image');
            modalImage.src = data.image;
            modalImage.alt = data.title;
            
            document.getElementById('modal-description').textContent = data.description;
            
            const detailsList = document.getElementById('modal-details-list');
            detailsList.innerHTML = '';
            data.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                detailsList.appendChild(li);
            });
            
            // Set route button
            const routeBtn = document.getElementById('modal-route-btn');
            routeBtn.href = data.mapUrl;
            routeBtn.target = '_blank';
            
            // Hide loading and show content
            loading.style.display = 'none';
            content.style.display = 'block';
        }, 500);
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = 'auto';
            
            // Reset content after animation
            setTimeout(() => {
                const content = document.getElementById('modal-content-wrapper');
                if (content) {
                    content.style.display = 'none';
                }
            }, 400);
        }
    }

    shareAttraction() {
        const title = document.getElementById('modal-title').textContent;
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: `${title} - Нальчик`,
                text: `Посмотрите на эту достопримечательность: ${title}`,
                url: url
            });
        } else {
            // Fallback for browsers without Web Share API
            const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`${title} - Нальчик`)}`;
            window.open(shareUrl, '_blank');
        }
    }

    saveToFavorites() {
        const title = document.getElementById('modal-title').textContent;
        let favorites = JSON.parse(localStorage.getItem('nalchik-favorites') || '[]');
        
        if (!favorites.includes(title)) {
            favorites.push(title);
            localStorage.setItem('nalchik-favorites', JSON.stringify(favorites));
            
            // Show success message
            const btn = event.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Добавлено!';
            btn.style.background = '#4a7c59';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 2000);
        } else {
            // Show already saved message
            const btn = event.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = '📌 Уже сохранено';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        }
    }
}

// Global instance and functions
let attractionsModal;

// Global functions for backward compatibility
function openModal(attractionKey) {
    if (attractionsModal) {
        attractionsModal.openModal(attractionKey);
    }
}

function closeModal() {
    if (attractionsModal) {
        attractionsModal.closeModal();
    }
}

function shareAttraction() {
    if (attractionsModal) {
        attractionsModal.shareAttraction();
    }
}

function saveToFavorites() {
    if (attractionsModal) {
        attractionsModal.saveToFavorites();
    }
}

// Initialize modal when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.content-grid')) {
        attractionsModal = new AttractionsModal();
    }
});
