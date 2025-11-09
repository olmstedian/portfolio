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

// Project showcase animations
class ProjectShowcase {
  constructor() {
    this.projects = this.getProjectData();
    this.init();
  }

  init() {
    this.renderProjects();
    this.setupProjectAnimations();
  }

  getProjectData() {
    // Curated real projects only
    return [
      {
        id: 1,
        title: 'Spexop-UI',
        description: 'Complete React component ecosystem with 60+ components, type-safe design tokens, and WCAG AA+ accessibility. MIT licensed with provider-free architecture and modern development practices.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=250&fit=crop',
        technologies: ['React', 'TypeScript', 'Design System', 'Accessibility', 'CLI Tools'],
        github: 'https://github.com/spexop-ui',
        demo: 'https://spexop.com',
        featured: true,
        macosWindow: true
      },
      {
        id: 2,
        title: 'Spexop Pro',
        description: 'Enterprise design system platform for multiple frameworks with advanced component builder, AI-powered theming, MCP integration, and Spexop Command Centre. Complete design-to-code workflow with premium components and enterprise features.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
        technologies: ['React', 'AI/ML', 'MCP', 'Enterprise', 'Design Tools', 'Command Centre'],
        github: 'https://github.com/spexop-pro/spexop-pro',
        demo: null,
        featured: true,
        development: {
          status: 'Under Development',
          timeline: 'Q2 2026'
        },
        macosWindow: true
      },
      {
        id: 3,
        title: 'Argus Eyes Intelligence Platform',
        description: 'Full-stack Signal Intelligence web application featuring advanced SIGINT Command Centre with real-time threat detection, secure communications, and comprehensive surveillance dashboard. Developed both the core intelligence platform and the responsive web interface for authorized agencies.',
        image: 'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=400&h=250&fit=crop',
        technologies: ['Web Development', 'SIGINT', 'Command Centre', 'Real-time Analytics', 'Secure Communications', 'Dashboard UI'],
        github: null,
        demo: null,
        featured: true,
        classification: 'Military/Intelligence',
        confidential: true,
        roles: ['Signal Intelligence App Developer', 'Web Application Developer', 'Command Centre Architect']
      },
      {
        id: 4,
        title: 'Juno Enterprise Security SDK',
        description: 'Military-grade Software Development Kit for intelligence and enterprise applications. Features advanced authentication systems, Role-Based Access Control (RBAC), end-to-end encrypted communications, comprehensive monitoring and auditing capabilities, and secure vault system for sensitive data management.',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
        technologies: ['SDK Development', 'Military Security', 'RBAC', 'Encryption', 'Vault Systems', 'Enterprise Auth', 'Monitoring', 'Auditing'],
        github: null,
        demo: null,
        featured: true,
        classification: 'Military/Intelligence',
        confidential: true,
        roles: ['SDK Architect & Developer', 'Security Systems Engineer', 'Enterprise Solutions Developer']
      },
      {
        id: 5,
        title: 'IRIS - OSINT Intelligence Plugin',
        description: 'Advanced Open Source Intelligence (OSINT) plugin for Juno SDK providing comprehensive data collection, analysis, and threat assessment capabilities. Features automated social media monitoring, dark web intelligence gathering, and real-time threat correlation for military and intelligence operations.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop',
        technologies: ['OSINT Frameworks', 'Data Mining', 'Social Media APIs', 'Threat Intelligence', 'Machine Learning', 'Natural Language Processing', 'Juno SDK', 'Intelligence Analysis'],
        github: null,
        demo: null,
        featured: true,
        classification: 'Military/Intelligence',
        confidential: true,
        roles: ['OSINT Analyst', 'Intelligence Software Engineer', 'Threat Assessment Specialist'],
        development: {
          status: 'Classified Development',
          timeline: 'Ongoing'
        }
      },
      {
        id: 6,
        title: 'Interceptor Simulator',
        description: 'Research-grade IMSI/IMEI Catcher simulation platform for telecommunications interception studies. Features advanced environmental configuration including weather conditions, signal disturbors, interference modeling, temporal variations, and density analysis for comprehensive interception scenario testing.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
        technologies: ['IMSI Catcher', 'IMEI Interception', 'RF Simulation', 'Environmental Modeling', 'Signal Processing', 'Research Platform', 'Telecommunications', 'Interference Analysis'],
        github: null,
        demo: null,
        featured: true,
        classification: 'Military/Intelligence',
        confidential: true,
        roles: ['Telecommunications Research Engineer', 'RF Systems Developer', 'Interception Technology Specialist']
      },
      {
        id: 7,
        title: 'Atlas - Defense Industry Platform',
        description: 'Comprehensive Django-based web application for managing defense industry products, companies, contacts, and collaboration. Centralized platform organizing military and defense-related equipment, systems, and services with real-time features, asynchronous processing, and advanced data management capabilities.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
        technologies: ['Django 5.1.1', 'Django Channels 3.0.5', 'Celery 5.4.0', 'Redis 5.2.1', 'PostgreSQL', 'Bootstrap 5', 'JavaScript', 'WebSocket', 'HTMX'],
        github: null,
        demo: null,
        featured: true,
        classification: 'Military/Intelligence',
        confidential: false, // Defense industry platform, less sensitive
        roles: ['Full Stack Developer', 'Defense Systems Architect', 'Platform Engineer'],
        development: {
          status: 'Active Development',
          timeline: 'Ongoing'
        }
      },
      {
        id: 8,
        title: 'UniFeeds University News Crawler',
        description: 'Intelligent web crawler system for synchronizing news and announcements from multiple university web pages. Features automated content extraction, duplicate detection, real-time updates, and unified feed aggregation for seamless university communication management.',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop',
        technologies: ['Web Crawling', 'Data Synchronization', 'Content Extraction', 'University Systems', 'Feed Aggregation', 'Automation', 'Real-time Updates', 'News Processing'],
        github: null,
        demo: null,
        featured: false,
        roles: ['Web Scraping Engineer', 'Data Integration Specialist', 'University Systems Developer']
      },
      {
        id: 9,
        title: 'Gokturk Alphabet Converter',
        description: 'Specialized linguistic application for game developers to transform modern Latin alphabet Turkish text into ancient runic Gökturk alphabet script. Features accurate historical character mapping, batch text conversion, and seamless integration for creating authentic Turkish gaming experiences with historical authenticity.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
        technologies: ['Linguistic Programming', 'Character Mapping', 'Turkish Language', 'Game Development Tools', 'Historical Scripts', 'Text Processing', 'Cultural Preservation', 'Developer SDK'],
        github: null,
        demo: 'https://gokturk.spexop.de',
        featured: false,
        roles: ['Linguistic Software Engineer', 'Game Development Tool Creator', 'Cultural Technology Specialist']
      },
      {
        id: 10,
        title: 'OKX-TR Bot Configurator',
        description: 'Advanced Python Flask application for automated trading bot configuration and optimization. Features comprehensive historical data analysis, technical indicator evaluation, market trend assessment, and intelligent recommendation engine to suggest optimal bot parameters for cryptocurrency trading strategies.',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
        technologies: ['Python', 'Flask', 'Technical Analysis', 'Trading Algorithms', 'Data Analytics', 'Financial APIs', 'Machine Learning', 'Cryptocurrency', 'Bot Configuration'],
        github: null,
        demo: null,
        featured: true,
        roles: ['Trading Bot Developer', 'Financial Data Analyst', 'Algorithm Engineer']
      }
    ];
  }

