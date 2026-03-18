// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initAOS();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initModals();
    initCalendly();
    initButtons();
    initStatsCounter();
    initDropdowns(); // Nueva función para dropdowns
    
    // Inicializar carruseles
    initLegalCarousel();
    initTestimonialsCarousel();
    initInstagramCarousel();
    
    initYear();
    
    // Cargar script de Instagram después de insertar los bloques
    loadInstagramEmbed();
});

// ===== PRELOADER REAL =====
function initPreloader() {
    const loader = document.getElementById('loader');
    
    // Prevenir scroll mientras el loader está visible
    document.body.classList.add('no-scroll');
    
    // Esperar a que todo el contenido esté cargado
    window.addEventListener('load', () => {
        // Pequeño retraso para suavizar la transición
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }, 500);
    });
    
    // Fallback por si algo tarda demasiado (máx 5 segundos)
    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
        }
    }, 5000);
}

// ===== CARGAR SCRIPT DE INSTAGRAM =====
function loadInstagramEmbed() {
    // Verificar si ya existe el script
    if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
        const script = document.createElement('script');
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
    } else {
        // Si ya existe, forzar la renderización de nuevos bloques
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }
}

// ===== AOS =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 800, 
            once: true,
            disable: window.innerWidth < 768
        });
    }
}

// ===== HEADER SCROLL =====
function initHeader() {
    const header = document.getElementById('header');
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader();
}

// ===== DROPDOWN MENU =====
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Función para cerrar todos los dropdowns
    function closeAllDropdowns() {
        dropdowns.forEach(d => {
            d.classList.remove('active');
        });
    }
    
    // Para desktop: hover
    if (window.innerWidth > 768) {
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
                dropdown.classList.add('active');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                dropdown.classList.remove('active');
            });
        });
    } 
    // Para móvil: click
    else {
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Cerrar otros dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    
                    // Toggle el actual
                    dropdown.classList.toggle('active');
                });
            }
        });
        
        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                closeAllDropdowns();
            }
        });
        
        // Prevenir que el clic dentro del dropdown lo cierre
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }
}

// ===== MENÚ MÓVIL MEJORADO =====
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    
    if (!toggle || !menu) return;

    // Toggle del menú principal
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        
        menu.classList.toggle('active');
        
        const icon = toggle.querySelector('i');
        if (icon) {
            if (menu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                toggle.classList.add('active');
                document.body.classList.add('no-scroll');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                toggle.classList.remove('active');
                document.body.classList.remove('no-scroll');
                
                // Cerrar dropdowns al cerrar el menú
                document.querySelectorAll('.dropdown').forEach(d => {
                    d.classList.remove('active');
                });
            }
        }
    });

    // Cerrar menú al hacer clic en enlaces (excepto dropdowns)
    document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                toggle.classList.remove('active');
            }
            document.body.classList.remove('no-scroll');
            
            // Cerrar dropdowns
            document.querySelectorAll('.dropdown').forEach(d => {
                d.classList.remove('active');
            });
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (menu.classList.contains('active') && 
            !menu.contains(e.target) && 
            !toggle.contains(e.target)) {
            menu.classList.remove('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                toggle.classList.remove('active');
            }
            document.body.classList.remove('no-scroll');
            
            // Cerrar dropdowns
            document.querySelectorAll('.dropdown').forEach(d => {
                d.classList.remove('active');
            });
        }
    });
    
    // Re-inicializar dropdowns al redimensionar
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menu.classList.contains('active')) {
            menu.classList.remove('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                toggle.classList.remove('active');
            }
            document.body.classList.remove('no-scroll');
            
            // Cerrar dropdowns
            document.querySelectorAll('.dropdown').forEach(d => {
                d.classList.remove('active');
            });
        }
        
        // Re-inicializar dropdowns según el tamaño
        initDropdowns();
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== MODALES =====
function initModals() {
    const closeBtns = document.querySelectorAll('.close-modal');
    
    document.getElementById('btnEnviarCaso')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('contactModal');
    });
    
    document.getElementById('btnEvaluarCaso')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('contactModal');
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal.id);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
    
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Hemos recibido tu caso. Un asesor te contactará en breve.', 'success');
        closeModal('contactModal');
        e.target.reset();
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('no-scroll');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

// ===== NOTIFICACIONES =====
function showNotification(message, type) {
    const notif = document.createElement('div');
    notif.textContent = message;
    Object.assign(notif.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        background: type === 'success' ? '#4B6249' : '#223F33',
        color: 'white',
        borderRadius: '2px',
        zIndex: '3000',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.3s'
    });
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
}

// ===== CALENDLY =====
function initCalendly() {}

