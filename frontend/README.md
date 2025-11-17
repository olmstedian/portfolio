# Portfolio Frontend - Modern React App with shadcn/ui

Modern portfolio frontend built with React, TypeScript, Vite, and shadcn/ui components.

## Features

- ⚡ **Vite** - Lightning fast build tool
- ⚛️ **React 19** - Latest React with TypeScript
- 🎨 **shadcn/ui** - Beautiful, accessible components
- 🎭 **Tailwind CSS** - Utility-first CSS framework
- 🔄 **Supabase Integration** - Real-time project data
- 🎠 **Carousel** - Smooth project navigation
- 📱 **Responsive** - Mobile-first design
- 🌙 **Dark Mode Ready** - Built-in dark mode support

## Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```bash
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── carousel.tsx
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ProjectCarousel.tsx
│   │   └── ProjectCard.tsx
│   ├── lib/
│   │   ├── utils.ts         # Utility functions
│   │   └── supabase.ts      # Supabase client
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Configuration

### Supabase

Supabase credentials are configured in `src/lib/supabase.ts`. The app automatically fetches projects from your Supabase database.

### Components

All UI components follow shadcn/ui patterns:

- Customizable via Tailwind CSS
- Fully typed with TypeScript
- Accessible by default

## Features Implemented

### Navigation

- Sticky navigation bar
- Smooth scroll to sections
- Mobile-responsive menu

### Hero Section

- Animated background blobs
- Gradient text effects
- Call-to-action buttons

### Projects Section

- Carousel/slider navigation
- Touch/swipe support
- Keyboard navigation
- Project cards with:
  - macOS window styling
  - Badges and labels
  - Technology tags
  - Role indicators
  - GitHub/Demo links

### About Section

- Skills showcase
- Card-based layout

### Contact Section

- Social media links
- Email contact

## Adding More Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Available components: <https://ui.shadcn.com/docs/components>

## Styling

The app uses Tailwind CSS with custom design tokens:

- Colors are defined in `src/index.css`
- Components use Tailwind utility classes
- Responsive design with mobile-first approach

## Supabase Integration

The app fetches projects from Supabase:

- Automatically loads active projects
- Displays them in a carousel
- Supports all project fields (badges, roles, technologies, etc.)

## Development Tips

1. **Component Development**: All components are in `src/components/`
2. **Styling**: Use Tailwind classes, custom utilities in `utils.ts`
3. **TypeScript**: Fully typed, leverage TypeScript for better DX
4. **State Management**: Currently using React hooks, can add Zustand/Redux if needed

## Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Setup on GitHub Actions

1. **Configure Repository Name**

   Update the `base` path in `vite.config.ts` to match your repository name:

   ```typescript
   base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
   ```

2. **Enable GitHub Pages**

   - Go to your repository settings on GitHub
   - Navigate to **Pages** in the left sidebar
   - Under **Source**, select **GitHub Actions**
   - Save the settings

3. **Automatic Deployment**

   The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:
   - Build the application when you push to the `main` branch
   - Deploy to GitHub Pages
   - Make the site available at `https://your-username.github.io/your-repo-name/`

#### Manual Deployment

To deploy manually:

```bash
cd frontend
npm run build
```

The built files will be in the `dist` directory. You can then deploy this directory to any static hosting service.

#### Other Hosting Options

- **Vercel**: Automatic deployments from Git
- **Netlify**: Drag & drop or Git integration
- **Cloudflare Pages**: Fast edge deployment

Build command: `npm run build`
Output directory: `dist`

## Acknowledgments

This project is hosted on [GitHub Pages](https://pages.github.com/). Thanks to GitHub for providing free static site hosting through GitHub Pages.
