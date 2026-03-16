// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initAOS();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initModals();
    initCalendly();
    initButtons();
    initStatsCounter();
    
    // Inicializar los 3 carruseles con sus datos
    initLegalCarousel();
    initTestimonialsCarousel();
    initInstagramCarousel();
    
    initYear();
});

// ===== LOADER =====
function initLoader() {
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader?.classList.add('hidden'), 800);
    });
}

// ===== AOS =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }
}

// ===== HEADER SCROLL =====
function initHeader() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== MENÚ MÓVIL =====
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        const icon = toggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.querySelector('i').classList.add('fa-bars');
            toggle.querySelector('i').classList.remove('fa-times');
            document.body.style.overflow = 'auto';
        });
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== MODALES =====
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close-modal');
    
    // Abrir modal de contacto
    document.getElementById('btnEnviarCaso')?.addEventListener('click', () => {
        document.getElementById('contactModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    document.getElementById('btnEvaluarCaso')?.addEventListener('click', () => {
        document.getElementById('contactModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Cerrar modales
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Formulario
    document.getElementById('contactForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Caso enviado. Te contactaremos pronto.', 'success');
        document.getElementById('contactModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        e.target.reset();
    });
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
function initCalendly() {
    if (!document.querySelector('script[src*="calendly"]')) {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.body.appendChild(script);
    }
}

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
        document.getElementById(id)?.addEventListener('click', openCalendly);
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

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(years, 15);
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
        
        if (!this.track || !this.prevBtn || !this.nextBtn) return;
        
        this.init();
    }
    
    init() {
        // Crear items
        this.items.forEach(item => {
            this.track.appendChild(this.createItemCallback(item));
        });
        
        // Actualizar cards por vez
        this.updateCardsPerView();
        window.addEventListener('resize', () => this.updateCardsPerView());
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Auto play
        this.startAutoPlay();
        
        // Pausar al hover
        const container = this.track.closest('.carousel-container');
        container.addEventListener('mouseenter', () => this.stopAutoPlay());
        container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Actualizar botones
        this.updateButtons();
    }
    
    updateCardsPerView() {
        const viewport = this.track.closest('.carousel-viewport');
        if (!viewport) return;
        
        const viewportWidth = viewport.clientWidth;
        const card = this.track.children[0];
        if (!card) return;
        
        const cardStyle = window.getComputedStyle(card);
        const cardWidth = card.offsetWidth + parseInt(cardStyle.marginRight) || 0;
        const gap = 32; // 2rem
        
        this.cardsPerView = Math.floor((viewportWidth + gap) / (cardWidth + gap));
        this.maxIndex = Math.max(0, this.items.length - this.cardsPerView);
        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
        this.updateTransform();
    }
    
    updateTransform() {
        const card = this.track.children[0];
        if (!card) return;
        
        const cardWidth = card.offsetWidth;
        const gap = 32;
        const translateX = -this.currentIndex * (cardWidth + gap);
        this.track.style.transform = `translateX(${translateX}px)`;
        this.updateButtons();
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateTransform();
        } else {
            // Volver al inicio
            this.currentIndex = 0;
            this.updateTransform();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateTransform();
        } else {
            // Ir al final
            this.currentIndex = this.maxIndex;
            this.updateTransform();
        }
    }
    
    updateButtons() {
        this.prevBtn.disabled = false;
        this.nextBtn.disabled = false;
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
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
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

// ===== CARRUSEL DE INSTAGRAM =====
function initInstagramCarousel() {
    const posts = [
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0',
        'https://images.unsplash.com/photo-1551836022-4c4c79ecde51',
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
        'https://images.pexels.com/photos/6863193/pexels-photo-6863193.jpeg',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf'
    ];

    new Carousel('instagramTrack', 'instagramPrevBtn', 'instagramNextBtn', posts, (src) => {
        const post = document.createElement('div');
        post.className = 'instagram-post';
        post.innerHTML = `
            <img src="${src}?auto=format&fit=crop&w=500&q=80" alt="Instagram">
            <div class="post-overlay">
                <i class="fab fa-instagram"></i>
                <span>Ver en Instagram</span>
            </div>
        `;
        post.addEventListener('click', () => {
            window.open('https://www.instagram.com/ugartefloresabogados/', '_blank');
        });
        return post;
    });
}