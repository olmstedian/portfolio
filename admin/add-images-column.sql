-- Migration: Add images column to projects table
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/iraexyvraqmzqzglopph/sql

-- Add images column as TEXT[] (array of text) to store multiple image URLs
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Update Spexop-UI project with additional images
-- Images are hosted in the frontend/public/images/projects/ folder
-- For GitHub Pages (production): https://olmstedian.github.io/portfolio/images/projects/
-- For local development: /images/projects/
UPDATE projects 
SET images = ARRAY[
  'https://olmstedian.github.io/portfolio/images/projects/spexop-homepage.png' -- Homepage
]
WHERE title = 'Spexop-UI';

-- Verify the update
SELECT 
  id,
  title,
  image,
  images,
  display_order
FROM projects
WHERE title = 'Spexop-UI';

