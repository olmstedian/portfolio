// Main JavaScript for Portfolio Website

class Portfolio {
  constructor() {
    this.isLoaded = false;
    this.isMobile = window.innerWidth < 768;
    this.init();
  }

  async init() {
    try {
      await this.waitForDOMReady();
      this.setupEventListeners();
      this.initializeComponents();
      this.setupAccessibility();
      this.handleInitialLoad();
      this.isLoaded = true;
    } catch (error) {
      console.error('Portfolio initialization failed:', error);
    }
  }

  /**
   * Wait for DOM to be ready
   */
  waitForDOMReady() {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Smooth scrolling for navigation links
    this.setupSmoothScrolling();
    
    // Mobile navigation
    this.setupMobileNavigation();
    
    // Window resize handler
    window.addEventListener('resize', debounce(() => {
      this.handleResize();
    }, 250));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Form submissions
    this.setupFormHandlers();

    // Performance monitoring
    this.setupPerformanceMonitoring();
  }

  /**
   * Setup smooth scrolling for navigation
   */
  setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offset = document.querySelector('.navbar').offsetHeight + 20;
          smoothScrollTo(targetElement, offset);
          
          // Update URL without triggering scroll
          history.pushState(null, null, targetId);
          
          // Close mobile menu if open
          this.closeMobileMenu();
        }
      });
    });
  }

  /**
   * Setup mobile navigation toggle
   */
  setupMobileNavigation() {
    const toggleButton = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.navbar-nav');
    const body = document.body;

    if (!toggleButton || !navMenu) return;

    toggleButton.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('active');
      
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleButton.contains(e.target) && !navMenu.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * Open mobile navigation menu
   */
  openMobileMenu() {
    const toggleButton = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.navbar-nav');
    
    navMenu.classList.add('active');
    toggleButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Animate hamburger lines
    const lines = toggleButton.querySelectorAll('.hamburger-line');
    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    lines[1].style.opacity = '0';
    lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
  }

  /**
   * Close mobile navigation menu
   */
  closeMobileMenu() {
    const toggleButton = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.navbar-nav');
    
    navMenu.classList.remove('active');
    toggleButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Reset hamburger lines
    const lines = toggleButton.querySelectorAll('.hamburger-line');
    lines[0].style.transform = '';
    lines[1].style.opacity = '';
    lines[2].style.transform = '';
  }

  /**
   * Initialize components
   */
  initializeComponents() {
    // Initialize theme switcher if present
    this.initializeThemeSwitcher();
    
    // Initialize contact form
    this.initializeContactForm();
    
    // Initialize scroll progress indicator
    this.initializeScrollProgress();
    
    // Initialize lazy loading
    this.initializeLazyLoading();
  }

  /**
   * Initialize theme switcher
   */
  initializeThemeSwitcher() {
    // Auto-detect system theme preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = Storage.get('portfolio-theme');
    
    if (storedTheme) {
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else if (prefersDark.matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
      if (!Storage.get('portfolio-theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Initialize contact form
   */
  initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      try {
        // Here you would typically send the form data to your backend
        console.log('Form submission:', data);
        
        // Show success message
        this.showFormMessage('Thank you! Your message has been sent.', 'success');
        contactForm.reset();
        
      } catch (error) {
        console.error('Form submission error:', error);
        this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
      }
    });
  }

  /**
   * Show form message
   */
  showFormMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    
    const form = document.getElementById('contact-form');
    form.appendChild(messageEl);
    
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }

  /**
   * Initialize scroll progress indicator
   */
  initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 2px;
      background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600));
      z-index: 9999;
      transition: width 0.1s ease-out;
    `;
    
    document.body.appendChild(progressBar);

    const updateProgress = throttle(() => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }, 16);

    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  /**
   * Initialize lazy loading for images
   */
  initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Setup form handlers
   */
  setupFormHandlers() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Add form validation
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        
        input.addEventListener('input', debounce(() => {
          this.clearFieldError(input);
        }, 300));
      });
    });
  }

  /**
   * Validate form field
   */
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    let isValid = true;
    let errorMessage = '';

    if (required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  /**
   * Show field error
   */
  showFieldError(field, message) {
    field.classList.add('field-error');
    
    let errorEl = field.parentNode.querySelector('.field-error-message');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error-message';
      field.parentNode.appendChild(errorEl);
    }
    
    errorEl.textContent = message;
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove('field-error');
    
    const errorEl = field.parentNode.querySelector('.field-error-message');
    if (errorEl) {
      errorEl.remove();
    }
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Enhance focus management
    this.setupFocusManagement();
    
    // Add ARIA labels where needed
    this.enhanceARIA();
  }

  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Track focus for keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Focus trap for mobile menu
    const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select';
    
    document.addEventListener('keydown', (e) => {
      const mobileMenu = document.querySelector('.navbar-nav.active');
      if (!mobileMenu || e.key !== 'Tab') return;

      const focusableContent = mobileMenu.querySelectorAll(focusableElements);
      const firstFocusableElement = focusableContent[0];
      const lastFocusableElement = focusableContent[focusableContent.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    });
  }

  /**
   * Enhance ARIA attributes
   */
  enhanceARIA() {
    // Add ARIA labels to interactive elements without text
    const interactiveElements = document.querySelectorAll('button:empty, a:empty');
    
    interactiveElements.forEach(element => {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        console.warn('Interactive element missing accessible label:', element);
      }
    });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboardNavigation(e) {
    // Handle escape key globally
    if (e.key === 'Escape') {
      this.closeMobileMenu();
    }
    
    // Handle arrow keys for navigation
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
      const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
      
      if (currentIndex !== -1) {
        const nextIndex = e.key === 'ArrowDown' 
          ? Math.min(currentIndex + 1, focusableElements.length - 1)
          : Math.max(currentIndex - 1, 0);
        
        focusableElements[nextIndex].focus();
        e.preventDefault();
      }
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;
    
    // Close mobile menu on desktop
    if (wasMobile && !this.isMobile) {
      this.closeMobileMenu();
    }
    
    // Recalculate animations
    if (window.animationController) {
      window.animationController.handleResize?.();
    }
  }

  /**
   * Handle initial page load
   */
  handleInitialLoad() {
    // Check for hash in URL and scroll to element
    if (window.location.hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
          const offset = document.querySelector('.navbar').offsetHeight + 20;
          smoothScrollTo(targetElement, offset);
        }
      }, 100);
    }

    // Mark page as loaded
    document.body.classList.add('loaded');
    
    // Trigger performance measurement
    Performance.mark('portfolio-loaded');
  }

  /**
   * Setup performance monitoring
   */
  setupPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would require importing web-vitals library
      // getCLS(console.log);
      // getFID(console.log);
      // getLCP(console.log);
    }

    // Monitor custom metrics
    Performance.mark('portfolio-interactive');
    
    window.addEventListener('load', () => {
      Performance.mark('portfolio-fully-loaded');
      Performance.measure('portfolio-load-time', 'navigationStart', 'portfolio-fully-loaded');
      
      // Log performance metrics
      setTimeout(() => {
        const measures = Performance.getEntries('measure');
        console.log('Portfolio Performance:', measures);
      }, 100);
    });
  }
}

// Initialize portfolio when DOM is ready
const portfolio = new Portfolio();

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Portfolio error:', e.error);
  
  // Send error to analytics service if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      'description': e.error.message,
      'fatal': false
    });
  }
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const swPath = window.location.pathname.endsWith('/')
        ? 'sw.js'
        : `${window.location.pathname.split('/').slice(0, -1).join('/') || '.'}/sw.js`;
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('SW registered: ', registration);
    } catch (registrationError) {
      console.log('SW registration failed: ', registrationError);
    }
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Portfolio };
}