// Animation Controller for Modern Portfolio

class AnimationController {
  constructor() {
    this.observers = new Map();
    this.animatedElements = new Set();
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    this.setupIntersectionObservers();
    this.setupScrollAnimations();
    this.setupParallaxEffects();
    this.setupMouseInteractions();
    this.setupLiquidBlobs();
    this.setupProjectAnimations();
  }

  /**
   * Setup animations for project cards
   */
  setupProjectAnimations() {
    // Wait for projects to be rendered, then setup animations
    const observer = new MutationObserver(() => {
      const projectCards = document.querySelectorAll('.project-card');
      if (projectCards.length > 0) {
        this.attachProjectAnimations(projectCards);
        observer.disconnect();
      }
    });

    const container = document.getElementById('projects-grid');
    if (container) {
      observer.observe(container, { childList: true, subtree: true });
      
      // Try immediately in case projects are already rendered
      const projectCards = document.querySelectorAll('.project-card');
      if (projectCards.length > 0) {
        this.attachProjectAnimations(projectCards);
        observer.disconnect();
      }
    }
  }

  /**
   * Attach animations to project cards
   */
  attachProjectAnimations(projectCards) {
    projectCards.forEach(card => {
      const isMacosWindow = card.classList.contains('macos-window');
      
      if (isMacosWindow) {
        this.setupMacOSWindowAnimations(card);
      } else {
        this.setupRegularCardAnimations(card);
      }
    });
  }

