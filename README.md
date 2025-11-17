# Cüneyt Çakar (@olmstedian) - Portfolio Website

Electronic & Communications Engineer | Full Stack Developer

A modern, responsive portfolio showcasing expertise in both hardware engineering and software development. Features macOS-inspired design with liquid animations and glassmorphism effects.

## 🌟 Features

- **Dual Expertise Showcase**: Hardware engineering and full stack development projects
- **Modern Design System**: Built with Material Design 3 and Apple Human Interface Guidelines
- **macOS-Inspired Interface**: Glassmorphism effects, blur backgrounds, and smooth animations
- **Liquid Animations**: CSS-powered fluid motion effects and micro-interactions
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **GitHub Integration**: Real-time repository and contribution data via GitHub API
- **Performance Optimized**: Lazy loading, efficient animations, and Core Web Vitals optimization
- **Accessibility First**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Progressive Enhancement**: Works across all modern browsers with graceful degradation

## 🚀 Technologies Used

### Electronics & Communications

- **Signal Processing**: DSP, FPGA, Software-Defined Radio
- **RF Engineering**: Circuit design, spectrum analysis, SIGINT
- **Hardware Integration**: Embedded systems, IoT, real-time processing
- **Communication Protocols**: Cellular, wireless, network analysis

### Full Stack Development

- **Frontend**: React, Vue.js, TypeScript, WebGL, modern CSS
- **Backend**: Node.js, Python, Go, C++, microservices
- **Databases**: PostgreSQL, MongoDB, Redis, InfluxDB
- **Cloud & DevOps**: AWS, Docker, Kubernetes, CI/CD pipelines

### Design System

- **Design Tokens**: Centralized design variables for consistency
- **Component Library**: Reusable UI components with variants
- **Typography Scale**: Golden ratio-based font sizing
- **Color System**: Semantic color palette with dark mode support

### Performance & Accessibility

- **Lazy Loading**: Images and content loaded on demand
- **Service Worker**: PWA capabilities for offline functionality
- **Focus Management**: Enhanced keyboard navigation
- **Reduced Motion**: Respects user's motion preferences

## 📁 Project Structure

```bash
portfolio/
├── css/
│   ├── design-tokens.css    # Design system variables
│   ├── reset.css           # Modern CSS reset
│   ├── base.css            # Base typography and layout
│   ├── components.css      # UI component styles
│   ├── animations.css      # Animation definitions
│   └── responsive.css      # Mobile and responsive styles
├── js/
│   ├── utils.js           # Utility functions
│   ├── github-api.js      # GitHub integration
│   ├── animations.js      # Animation controller
│   └── main.js           # Main application logic
├── assets/
│   └── (fonts, images, icons)
├── .github/
│   └── copilot-instructions.md
├── index.html
└── README.md
```

## 🎨 Design System

### Color Palette

- Primary: Blue gradient (#3b82f6 to #1d4ed8)
- Neutral: Grayscale from white to dark gray
- Semantic: Success, warning, error states
- Glass effects with transparency and blur

### Typography

- **Display Font**: SF Pro Display (system fallback)
- **Text Font**: SF Pro Text (system fallback)
- **Monospace**: SF Mono (system fallback)
- **Scale**: Golden ratio-based sizing (1.618)

### Spacing

- **Base Unit**: 8px for consistent spacing
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, etc.

### Animations

- **Duration**: Fast (150ms), Normal (300ms), Slow (500ms)
- **Easing**: Custom cubic-bezier curves for natural motion
- **Liquid Effects**: CSS animations with randomized keyframes

## 🔧 Setup & Installation

### Prerequisites

- Modern web browser (Chrome 80+, Firefox 75+, Safari 13+)
- Local development server (optional)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/cuneytcakar/portfolio.git
   cd portfolio
   ```

2. **Serve locally** (optional)

   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**

   ```bash
   http://localhost:8000
   ```

### Configuration

#### GitHub Integration

Update the username in `js/github-api.js`:

```javascript
const githubAPI = new GitHubAPI('olmstedian');
```

#### Personal Information

Update content in `index.html`:

- Name and title
- About section
- Contact information
- Social media links

## 🎯 Customization

### Design Tokens

Modify `css/design-tokens.css` to customize:

- Colors and themes
- Typography scales
- Spacing values
- Animation timing

### Components

Add new components to `css/components.css`:

```css
.new-component {
  /* Component styles using design tokens */
  background: var(--color-background-glass);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
}
```

### Animations (Optional)

Create custom animations in `css/animations.css`:

```css
@keyframes customAnimation {
  0% { transform: translateY(0); }
  100% { transform: translateY(-10px); }
}
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

### Features

- Fluid typography with `clamp()`
- Responsive images with `object-fit`
- Touch-friendly interface elements
- Mobile-first CSS approach

## ⚡ Performance

### Optimization Techniques

- **Critical CSS**: Inlined essential styles
- **Lazy Loading**: Images and non-critical content
- **Code Splitting**: Modular JavaScript architecture
- **Caching**: Local storage for API responses
- **Compression**: Optimized assets and code

### Core Web Vitals

- **LCP**: Optimized with image preloading
- **FID**: Minimal JavaScript blocking
- **CLS**: Stable layout with proper sizing

## ♿ Accessibility

### Features (Optional)

- **ARIA Labels**: Comprehensive labeling
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML structure
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant
- **Reduced Motion**: Respects user preferences

### Testing

- **axe DevTools**: Automated accessibility testing
- **Keyboard Navigation**: Manual testing
- **Screen Reader**: VoiceOver/NVDA testing

## 🌙 Dark Mode

Automatic detection based on system preferences:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background-primary: var(--color-neutral-900);
  }
}
```

## 📊 Analytics & Monitoring

### Performance Monitoring

```javascript
// Core Web Vitals tracking
Performance.mark('portfolio-loaded');
Performance.measure('load-time', 'navigationStart', 'portfolio-loaded');
```

### Error Tracking

```javascript
window.addEventListener('error', (e) => {
  console.error('Portfolio error:', e.error);
});
```

## 🚀 Deployment

### Static Hosting

Deploy to any static hosting service:

- **Netlify**: Drag and drop deployment
- **Vercel**: GitHub integration
- **GitHub Pages**: Built-in hosting
- **Firebase Hosting**: Google's CDN

### Build Process

No build process required - pure HTML/CSS/JS:

1. Update content and configuration
2. Test across browsers
3. Deploy to hosting service

## 📄 License

MIT License - feel free to use this project as a template for your own portfolio.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across browsers
5. Submit a pull request

## 📞 Contact

- **Website**: [ccakar.com](https://spexop.com)
- **Email**: ccakar [at] spexop [dot] com
- **GitHub**: [@ccakar](https://github.com/olmstedian)

## Acknowledgments

This project is hosted on [GitHub Pages](https://pages.github.com/). Thanks to GitHub for providing free static site hosting through GitHub Pages.

---

Built with ❤️ using modern web technologies and design systems.
