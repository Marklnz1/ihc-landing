/**
 * LexiPic - Interactividad y Accesibilidad Cognitiva
 * Autores: Jhon Jaramillo & Leonardo Cabrera
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initTextToSpeech();
  initScrollAnimations();
});

/**
 * 1. Control del Menú Móvil
 * Cierra el menú desplegable automáticamente cuando se hace clic en cualquier enlace.
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelectorAll('.nav__link, .nav__menu .btn');

  if (!menuToggle) return;

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.checked = false;
    });
  });

  // Cerrar menú con la tecla Escape si está abierto
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.checked) {
      menuToggle.checked = false;
    }
  });
}

/**
 * 2. Desplazamiento Suave (Smooth Scroll) alternativo
 * Mejora la experiencia en navegadores antiguos y ajusta offsets si es necesario.
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calcular posición restando la altura del nav fijo
        const navHeight = document.querySelector('.nav')?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Actualizar foco para accesibilidad
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });
}

/**
 * 3. Integración de Text-to-Speech (Refuerzo Auditivo)
 * Hace clic en cualquier tarjeta de funcionalidad o sección para escuchar el título y descripción.
 * Proporciona feedback visual durante la reproducción.
 */
function initTextToSpeech() {
  const cards = document.querySelectorAll('.card');
  
  if (!('speechSynthesis' in window)) {
    console.warn('El navegador no soporta síntesis de voz (Text-to-Speech).');
    return;
  }

  cards.forEach(card => {
    // Añadir cursor interactivo y tooltip semántico
    card.style.cursor = 'pointer';
    card.setAttribute('title', 'Haz clic para escuchar el audio de esta función');
    card.setAttribute('aria-label', `${card.querySelector('h3')?.innerText}. ${card.querySelector('p')?.innerText}. Haz clic para escuchar.`);

    card.addEventListener('click', () => {
      // Detener cualquier reproducción previa
      window.speechSynthesis.cancel();

      // Obtener textos
      const title = card.querySelector('h3')?.innerText || '';
      const description = card.querySelector('p')?.innerText || '';
      const textToSpeak = `${title}. ${description}`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'es-ES'; // Configurar en español
      utterance.rate = 1.0;     // Velocidad normal para accesibilidad cognitiva

      // Feedback visual agregando una clase temporal
      utterance.onstart = () => {
        card.classList.add('card--speaking');
        // Efecto visual directo en JS por si el CSS tarda en cargar
        card.style.borderColor = 'var(--c-success)';
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.2)';
        card.style.transition = 'all 0.3s ease';
      };

      utterance.onend = () => {
        card.classList.remove('card--speaking');
        card.style.borderColor = '';
        card.style.transform = '';
        card.style.boxShadow = '';
      };

      utterance.onerror = () => {
        card.classList.remove('card--speaking');
        card.style.borderColor = '';
        card.style.transform = '';
        card.style.boxShadow = '';
      };

      window.speechSynthesis.speak(utterance);
    });
  });
}

/**
 * 4. Animaciones de Entrada con IntersectionObserver
 * Agrega efectos visuales suaves cuando los elementos entran en pantalla.
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.card, .price-card, .audience-card');
  
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((el, index) => {
    // Agregar clases de preparación
    el.classList.add('fade-in-prepare');
    // Retraso incremental para efecto cascada
    el.style.transitionDelay = `${(index % 4) * 0.1}s`;
    observer.observe(el);
  });
}