  /**
   * Setup macOS window animations
   */
  setupMacOSWindowAnimations(card) {
    if (this.isReducedMotion) return;

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
    });

    // Window control interactions
    const controls = card.querySelectorAll('.window-control');
    controls.forEach(control => {
      control.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (control.classList.contains('close')) {
          card.style.transform = 'scale(0.8) rotateY(90deg)';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transform = '';
            card.style.opacity = '';
          }, 1000);
        } else if (control.classList.contains('minimize')) {
          card.style.transform = 'scale(0.1) translateY(100px)';
          setTimeout(() => {
            card.style.transform = '';
          }, 800);
        } else if (control.classList.contains('maximize')) {
          card.style.transform = 'scale(1.1)';
          setTimeout(() => {
            card.style.transform = '';
          }, 300);
        }
      });
    });
  }

  /**
   * Setup regular card animations
   */
  setupRegularCardAnimations(card) {
    if (this.isReducedMotion) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
  }

  /**
   * Setup intersection observers for scroll-triggered animations
   */
  setupIntersectionObservers() {
    if (this.isReducedMotion) return;

    // Observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.animatedElements.add(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '-50px 0px'
    });

    // Observer for stagger animations
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const staggerItems = entry.target.querySelectorAll('.stagger-item');
          staggerItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 100);
          });
        }
      });
    }, {
      threshold: 0.1
    });

    this.observers.set('fade', fadeObserver);
    this.observers.set('stagger', staggerObserver);

    // Apply observers to elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
      fadeObserver.observe(el);
    });

    document.querySelectorAll('.stagger-container').forEach(el => {
      staggerObserver.observe(el);
    });

    // Skills grid stagger animation
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
      staggerObserver.observe(skillsGrid);
    }
  }

  /**
   * Setup scroll-based animations
   */
  setupScrollAnimations() {
    if (this.isReducedMotion) return;

    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (navbar) {
        if (currentScrollY > 100) {
          navbar.style.background = 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.1)';
          navbar.style.boxShadow = 'none';
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
          navbar.style.transform = 'translateY(-100%)';
        } else {
          navbar.style.transform = 'translateY(0)';
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  /**
   * Setup parallax effects for hero section
   */
  setupParallaxEffects() {
    if (this.isReducedMotion) return;

    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length === 0) return;

    const handleParallax = throttle(() => {
      const scrollY = window.scrollY;
      
      parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 16); // ~60fps

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  /**
   * Setup mouse interaction effects
   */
  setupMouseInteractions() {
    if (this.isReducedMotion) return;

    // Magnetic effect for buttons
    const magneticElements = document.querySelectorAll('.btn, .card');
    
    magneticElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const moveX = deltaX * 10;
        const moveY = deltaY * 10;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px) scale(1)';
      });
    });

    // Cursor follow effect
    this.setupCursorFollower();
  }

  /**
   * Setup custom cursor follower
   */
  setupCursorFollower() {
    // Create cursor follower element
    const cursor = createElement('div', {
      className: 'cursor-follower',
      style: `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease-out;
        mix-blend-mode: difference;
      `
    });

    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      cursorX = lerp(cursorX, mouseX, 0.1);
      cursorY = lerp(cursorY, mouseY, 0.1);
      
      cursor.style.left = cursorX - 10 + 'px';
      cursor.style.top = cursorY - 10 + 'px';
      
      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Scale cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
      });

      element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
      });
    });
  }

  /**
   * Enhanced liquid blob animations
   */
  setupLiquidBlobs() {
    if (this.isReducedMotion) return;

    const blobs = document.querySelectorAll('.liquid-blob');
    
    blobs.forEach((blob, index) => {
      // Add random initial positions and scales
      const initialX = random(-50, 50);
      const initialY = random(-50, 50);
      const initialScale = random(0.8, 1.2);
      
      blob.style.setProperty('--initial-x', `${initialX}px`);
      blob.style.setProperty('--initial-y', `${initialY}px`);
      blob.style.setProperty('--initial-scale', initialScale);
      
      // Add mouse interaction
      blob.addEventListener('mouseenter', () => {
        blob.style.animationPlayState = 'paused';
        blob.style.transform = `scale(${initialScale * 1.2})`;
        blob.style.filter = 'blur(2px)';
      });

      blob.addEventListener('mouseleave', () => {
        blob.style.animationPlayState = 'running';
        blob.style.transform = '';
        blob.style.filter = '';
      });
    });

    // Add dynamic blob creation on scroll
    this.setupDynamicBlobs();
  }

  /**
   * Create dynamic floating blobs on scroll
   */
  setupDynamicBlobs() {
    let blobCount = 0;
    const maxBlobs = 5;
    
    const createDynamicBlob = throttle(() => {
      if (blobCount >= maxBlobs) return;
      
      const blob = createElement('div', {
        className: 'dynamic-blob',
        style: `
          position: fixed;
          width: ${random(20, 60)}px;
          height: ${random(20, 60)}px;
          background: linear-gradient(${random(0, 360)}deg, 
            rgba(59, 130, 246, ${random(0.1, 0.3)}),
            rgba(147, 197, 253, ${random(0.05, 0.2)}));
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
          animation: floatAway 8s ease-out forwards;
        `
      });

      // Position blob at scroll position
      blob.style.left = random(0, window.innerWidth) + 'px';
      blob.style.top = window.scrollY + window.innerHeight + 'px';

      document.body.appendChild(blob);
      blobCount++;

      // Remove blob after animation
      setTimeout(() => {
        if (blob.parentNode) {
          blob.parentNode.removeChild(blob);
          blobCount--;
        }
      }, 8000);
    }, 500);

    // Add CSS for dynamic blob animation
    const style = createElement('style');
    style.textContent = `
      @keyframes floatAway {
        0% {
          transform: translateY(0) scale(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 0.5;
        }
        100% {
          transform: translateY(-100vh) scale(1);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', createDynamicBlob, { passive: true });
  }

  /**
   * Text typing animation
   */
  setupTypingAnimation(element, text, speed = 50) {
    if (this.isReducedMotion) return;

    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    };

    element.textContent = '';
    typeWriter();
  }

  /**
   * Cleanup animations and observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.animatedElements.clear();
  }
}

// Initialize animation controller when DOM is ready
let animationController;

document.addEventListener('DOMContentLoaded', () => {
  animationController = new AnimationController();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationController };
}