  renderProjects() {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    // Beautiful grid layout that works
    container.style.cssText = `
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)) !important;
      gap: 2rem !important;
      max-width: 1400px !important;
      margin: 0 auto !important;
      padding: 2rem !important;
    `;

    container.innerHTML = this.projects.map((project, index) => `
      <div style="
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 20px !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
        transition: transform 0.3s ease !important;
        opacity: 1 !important;
        visibility: visible !important;
        position: relative !important;
        min-height: 520px !important;
      " onmouseover="this.style.transform='translateY(-12px) scale(1.03)'; this.style.boxShadow='0 32px 64px rgba(0, 0, 0, 0.2)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 20px 40px rgba(0, 0, 0, 0.1)'">
        ${project.macosWindow ? `
          <div class="window-titlebar">
            <div class="window-controls">
              <div class="window-control close"></div>
              <div class="window-control minimize"></div>
              <div class="window-control maximize"></div>
            </div>
            <div class="window-title">${project.title}</div>
          </div>
        ` : ''}
        <div style="
          position: relative !important;
          height: 280px !important;
          overflow: hidden !important;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
        ">
          <img src="${project.image}" alt="${project.title}" loading="lazy" style="
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            transition: transform 0.3s ease !important;
          " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          
          <!-- Status badges positioned over image -->
          <div style="
            position: absolute !important;
            top: 16px !important;
            right: 16px !important;
            z-index: 15 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
            align-items: flex-end !important;
          ">
            ${project.featured ? '<span style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); backdrop-filter: blur(10px);">✨ Featured</span>' : ''}
            ${project.classification ? '<span style="background: linear-gradient(135deg, #ff6b35, #f7931e); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4); backdrop-filter: blur(10px);">🔒 ' + project.classification.toUpperCase() + '</span>' : ''}
            ${project.confidential ? '<span style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4); backdrop-filter: blur(10px); position: relative; overflow: hidden;" onmouseover="this.style.transform=\'scale(1.05)\'; this.style.boxShadow=\'0 6px 16px rgba(220, 38, 38, 0.5)\'" onmouseout="this.style.transform=\'scale(1)\'; this.style.boxShadow=\'0 4px 12px rgba(220, 38, 38, 0.4)\'">🔴 CONFIDENTIAL</span>' : ''}
            ${project.development ? '<span style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4); backdrop-filter: blur(10px);">🚧 ' + project.development.status + '</span>' : ''}
          </div>
          

        </div>
        
        <div style="
          padding: 24px !important;
          flex-grow: 1 !important;
          display: flex !important;
          flex-direction: column !important;
        ">
          <h3 style="
            color: #1f2937 !important;
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            margin: 0 0 16px 0 !important;
            line-height: 1.2 !important;
          ">${project.title}</h3>
          
          <p style="
            color: #6b7280 !important;
            margin-bottom: 20px !important;
            line-height: 1.6 !important;
            flex-grow: 1 !important;
            font-size: 15px !important;
          ">${project.description}</p>
          
          ${project.roles ? '<div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05)); padding: 20px; border-radius: 16px; margin-bottom: 20px; border-left: 4px solid #3b82f6; backdrop-filter: blur(10px);"><h4 style="color: #1e40af; font-size: 14px; font-weight: 700; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">My Role:</h4><div style="display: flex; flex-wrap: wrap; gap: 8px;">' + project.roles.map(role => '<span style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 8px 16px; border-radius: 25px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);">' + role + '</span>').join('') + '</div></div>' : ''}
          
          <div style="
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 10px !important;
            margin-bottom: 24px !important;
          ">
            ${project.technologies.slice(0, 6).map(tech => `<span style="
              background: linear-gradient(135deg, #f1f5f9, #e2e8f0) !important;
              color: #475569 !important;
              padding: 10px 16px !important;
              border-radius: 20px !important;
              font-size: 12px !important;
              font-weight: 700 !important;
              border: 1px solid #cbd5e1 !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5px !important;
              transition: all 0.2s ease !important;
            " onmouseover="this.style.background='linear-gradient(135deg, #e2e8f0, #cbd5e1)'" onmouseout="this.style.background='linear-gradient(135deg, #f1f5f9, #e2e8f0)'">${tech}</span>`).join('')}
            ${project.technologies.length > 6 ? `<span style="
              background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
              color: white !important;
              padding: 10px 16px !important;
              border-radius: 20px !important;
              font-size: 12px !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5px !important;
            ">+${project.technologies.length - 6}</span>` : ''}
          </div>
          
          <!-- Action Buttons -->
          <div style="
            display: flex !important;
            gap: 12px !important;
            padding: 0 24px 24px 24px !important;
          ">
            ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" style="
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
              padding: 12px 20px !important;
              background: linear-gradient(135deg, #24292e, #1b1f23) !important;
              color: white !important;
              text-decoration: none !important;
              border-radius: 10px !important;
              font-weight: 600 !important;
              font-size: 14px !important;
              transition: all 0.2s ease !important;
              border: 1px solid rgba(255, 255, 255, 0.1) !important;
              flex: 1 !important;
              justify-content: center !important;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(36, 41, 46, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              <span>🐙</span> GitHub
            </a>` : ''}
            ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" style="
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
              padding: 12px 20px !important;
              background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
              color: white !important;
              text-decoration: none !important;
              border-radius: 10px !important;
              font-weight: 600 !important;
              font-size: 14px !important;
              transition: all 0.2s ease !important;
              border: 1px solid rgba(255, 255, 255, 0.2) !important;
              flex: 1 !important;
              justify-content: center !important;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(59, 130, 246, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
              <span>🔗</span> Live Demo
            </a>` : ''}
          </div>

        </div>
      </div>
    `).join('');

    // Mark container for stagger animation
    container.classList.add('stagger-container');
  }

  setupProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      const isMacosWindow = card.classList.contains('macos-window');
      
      if (isMacosWindow) {
        // Special macOS window animations
        this.setupMacOSWindowAnimations(card);
      } else {
        // Regular tilt effect for non-macOS cards
        this.setupRegularCardAnimations(card);
      }
    });
  }

  setupMacOSWindowAnimations(card) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Subtle hover effect for macOS windows
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20; // Less intense rotation
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
          // Animate close
          card.style.transform = 'scale(0.8) rotateY(90deg)';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transform = '';
            card.style.opacity = '';
          }, 1000);
        } else if (control.classList.contains('minimize')) {
          // Animate minimize
          card.style.transform = 'scale(0.1) translateY(100px)';
          setTimeout(() => {
            card.style.transform = '';
          }, 800);
        } else if (control.classList.contains('maximize')) {
          // Animate maximize
          card.style.transform = 'scale(1.1)';
          setTimeout(() => {
            card.style.transform = '';
          }, 300);
        }
      });
    });
  }

  setupRegularCardAnimations(card) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Regular hover tilt effect
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
}

// Initialize animation controller when DOM is ready
let animationController;
let projectShowcase;

document.addEventListener('DOMContentLoaded', () => {
  animationController = new AnimationController();
  projectShowcase = new ProjectShowcase();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnimationController, ProjectShowcase };
}