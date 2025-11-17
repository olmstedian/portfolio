export type Language = 'en' | 'tr'

export interface Translations {
  nav: {
    about: string
    projects: string
    github: string
    contact: string
  }
  hero: {
    greeting: string
    title: string
    subtitle: string
    description: string
    description2: string
    viewProjects: string
    getInTouch: string
  }
  about: {
    title: string
    description: string
    journey: string
    journeyDesc: string
    journeyDesc2: string
    expertise: string
    skills: string
    hardwareDesign: string
    dataSystems: string
    webApps: string
    infrastructure: string
    electronics: {
      title: string
      description: string
    }
    backend: {
      title: string
      description: string
    }
    frontend: {
      title: string
      description: string
    }
    devops: {
      title: string
      description: string
    }
  }
  projects: {
    title: string
    subtitle: string
    loading: string
    error: string
    empty: string
    cached: string
    featured: string
    confidential: string
    myRole: string
    more: string
    github: string
    liveDemo: string
    underDevelopment: string
    activeDevelopment: string
    classifiedDevelopment: string
    ongoing: string
    items: {
      [key: string]: {
        title: string
        description: string
        roles?: string[]
        technologies?: string[]
      }
    }
    technologies: {
      [key: string]: string
    }
  }
  github: {
    title: string
    subtitle: string
    loading: string
    error: string
    rateLimit: string
    rateLimitDesc: string
    tryAgain: string
    viewOnGitHub: string
    browseOnGitHub: string
    noRepos: string
    featuredRepos: string
    cached: string
  }
  contact: {
    title: string
    subtitle: string
    emailMe: string
    sendEmail: string
    socialMedia: string
    cta: string
  }
  footer: {
    builtWith: string
    copyright: string
    tagline: string
  }
  carousel: {
    previous: string
    next: string
    previousSlide: string
    nextSlide: string
    goToSlide: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      about: 'About',
      projects: 'Projects',
      github: 'GitHub',
      contact: 'Contact',
    },
    hero: {
      greeting: "Hello, I'm",
      title: 'Cüneyt Çakar',
      subtitle: '@olmstedian',
      description: 'Electronic & Communications Engineer | Full Stack Developer',
      description2: 'I work on signal intelligence systems and develop web applications. I enjoy working on both hardware and software projects.',
      viewProjects: 'View Projects',
      getInTouch: 'Get in Touch',
    },
    about: {
      title: 'About Me',
      description: "I'm an Electronic & Communications Engineer who enjoys working on both hardware engineering and software development projects.",
      journey: 'My Journey',
      journeyDesc: 'I worked as a professional manager in different industries and companies for more than 20 years. Currently, I am a founder and partner of international projects, a shareholder of international companies, and work remotely and freelance on various projects.',
      journeyDesc2: 'With a background in Electronic & Communications Engineering, I work on signal intelligence systems and web applications. I find it rewarding to work on projects that involve both hardware and software aspects, from RF circuits to full-stack applications. I enjoy continuous learning and improving my skills through each project, focusing on doing solid work and solving problems effectively.',
      expertise: 'Areas of Work',
      skills: 'Technical Skills',
      hardwareDesign: 'Hardware Design',
      dataSystems: 'Data Systems',
      webApps: 'Web Applications',
      infrastructure: 'Infrastructure',
      electronics: {
        title: 'Electronics & Signal Processing',
        description: 'Work on RF circuits, signal intelligence systems, and real-time DSP solutions.',
      },
      backend: {
        title: 'Backend Development',
        description: 'Build server-side applications and APIs using modern technologies.',
      },
      frontend: {
        title: 'Frontend Development',
        description: 'Develop responsive user interfaces with modern frameworks and web technologies.',
      },
      devops: {
        title: 'DevOps & Cloud',
        description: 'Deploy and manage applications with modern infrastructure and CI/CD pipelines.',
      },
    },
    projects: {
      title: 'Featured Projects',
      subtitle: 'A selection of my recent work spanning hardware engineering and full stack development',
      loading: 'Loading projects...',
      error: 'Failed to load projects',
      empty: 'No projects available at the moment.',
      cached: 'Showing cached project data',
      featured: 'Featured',
      confidential: 'CONFIDENTIAL',
      myRole: 'My Role',
      more: 'more',
      github: 'GitHub',
      liveDemo: 'Live Demo',
      underDevelopment: 'Under Development',
      activeDevelopment: 'Active Development',
      classifiedDevelopment: 'Classified Development',
      ongoing: 'Ongoing',
      technologies: {
        'React': 'React',
        'TypeScript': 'TypeScript',
        'Design System': 'Design System',
        'Accessibility': 'Accessibility',
        'CLI Tools': 'CLI Tools',
        'JavaScript': 'JavaScript',
        'Python': 'Python',
        'Node.js': 'Node.js',
        'Django': 'Django',
        'PostgreSQL': 'PostgreSQL',
        'Tailwind CSS': 'Tailwind CSS',
        'Vue.js': 'Vue.js',
        'Nest.js': 'Nest.js',
        'Supabase': 'Supabase',
        'Firebase': 'Firebase',
        'AWS': 'AWS',
        'Docker': 'Docker',
        'Linux': 'Linux',
        'CI/CD': 'CI/CD',
        'Kubernetes': 'Kubernetes',
        'RF Design': 'RF Design',
        'SIGINT': 'SIGINT',
        'DSP': 'DSP',
        'FPGA': 'FPGA',
        'Embedded Systems': 'Embedded Systems',
        'Web Development': 'Web Development',
        'Command Centre': 'Command Centre',
        'Real-time Analytics': 'Real-time Analytics',
        'Secure Communications': 'Secure Communications',
        'Dashboard UI': 'Dashboard UI',
        'SDK Development': 'SDK Development',
        'Military Security': 'Military Security',
        'RBAC': 'RBAC',
        'Encryption': 'Encryption',
        'Vault Systems': 'Vault Systems',
        'Enterprise Auth': 'Enterprise Auth',
        'Monitoring': 'Monitoring',
        'Auditing': 'Auditing',
        'OSINT Frameworks': 'OSINT Frameworks',
        'Data Mining': 'Data Mining',
        'Social Media APIs': 'Social Media APIs',
        'Threat Intelligence': 'Threat Intelligence',
        'Machine Learning': 'Machine Learning',
        'Natural Language Processing': 'Natural Language Processing',
        'Juno SDK': 'Juno SDK',
        'Intelligence Analysis': 'Intelligence Analysis',
        'IMSI Catcher': 'IMSI Catcher',
        'IMEI Interception': 'IMEI Interception',
        'RF Simulation': 'RF Simulation',
        'Environmental Modeling': 'Environmental Modeling',
        'Signal Processing': 'Signal Processing',
        'Research Platform': 'Research Platform',
        'Telecommunications': 'Telecommunications',
        'Interference Analysis': 'Interference Analysis',
        'Django Channels': 'Django Channels',
        'Celery': 'Celery',
        'Redis': 'Redis',
        'Bootstrap': 'Bootstrap',
        'WebSocket': 'WebSocket',
        'HTMX': 'HTMX',
        'Web Crawling': 'Web Crawling',
        'Data Synchronization': 'Data Synchronization',
        'Content Extraction': 'Content Extraction',
        'University Systems': 'University Systems',
        'Feed Aggregation': 'Feed Aggregation',
        'Automation': 'Automation',
        'Real-time Updates': 'Real-time Updates',
        'News Processing': 'News Processing',
        'Linguistic Programming': 'Linguistic Programming',
        'Character Mapping': 'Character Mapping',
        'Turkish Language': 'Turkish Language',
        'Game Development Tools': 'Game Development Tools',
        'Historical Scripts': 'Historical Scripts',
        'Text Processing': 'Text Processing',
        'Cultural Preservation': 'Cultural Preservation',
        'Developer SDK': 'Developer SDK',
        'Flask': 'Flask',
        'Technical Analysis': 'Technical Analysis',
        'Trading Algorithms': 'Trading Algorithms',
        'Data Analytics': 'Data Analytics',
        'Financial APIs': 'Financial APIs',
        'Cryptocurrency': 'Cryptocurrency',
        'Bot Configuration': 'Bot Configuration',
        'AI/ML': 'AI/ML',
        'MCP': 'MCP',
        'Enterprise': 'Enterprise',
        'Design Tools': 'Design Tools',
      },
      items: {
        '1': {
          title: 'Spexop-UI',
          description: 'Complete React component ecosystem with 60+ components, type-safe design tokens, and WCAG AA+ accessibility. MIT licensed with provider-free architecture and modern development practices.',
        },
        '2': {
          title: 'Spexop Pro',
          description: 'Enterprise design system platform for multiple frameworks with component builder, AI-powered theming, MCP integration, and Spexop Command Centre. Complete design-to-code workflow with premium components and enterprise features.',
        },
        '3': {
          title: 'Argus Eyes Intelligence Platform',
          description: 'Signal Intelligence web application with SIGINT Command Centre featuring real-time threat detection, secure communications, and surveillance dashboard. Developed both the core intelligence platform and the responsive web interface for authorized agencies.',
        },
        '4': {
          title: 'Juno Enterprise Security SDK',
          description: 'Software Development Kit for intelligence and enterprise applications. Features authentication systems, Role-Based Access Control (RBAC), encrypted communications, monitoring and auditing capabilities, and secure vault system for sensitive data management.',
        },
        '5': {
          title: 'IRIS - OSINT Intelligence Plugin',
          description: 'Open Source Intelligence (OSINT) plugin for Juno SDK providing data collection, analysis, and threat assessment capabilities. Features automated social media monitoring, dark web intelligence gathering, and real-time threat correlation for military and intelligence operations.',
        },
        '6': {
          title: 'Interceptor Simulator',
          description: 'IMSI/IMEI Catcher simulation platform for telecommunications interception studies. Features environmental configuration including weather conditions, signal disturbors, interference modeling, temporal variations, and density analysis for interception scenario testing.',
        },
        '7': {
          title: 'Atlas - Defense Industry Platform',
          description: 'Django-based web application for managing defense industry products, companies, contacts, and collaboration. Centralized platform organizing military and defense-related equipment, systems, and services with real-time features, asynchronous processing, and data management capabilities.',
        },
        '8': {
          title: 'UniFeeds University News Crawler',
          description: 'Web crawler system for synchronizing news and announcements from multiple university web pages. Features automated content extraction, duplicate detection, real-time updates, and unified feed aggregation for university communication management.',
        },
        '9': {
          title: 'Gokturk Alphabet Converter',
          description: 'Linguistic application for game developers to transform modern Latin alphabet Turkish text into ancient runic Gökturk alphabet script. Features character mapping, batch text conversion, and integration for creating authentic Turkish gaming experiences with historical authenticity.',
        },
        '10': {
          title: 'OKX-TR Bot Configurator',
          description: 'Python Flask application for automated trading bot configuration and optimization. Features historical data analysis, technical indicator evaluation, market trend assessment, and recommendation engine to suggest optimal bot parameters for cryptocurrency trading strategies.',
        },
      },
    },
    github: {
      title: 'GitHub Activity',
      subtitle: 'Check out my open source contributions and repositories',
      loading: 'Loading GitHub profile...',
      error: 'Failed to load GitHub profile',
      rateLimit: 'GitHub API Rate Limit Exceeded',
      rateLimitDesc: 'GitHub is temporarily limiting requests. Unauthenticated requests are limited to 60 per hour. Please try again later or visit GitHub directly.',
      tryAgain: 'Try Again',
      viewOnGitHub: 'View on GitHub',
      browseOnGitHub: 'Browse on GitHub',
      noRepos: 'No public repositories found.',
      featuredRepos: 'Featured Repositories',
      cached: 'Data cached {hours}h ago • Updates daily',
    },
    contact: {
      title: "Let's Connect",
      subtitle: "I'm available for Full Stack software development projects.",
      emailMe: 'Email Me',
      sendEmail: 'Send Email',
      socialMedia: 'Connect on Social Media',
      cta: "Have a project in mind? I'd be happy to discuss how we can work together.",
    },
    footer: {
      builtWith: 'Built with',
      copyright: 'All rights reserved.',
      tagline: 'Built with modern web standards and best practices.',
    },
    carousel: {
      previous: 'Previous',
      next: 'Next',
      previousSlide: 'Previous slide',
      nextSlide: 'Next slide',
      goToSlide: 'Go to slide',
    },
  },
  tr: {
    nav: {
      about: 'Hakkımda',
      projects: 'Projeler',
      github: 'GitHub',
      contact: 'İletişim',
    },
    hero: {
      greeting: 'Merhaba, Ben',
      title: 'Cüneyt Çakar',
      subtitle: '@olmstedian',
      description: 'Elektronik & Haberleşme Mühendisi | Full Stack Geliştirici',
      description2: 'Sinyal istihbarat sistemleri ve web uygulamaları üzerinde çalışıyorum. Hem donanım hem de yazılım projelerinde çalışmayı seviyorum.',
      viewProjects: 'Projeleri Görüntüle',
      getInTouch: 'İletişime Geç',
    },
    about: {
      title: 'Hakkımda',
      description: 'Hem donanım mühendisliği hem de yazılım geliştirme projelerinde çalışmayı seven bir Elektronik & Haberleşme Mühendisiyim.',
      journey: 'Yolculuğum',
      journeyDesc: 'Farklı sektörlerde ve farklı şirketlerde profesyonel yönetici olarak 20 yıldan fazla çalıştım. Şu anda uluslararası projelerin kurucusu ve ortağıyım, uluslararası şirketlerde hissedarım ve çeşitli projelerde uzaktan ve serbest çalışıyorum.',
      journeyDesc2: 'Elektronik & Haberleşme Mühendisliği geçmişime sahip olarak, sinyal istihbarat sistemleri ve web uygulamaları üzerinde çalışıyorum. Hem donanım hem de yazılım içeren projeler üzerinde çalışmayı faydalı buluyorum, RF devrelerinden Full Stack uygulamalara kadar. Her projede sürekli öğrenmeyi ve becerilerimi geliştirmeyi önemsiyorum, sağlam işler yapmaya ve problemleri etkili şekilde çözmeye odaklanıyorum.',
      expertise: 'Çalışma Alanları',
      skills: 'Teknik Beceriler',
      hardwareDesign: 'Donanım Tasarımı',
      dataSystems: 'Veri Sistemleri',
      webApps: 'Web Uygulamaları',
      infrastructure: 'Altyapı',
      electronics: {
        title: 'Elektronik & Sinyal İşleme',
        description: 'RF devreleri, sinyal istihbarat sistemleri ve gerçek zamanlı DSP çözümleri üzerinde çalışıyorum.',
      },
      backend: {
        title: 'Backend Geliştirme',
        description: 'Modern teknolojiler kullanarak sunucu tarafı uygulamaları ve API\'ler geliştiriyorum.',
      },
      frontend: {
        title: 'Frontend Geliştirme',
        description: 'Modern framework\'ler ve web teknolojileri ile duyarlı kullanıcı arayüzleri geliştiriyorum.',
      },
      devops: {
        title: 'DevOps & Bulut',
        description: 'Modern altyapı ve CI/CD pipeline\'ları ile uygulamaları dağıtıp yönetiyorum.',
      },
    },
    projects: {
      title: 'Öne Çıkan Projeler',
      subtitle: 'Donanım mühendisliği ve Full Stack geliştirme kapsayan son çalışmalarımdan örnekler',
      loading: 'Projeler yükleniyor...',
      error: 'Projeler yüklenemedi',
      empty: 'Şu anda proje bulunmuyor.',
      cached: 'Önbellekteki proje verileri gösteriliyor',
      featured: 'Öne Çıkan',
      confidential: 'GİZLİ',
      myRole: 'Rolüm',
      more: 'daha fazla',
      github: 'GitHub',
      liveDemo: 'Canlı Demo',
      underDevelopment: 'Geliştirme Aşamasında',
      activeDevelopment: 'Aktif Geliştirme',
      classifiedDevelopment: 'Gizli Geliştirme',
      ongoing: 'Devam Ediyor',
      technologies: {
        'React': 'React',
        'TypeScript': 'TypeScript',
        'Design System': 'Tasarım Sistemi',
        'Accessibility': 'Erişilebilirlik',
        'CLI Tools': 'CLI Araçları',
        'JavaScript': 'JavaScript',
        'Python': 'Python',
        'Node.js': 'Node.js',
        'Django': 'Django',
        'PostgreSQL': 'PostgreSQL',
        'Tailwind CSS': 'Tailwind CSS',
        'Vue.js': 'Vue.js',
        'Nest.js': 'Nest.js',
        'Supabase': 'Supabase',
        'Firebase': 'Firebase',
        'AWS': 'AWS',
        'Docker': 'Docker',
        'Linux': 'Linux',
        'CI/CD': 'CI/CD',
        'Kubernetes': 'Kubernetes',
        'RF Design': 'RF Tasarımı',
        'SIGINT': 'SIGINT',
        'DSP': 'DSP',
        'FPGA': 'FPGA',
        'Embedded Systems': 'Gömülü Sistemler',
        'Web Development': 'Web Geliştirme',
        'Command Centre': 'Komuta Merkezi',
        'Real-time Analytics': 'Gerçek Zamanlı Analitik',
        'Secure Communications': 'Güvenli İletişim',
        'Dashboard UI': 'Pano Arayüzü',
        'SDK Development': 'SDK Geliştirme',
        'Military Security': 'Askeri Güvenlik',
        'RBAC': 'RBAC',
        'Encryption': 'Şifreleme',
        'Vault Systems': 'Kasa Sistemleri',
        'Enterprise Auth': 'Kurumsal Kimlik Doğrulama',
        'Monitoring': 'İzleme',
        'Auditing': 'Denetim',
        'OSINT Frameworks': 'OSINT Çerçeveleri',
        'Data Mining': 'Veri Madenciliği',
        'Social Media APIs': 'Sosyal Medya API\'leri',
        'Threat Intelligence': 'Tehdit İstihbaratı',
        'Machine Learning': 'Makine Öğrenmesi',
        'Natural Language Processing': 'Doğal Dil İşleme',
        'Juno SDK': 'Juno SDK',
        'Intelligence Analysis': 'İstihbarat Analizi',
        'IMSI Catcher': 'IMSI Yakalayıcı',
        'IMEI Interception': 'IMEI Dinleme',
        'RF Simulation': 'RF Simülasyonu',
        'Environmental Modeling': 'Çevresel Modelleme',
        'Signal Processing': 'Sinyal İşleme',
        'Research Platform': 'Araştırma Platformu',
        'Telecommunications': 'Telekomünikasyon',
        'Interference Analysis': 'Girişim Analizi',
        'Django Channels': 'Django Channels',
        'Celery': 'Celery',
        'Redis': 'Redis',
        'Bootstrap': 'Bootstrap',
        'WebSocket': 'WebSocket',
        'HTMX': 'HTMX',
        'Web Crawling': 'Web Tarama',
        'Data Synchronization': 'Veri Senkronizasyonu',
        'Content Extraction': 'İçerik Çıkarma',
        'University Systems': 'Üniversite Sistemleri',
        'Feed Aggregation': 'Feed Toplama',
        'Automation': 'Otomasyon',
        'Real-time Updates': 'Gerçek Zamanlı Güncellemeler',
        'News Processing': 'Haber İşleme',
        'Linguistic Programming': 'Dilbilimsel Programlama',
        'Character Mapping': 'Karakter Eşleştirme',
        'Turkish Language': 'Türkçe',
        'Game Development Tools': 'Oyun Geliştirme Araçları',
        'Historical Scripts': 'Tarihsel Yazılar',
        'Text Processing': 'Metin İşleme',
        'Cultural Preservation': 'Kültürel Koruma',
        'Developer SDK': 'Geliştirici SDK',
        'Flask': 'Flask',
        'Technical Analysis': 'Teknik Analiz',
        'Trading Algorithms': 'Ticaret Algoritmaları',
        'Data Analytics': 'Veri Analitiği',
        'Financial APIs': 'Finansal API\'ler',
        'Cryptocurrency': 'Kripto Para',
        'Bot Configuration': 'Bot Yapılandırması',
        'AI/ML': 'AI/ML',
        'MCP': 'MCP',
        'Enterprise': 'Kurumsal',
        'Design Tools': 'Tasarım Araçları',
      },
      items: {
        '1': {
          title: 'Spexop-UI',
          description: '60+ bileşen, tip güvenli tasarım token\'ları ve WCAG AA+ erişilebilirlik özelliklerine sahip eksiksiz React bileşen ekosistemi. Sağlayıcı bağımsız mimari ve modern geliştirme uygulamaları ile MIT lisanslı.',
          technologies: ['React', 'TypeScript', 'Tasarım Sistemi', 'Erişilebilirlik', 'CLI Araçları'],
        },
        '2': {
          title: 'Spexop Pro',
          description: 'Bileşen oluşturucu, AI destekli temalar, MCP entegrasyonu ve Spexop Command Centre ile birden fazla framework için kurumsal tasarım sistemi platformu. Premium bileşenler ve kurumsal özellikler ile tam tasarım-kod iş akışı.',
        },
        '3': {
          title: 'Argus Eyes Intelligence Platform',
          description: 'Gerçek zamanlı tehdit tespiti, güvenli iletişimler ve gözetim panosu içeren SIGINT Command Centre özellikli Sinyal İstihbarat web uygulaması. Yetkili kurumlar için hem çekirdek istihbarat platformunu hem de duyarlı web arayüzünü geliştirdim.',
        },
        '4': {
          title: 'Juno Enterprise Security SDK',
          description: 'İstihbarat ve kurumsal uygulamalar için Yazılım Geliştirme Kiti. Kimlik doğrulama sistemleri, Rol Tabanlı Erişim Kontrolü (RBAC), şifreli iletişimler, izleme ve denetim özellikleri ve hassas veri yönetimi için güvenli kasa sistemi içerir.',
        },
        '5': {
          title: 'IRIS - OSINT Intelligence Plugin',
          description: 'Juno SDK için Açık Kaynak İstihbarat (OSINT) eklentisi, veri toplama, analiz ve tehdit değerlendirme özellikleri sağlar. Askeri ve istihbarat operasyonları için otomatik sosyal medya izleme, karanlık web istihbarat toplama ve gerçek zamanlı tehdit korelasyonu özelliklerine sahiptir.',
        },
        '6': {
          title: 'Interceptor Simulator',
          description: 'Telekomünikasyon dinleme çalışmaları için IMSI/IMEI Catcher simülasyon platformu. Hava koşulları, sinyal bozucular, girişim modelleme, zamansal değişimler ve kapsamlı dinleme senaryo testi için yoğunluk analizi dahil çevresel yapılandırma özelliklerine sahiptir.',
        },
        '7': {
          title: 'Atlas - Defense Industry Platform',
          description: 'Savunma sanayi ürünleri, şirketleri, iletişimleri ve işbirliklerini yönetmek için Django tabanlı web uygulaması. Gerçek zamanlı özellikler, asenkron işleme ve veri yönetim yetenekleri ile askeri ve savunma ile ilgili ekipmanları, sistemleri ve hizmetleri organize eden merkezi platform.',
        },
        '8': {
          title: 'UniFeeds University News Crawler',
          description: 'Birden fazla üniversite web sayfasından haber ve duyuruları senkronize etmek için web tarayıcı sistemi. Otomatik içerik çıkarma, tekrar tespiti, gerçek zamanlı güncellemeler ve üniversite iletişim yönetimi için birleşik feed toplama özelliklerine sahiptir.',
        },
        '9': {
          title: 'Gokturk Alphabet Converter',
          description: 'Oyun geliştiricileri için modern Latin alfabesi Türkçe metnini eski runik Göktürk alfabesi yazısına dönüştürmek için dilbilimsel uygulama. Tarihsel karakter eşleştirme, toplu metin dönüştürme ve tarihsel gerçeklik ile özgün Türk oyun deneyimleri oluşturmak için entegrasyon özelliklerine sahiptir.',
        },
        '10': {
          title: 'OKX-TR Bot Configurator',
          description: 'Otomatik ticaret botu yapılandırması ve optimizasyonu için Python Flask uygulaması. Kripto para ticareti stratejileri için optimal bot parametrelerini önermek için tarihsel veri analizi, teknik gösterge değerlendirmesi, pazar trendi değerlendirmesi ve öneri motoru özelliklerine sahiptir.',
        },
      },
    },
    github: {
      title: 'GitHub Etkinliği',
      subtitle: 'Açık kaynak katkılarımı ve depolarımı inceleyin',
      loading: 'GitHub profili yükleniyor...',
      error: 'GitHub profili yüklenemedi',
      rateLimit: 'GitHub API Oran Limiti Aşıldı',
      rateLimitDesc: 'GitHub geçici olarak istekleri sınırlandırıyor. Kimlik doğrulamasız istekler saatte 60 ile sınırlıdır. Lütfen daha sonra tekrar deneyin veya doğrudan GitHub\'ı ziyaret edin.',
      tryAgain: 'Tekrar Dene',
      viewOnGitHub: 'GitHub\'da Görüntüle',
      browseOnGitHub: 'GitHub\'da Gezin',
      noRepos: 'Halka açık depo bulunamadı.',
      featuredRepos: 'Öne Çıkan Depolar',
      cached: 'Veri {hours} saat önce önbelleğe alındı • Günlük güncellenir',
    },
    contact: {
      title: 'İletişime Geçelim',
      subtitle: 'Full Stack yazılım geliştirme projeleri için müsaitim.',
      emailMe: 'E-posta Gönder',
      sendEmail: 'E-posta Gönder',
      socialMedia: 'Sosyal Medyada Bağlantı Kurun',
      cta: 'Aklınızda bir proje mi var? Birlikte nasıl çalışabileceğimizi konuşmaktan memnuniyet duyarım.',
    },
    footer: {
      builtWith: 'İle geliştirildi',
      copyright: 'Tüm hakları saklıdır.',
      tagline: 'Modern web standartları ve en iyi uygulamalarla geliştirildi.',
    },
    carousel: {
      previous: 'Önceki',
      next: 'Sonraki',
      previousSlide: 'Önceki slayt',
      nextSlide: 'Sonraki slayt',
      goToSlide: 'Slayta git',
    },
  },
}

export function formatTranslation(
  text: string,
  params?: Record<string, string | number>
): string {
  if (!params) return text
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, String(value)),
    text
  )
}

