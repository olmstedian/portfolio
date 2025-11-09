# Assets Directory

This directory contains static assets for the portfolio website.

## Structure

```
assets/
├── fonts/          # Custom web fonts (SF Pro family)
├── images/         # Profile photos, project screenshots
├── icons/          # Favicon, app icons
└── documents/      # Resume, CV files
```

## Font Files
- Place SF Pro Display and SF Pro Text font files here
- Formats: WOFF2, WOFF for optimal loading
- Include font-display: swap for performance

## Images
- Use WebP format for modern browsers
- Include fallback formats (JPG, PNG)
- Optimize with tools like Squoosh or ImageOptim
- Recommended sizes:
  - Profile photo: 400x400px
  - Project screenshots: 800x600px
  - Hero background: 1920x1080px

## Icons
- favicon.ico (32x32px)
- apple-touch-icon.png (180x180px)
- PWA icons (multiple sizes)

## Performance Tips
- Use `loading="lazy"` for non-critical images
- Implement responsive images with `srcset`
- Preload critical assets in HTML head
- Consider using a CDN for asset delivery