window.openCalendly = () => {
    if (window.Calendly) {
        Calendly.initPopupWidget({ url: 'https://calendly.com/ugartefloresabogados/consulta-inicial' });
    } else {
        window.open('https://calendly.com/ugartefloresabogados/consulta-inicial', '_blank');
    }
};

// ===== BOTONES DE AGENDAR =====
function initButtons() {
    const agendarButtons = [
        'btnAgendarHeader', 'btnAgendarHero', 'btnAgendarCta', 'btnAgendarContacto'
    ];
    agendarButtons.forEach(id => {
        document.getElementById(id)?.addEventListener('click', (e) => {
            e.preventDefault();
            openCalendly();
        });
    });
}

// ===== AÑO =====
function initYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ===== CONTADORES =====
function initStatsCounter() {
    const years = document.getElementById('statYears');
    const cases = document.getElementById('statCases');
    const clients = document.getElementById('statClients');
    if (!years || !cases || !clients) return;

    years.textContent = '0';
    cases.textContent = '0';
    clients.textContent = '0';

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(years, 10);
                startCounter(cases, 300);
                startCounter(clients, 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector('.hero-stats'));
}

function startCounter(el, target) {
    let current = 0;
    const increment = Math.ceil(target / 60);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = current;
        }
    }, 15);
}

// ===== SISTEMA DE CARRUSEL =====
class Carousel {
    constructor(trackId, prevBtnId, nextBtnId, items, createItemCallback, options = {}) {
        this.track = document.getElementById(trackId);
        this.prevBtn = document.getElementById(prevBtnId);
        this.nextBtn = document.getElementById(nextBtnId);
        this.items = items;
        this.createItemCallback = createItemCallback;
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = options.autoPlayDelay || 5000;
        this.cardsPerView = 1;
        this.maxIndex = 0;
        
        if (!this.track || !this.prevBtn || !this.nextBtn) return;
        
        this.init();
    }
    
