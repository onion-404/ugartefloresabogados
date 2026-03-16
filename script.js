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
    
    // Inicializar carruseles
    initLegalCarousel();
    initTestimonialsCarousel();
    initInstagramCarousel(); // Versión con códigos reales y altura corregida
    
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

// ===== MENÚ MÓVIL =====
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

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
            }
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                toggle.classList.remove('active');
            }
            document.body.classList.remove('no-scroll');
        });
    });
    
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
        }
    });
    
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
        }
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

// ===== CARRUSEL DE TEMAS LEGALES =====
function initLegalCarousel() {
    const topics = [
        { icon: 'fa-gavel', title: '¿Cómo saber si tienes una orden de aprehensión?', desc: 'Consulta en el portal del Poder Judicial o acude a los juzgados con asesoría legal.', bg: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85' },
        { icon: 'fa-handcuffs', title: '¿Qué hacer ante una detención ilegal?', desc: 'Solicita un abogado inmediatamente, no declares sin asesoría y promueve un amparo.', bg: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f' },
        { icon: 'fa-hand-holding-heart', title: 'Reparación del daño como víctima', desc: 'Tienes derecho a indemnización por daños materiales y morales.', bg: 'https://images.unsplash.com/photo-1557804506-669a67965ba0' },
        { icon: 'fa-door-open', title: 'Posibilidades de salir de prisión', desc: 'Existen figuras como libertad bajo fianza o beneficios preliberacionales.', bg: 'https://images.pexels.com/photos/6863193/pexels-photo-6863193.jpeg' },
        { icon: 'fa-credit-card', title: 'Cargos bancarios no reconocidos', desc: 'Repórtalos al banco y presenta queja ante CONDUSEF.', bg: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51' },
        { icon: 'fa-university', title: '¿Cómo demandar al banco?', desc: 'Inicia con reclamación en CONDUSEF y luego vía judicial.', bg: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf' }
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
            content.innerHTML = `
                <i class="fas ${topic.icon}" style="font-size:3rem; color:var(--primary); margin-bottom:1rem;"></i>
                <h2 style="margin-bottom:1rem;">${topic.title}</h2>
                <p style="margin-bottom:1.5rem;">${topic.desc}</p>
                <button class="btn btn-primary" onclick="openCalendly()">Asesoría Especializada</button>
            `;
            openModal('topicModal');
        });
        return card;
    });
}

// ===== CARRUSEL DE TESTIMONIOS =====
function initTestimonialsCarousel() {
    const testimonials = [
        { rating: 5, text: '"El equipo logró la devolución de $450,000 que el banco me retuvo. Impecables."', author: 'María López', role: 'Mercantil' },
        { rating: 5, text: '"Recuperé mi departamento en Polanco después de 3 años de litigio."', author: 'Carlos Mendoza', role: 'Civil' },
        { rating: 5, text: '"Su defensa penal me devolvió la libertad. Eternamente agradecido."', author: 'Ana Reyes', role: 'Penal' },
        { rating: 5, text: '"Cancelaron un crédito que nunca solicité. Rápidos y profesionales."', author: 'Roberto Sánchez', role: 'Mercantil' },
        { rating: 5, text: '"Me ayudaron con un conflicto de herencia familiar."', author: 'Laura Gómez', role: 'Civil' },
        { rating: 5, text: '"Obtuvimos un amparo favorable en tiempo récord."', author: 'Javier Ruiz', role: 'Penal' }
    ];

    new Carousel('testimonialsTrack', 'testimonialsPrevBtn', 'testimonialsNextBtn', testimonials, (t) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
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
            minHeight: '450px', // Altura fija para permitir ver la imagen y descripción
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