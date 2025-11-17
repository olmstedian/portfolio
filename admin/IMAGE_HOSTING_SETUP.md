# Image Hosting Setup Guide

## Overview

Images are now set up for hosting via GitHub Pages. The Spexop Design System screenshots are stored in the repository and will be deployed automatically with your portfolio.

## Image Structure

```
frontend/public/images/projects/
├── spexop-builder.png      # Spexop Builder interface
├── spexop-docs.png         # Documentation page
├── spexop-homepage.png     # Homepage
└── README.md               # Image documentation
```

## How It Works

1. **Storage**: Images are stored in `frontend/public/images/projects/`
2. **Build**: Vite automatically copies files from `public/` to `dist/` during build
3. **Deployment**: GitHub Actions workflow deploys `dist/` to GitHub Pages
4. **URLs**: Images are accessible at:
   - Production: `https://olmstedian.github.io/portfolio/images/projects/your-image.png`
   - Local dev: `/images/projects/your-image.png` (Vite handles base path automatically)

## Next Steps

### 1. Commit the Images

```bash
git add frontend/public/images/
git commit -m "Add Spexop Design System project images"
git push
```

### 2. Run Database Migration

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/iraexyvraqmzqzglopph/sql)
2. Copy and run the SQL from `admin/add-images-column.sql`
3. This will:
   - Add the `images` column to the projects table
   - Update the Spexop-UI project with the image URLs

### 3. Verify Deployment

After the GitHub Actions workflow completes:
1. Visit: https://olmstedian.github.io/portfolio/images/projects/spexop-builder.png
2. Verify the image loads correctly
3. Check your portfolio - the Spexop-UI project should show a carousel with all 3 images

## Image URLs

The following URLs are configured in the database migration:

- Spexop Builder: `https://olmstedian.github.io/portfolio/images/projects/spexop-builder.png`
- Documentation: `https://olmstedian.github.io/portfolio/images/projects/spexop-docs.png`
- Homepage: `https://olmstedian.github.io/portfolio/images/projects/spexop-homepage.png`

## Adding More Images

To add images for other projects:

1. **Place images** in `frontend/public/images/projects/`
2. **Update database** with SQL:
   ```sql
   UPDATE projects 
   SET images = ARRAY[
     'https://olmstedian.github.io/portfolio/images/projects/your-image-1.png',
     'https://olmstedian.github.io/portfolio/images/projects/your-image-2.png'
   ]
   WHERE title = 'Your Project Title';
   ```
3. **Commit and push** - images will deploy automatically

## Image Optimization Tips

Before committing large images, consider optimizing:

- **Format**: Use WebP for better compression (with PNG fallback)
- **Size**: Resize to max 1920px width for screenshots
- **Compression**: Use tools like:
  - ImageOptim (macOS)
  - Squoosh (web)
  - TinyPNG (web)

Current image sizes:
- spexop-builder.png: ~600 KB
- spexop-docs.png: ~230 KB
- spexop-homepage.png: ~150 KB

## Troubleshooting

### Images not showing after deployment

1. Check image URLs are correct (with `/portfolio/` base path)
2. Verify images exist in `dist/images/projects/` after build
3. Check browser console for 404 errors
4. Ensure GitHub Actions workflow completed successfully

### Images not showing locally

1. Make sure you're running `npm run dev` from `frontend/` directory
2. Check that images exist in `frontend/public/images/projects/`
3. Vite serves public files automatically - no configuration needed

### Database update not working

1. Verify you're authenticated in Supabase
2. Check RLS policies allow updates
3. Verify the project title matches exactly: `'Spexop-UI'`

## Alternative: Using Supabase Storage

If you prefer to use Supabase Storage instead of GitHub Pages:

1. Create a storage bucket in Supabase
2. Upload images to the bucket
3. Get public URLs from Supabase Storage
4. Update the `images` column with Supabase Storage URLs

This approach separates image hosting from code deployment but requires additional setup.