    init() {
        // Crear items
        this.items.forEach(item => {
            this.track.appendChild(this.createItemCallback(item));
        });
        
        // Inicializar
        this.updateCardsPerView();
        window.addEventListener('resize', () => this.updateCardsPerView());
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Auto play
        this.startAutoPlay();
        
        // Pausar al hover
        const container = this.track.closest('.carousel-container');
        if (container) {
            container.addEventListener('mouseenter', () => this.stopAutoPlay());
            container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    updateCardsPerView() {
        const viewport = this.track.closest('.carousel-viewport');
        if (!viewport) return;
        
        const viewportWidth = viewport.clientWidth;
        const firstCard = this.track.children[0];
        if (!firstCard) return;
        
        const cardWidth = firstCard.offsetWidth;
        const gap = window.innerWidth <= 768 ? 16 : 32;
        
        this.cardsPerView = Math.max(1, Math.floor((viewportWidth + gap) / (cardWidth + gap)));
        this.maxIndex = Math.max(0, this.items.length - this.cardsPerView);
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
        this.updateTransform();
    }
    
    updateTransform() {
        const firstCard = this.track.children[0];
        if (!firstCard) return;
        
        const cardWidth = firstCard.offsetWidth;
        const gap = window.innerWidth <= 768 ? 16 : 32;
        const translateX = -this.currentIndex * (cardWidth + gap);
        this.track.style.transform = `translateX(${translateX}px)`;
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateTransform();
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.maxIndex;
        }
        this.updateTransform();
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ===== CARRUSEL DE TEMAS LEGALES CON MODAL PROFESIONAL =====
function initLegalCarousel() {
    const topics = [
        { 
            icon: 'fa-gavel', 
            title: '¿Cómo saber si tienes una orden de aprehensión?', 
            summary: 'Una orden de aprehensión es un mandamiento judicial para detener a una persona. Existen formas legales y seguras de verificarlo sin poner en riesgo tu libertad.',
            fullText: 'Para saber si tienes una orden de aprehensión, puedes consultar en el portal del Poder Judicial de la Federación o acudir a los juzgados con un abogado. Es importante no autoincriminarse y evitar la confrontación directa. Un abogado especializado puede verificar tu situación sin exponerte a una detención inmediata. La asesoría legal oportuna es crucial para proteger tus derechos y tomar las medidas adecuadas según tu caso particular.',
            bg: 'https://plus.unsplash.com/premium_photo-1723629658464-90cf72a29e54?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
        },
        { 
            icon: 'fa-handcuffs', 
            title: '¿Qué hacer ante una detención ilegal?', 
            summary: 'Una detención ilegal vulnera tus derechos humanos. Saber cómo reaccionar puede marcar la diferencia entre recuperar tu libertad o enfrentar consecuencias graves.',
            fullText: 'Ante una detención ilegal, mantén la calma y solicita un abogado de inmediato. No declares sin asesoría legal, ya que cualquier declaración puede ser usada en tu contra. Es crucial promover un amparo y documentar cualquier evidencia de violencia o irregularidades durante la detención. Recuerda que tienes derecho a ser presentado sin demora ante un ministerio público y a que se te informen los motivos de tu detención.',
            bg: 'https://images.unsplash.com/photo-1606022831434-91293aebf25a?q=80&w=1666&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
        },
        { 
            icon: 'fa-hand-holding-heart', 
            title: 'Reparación del daño como víctima', 
            summary: 'Como víctima de un delito, tienes derecho a que se repare el daño material y moral causado. Conocer tus derechos es el primer paso para ejercerlos.',
            fullText: 'La reparación del daño incluye la restitución del bien, la indemnización por daños materiales y morales, así como medidas de rehabilitación y no repetición. Para reclamarla, debes acreditarla dentro del proceso penal. Contar con representación legal especializada maximiza las posibilidades de obtener una compensación justa. La reparación integral busca devolver a la víctima al estado anterior al delito.',
            bg: 'https://images.unsplash.com/photo-1686771416282-3888ddaf249b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
        },
        { 
            icon: 'fa-door-open', 
            title: 'Posibilidades de salir de prisión', 
            summary: 'Existen figuras legales como la libertad bajo fianza o los beneficios preliberacionales que pueden permitir enfrentar el proceso en libertad.',
            fullText: 'Dependiendo del delito, es posible obtener la libertad provisional bajo caución si el delito no es grave. Para delitos graves, existen otras estrategias de defensa. En etapas avanzadas, se pueden solicitar beneficios como la preliberación, siempre que se cumplan los requisitos de conducta y tiempo de condena. Cada caso es único y requiere un análisis detallado por un abogado penalista.',
            bg: 'https://images.unsplash.com/photo-1646297804981-1cefdf960180?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
        },
        { 
            icon: 'fa-credit-card', 
            title: 'Cargos bancarios no reconocidos', 
            summary: 'Detectar cargos no reconocidos a tiempo es fundamental. La ley te protege, pero debes actuar rápido y seguir el procedimiento correcto.',
            fullText: 'Ante cargos no reconocidos, repórtalos inmediatamente al banco y presenta una queja formal ante CONDUSEF. El banco tiene la obligación de investigar y, en su caso, reembolsar el monto. Si no obtienes respuesta favorable, se puede iniciar un procedimiento contencioso o una demanda mercantil. Conserva todos los comprobantes y la comunicación con el banco como evidencia.',
            bg: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
        },
        { 
            icon: 'fa-university', 
            title: '¿Cómo demandar al banco?', 
            summary: 'Las instituciones financieras pueden ser demandadas por malas prácticas. Conoce la ruta legal para hacer valer tus derechos.',
            fullText: 'Para demandar a un banco, primero debes agotar la reclamación ante CONDUSEF. Si no hay acuerdo, se puede proceder con una demanda mercantil por incumplimiento de contrato o responsabilidad civil. Los juicios pueden ser largos, pero con asesoría legal experta, las probabilidades de éxito aumentan significativamente. Es importante contar con un abogado especializado en derecho bancario.',
            bg: 'https://images.unsplash.com/photo-1607944024060-0450380ddd33?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
        }
    ];

    new Carousel('legalTrack', 'legalPrevBtn', 'legalNextBtn', topics, (topic) => {
        const card = document.createElement('div');
        card.className = 'topic-card';
        card.style.backgroundImage = `url('${topic.bg}?auto=format&fit=crop&w=600&q=80')`;
        card.innerHTML = `
            <div class="topic-content">
                <i class="fas ${topic.icon} topic-icon"></i>
                <h3>${topic.title}</h3>
            </div>
        `;
        card.addEventListener('click', () => {
            const modal = document.getElementById('topicModal');
            const content = document.getElementById('modalContent');
            
            // Crear contenido profesional para el modal
            content.innerHTML = `
                <div class="modal-article">
                    <div class="modal-article-header">
                        <i class="fas ${topic.icon}"></i>
                        <h2>${topic.title}</h2>
                    </div>
                    
                    <div class="modal-article-body">
                        <div class="modal-article-summary">
                            <p><strong>Resumen ejecutivo</strong> ${topic.summary}</p>
                        </div>
                        
                        <div class="modal-article-full">
                            <p>${topic.fullText}</p>
                        </div>
                        
                        <div class="modal-divider">
                            <span class="modal-divider-line"></span>
                            <span>Acciones recomendadas</span>
                            <span class="modal-divider-line"></span>
                        </div>
                        
                        <div class="modal-article-actions">
                            <a href="#" class="btn btn-outline" onclick="event.preventDefault(); alert('Redirigiendo al artículo completo...');">
                                <i class="fas fa-book-open"></i> Leer artículo completo
                            </a>
                            <button class="btn btn-primary" onclick="openCalendly(); closeModal('topicModal');">
                                <i class="fas fa-calendar-check"></i> Asesoría Especializada
                            </button>
                        </div>
                    </div>
                </div>
            `;
            openModal('topicModal');
        });
        return card;
    });
}

// ===== CARRUSEL DE TESTIMONIOS MEJORADO CON IMÁGENES =====
function initTestimonialsCarousel() {
    const testimonials = [
        { 
            rating: 5, 
            text: '"El equipo logró la devolución de $450,000 que el banco me retuvo. Impecables."', 
            author: 'María López', 
            role: 'Mercantil',
            image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80'
        },
        { 
            rating: 5, 
            text: '"Recuperé mi departamento en Polanco después de 3 años de litigio."', 
            author: 'Carlos Mendoza', 
            role: 'Civil',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'
        },
        { 
            rating: 5, 
            text: '"Su defensa penal me devolvió la libertad. Eternamente agradecido."', 
            author: 'Ana Reyes', 
            role: 'Penal',
            image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
        },
        { 
            rating: 5, 
            text: '"Cancelaron un crédito que nunca solicité. Rápidos y profesionales."', 
            author: 'Roberto Sánchez', 
            role: 'Mercantil',
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'
        },
        { 
            rating: 5, 
            text: '"Me ayudaron con un conflicto de herencia familiar."', 
            author: 'Laura Gómez', 
            role: 'Civil',
            image: 'https://images.unsplash.com/photo-1672380135241-c024f7fbfa13?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        { 
            rating: 5, 
            text: '"Obtuvimos un amparo favorable en tiempo récord."', 
            author: 'Javier Ruiz', 
            role: 'Penal',
            image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80'
        }
    ];

    new Carousel('testimonialsTrack', 'testimonialsPrevBtn', 'testimonialsNextBtn', testimonials, (t) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.style.backgroundImage = `url('${t.image}')`;
        
        const stars = Array(t.rating).fill('<i class="fas fa-star"></i>').join('');
        card.innerHTML = `
            <div class="testimonial-rating">${stars}</div>
            <p class="testimonial-text">${t.text}</p>
            <p class="testimonial-author">${t.author}</p>
            <p class="testimonial-role">${t.role}</p>
        `;
        return card;
    });
}

// ===== CARRUSEL DE INSTAGRAM CON CÓDIGOS REALES Y ALTURA CORREGIDA =====
function initInstagramCarousel() {
    // Códigos de inserción reales de Instagram
    const instagramCodes = [
        `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DVwoS6cEQet/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin:0; max-width:540px; min-width:326px; width:100%;"></blockquote>`,
        
        `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DVhp4BEERsy/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin:0; max-width:540px; min-width:326px; width:100%;"></blockquote>`,
        
        `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DVPYzbGERlZ/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin:0; max-width:540px; min-width:326px; width:100%;"></blockquote>`,
        
        `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/DVM-h6kEa16/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin:0; max-width:540px; min-width:326px; width:100%;"></blockquote>`
    ];

    new Carousel('instagramTrack', 'instagramPrevBtn', 'instagramNextBtn', instagramCodes, (code) => {
        const container = document.createElement('div');
        container.className = 'instagram-post';
        
        // Estilos específicos para contener los bloques de Instagram
        Object.assign(container.style, {
            width: '350px',
            minWidth: '350px',
            height: 'auto',
            minHeight: '450px',
            background: '#FFF',
            overflow: 'hidden',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        });
        
        // Insertar el código HTML
        container.innerHTML = code;
        
        // Hacer que el bloque de Instagram ocupe toda la altura disponible
        const style = document.createElement('style');
        style.textContent = `
            .instagram-post .instagram-media {
                width: 100% !important;
                min-width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
                min-height: 450px !important;
                margin: 0 !important;
                box-sizing: border-box !important;
            }
        `;
        container.appendChild(style);
        
        return container;
    });
    
    // Procesar los bloques después de insertarlos y ajustar altura
    setTimeout(() => {
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
        
        // Ajustar altura de los bloques después de cargar
        const adjustHeight = () => {
            document.querySelectorAll('.instagram-post .instagram-media').forEach(el => {
                if (el) {
                    el.style.minHeight = '450px';
                    el.style.height = 'auto';
                }
            });
        };
        
        setTimeout(adjustHeight, 1000);
        setTimeout(adjustHeight, 2000);
    }, 500);
}