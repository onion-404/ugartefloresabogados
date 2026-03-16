// ===== PÁGINA DE CONTACTO - FUNCIONALIDAD ESPECÍFICA =====
document.addEventListener('DOMContentLoaded', () => {
    initContactForm();
    initQuickButtons();
});

// ===== MANEJO DEL FORMULARIO DE CONTACTO =====
function initContactForm() {
    const form = document.getElementById('contactFormMain');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aquí iría la lógica para enviar el formulario a un servidor
        // Por ahora simulamos el envío exitoso
        
        // Mostrar loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simular envío (reemplazar con fetch real)
        setTimeout(() => {
            // Resetear botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Mostrar mensaje de éxito
            showNotification('Mensaje enviado con éxito. Te contactaremos pronto.', 'success');
            
            // Resetear formulario
            form.reset();
        }, 1500);
    });
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            input.classList.add('error');
        });
        
        input.addEventListener('input', () => {
            if (input.validity.valid) {
                input.classList.remove('error');
            }
        });
    });
}

// ===== BOTONES DE ACCIÓN RÁPIDA =====
function initQuickButtons() {
    const agendarQuick = document.getElementById('btnAgendarQuick');
    const agendarPresencial = document.getElementById('btnAgendarPresencial');
    
    if (agendarQuick) {
        agendarQuick.addEventListener('click', () => {
            openCalendly();
        });
    }
    
    if (agendarPresencial) {
        agendarPresencial.addEventListener('click', () => {
            // Abrir modal de contacto o Calendly
            if (window.openCalendly) {
                openCalendly();
            } else {
                // Fallback: abrir modal de contacto
                openModal('contactModal');
            }
        });
    }
}

// ===== NOTIFICACIONES (reutiliza la del script principal) =====
// Si no existe la función en el script principal, la definimos aquí
if (typeof showNotification !== 'function') {
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
}