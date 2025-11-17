-- SQL Commands for Deleting Items from Supabase PostgreSQL Database
-- Run these SQL commands in your Supabase SQL Editor: https://supabase.com/dashboard/project/iraexyvraqmzqzglopph/sql

-- ============================================================================
-- 1. UPDATE IMAGES ARRAY - Remove specific images from a project
-- ============================================================================

-- Update Spexop-UI to have only the homepage image (remove builder and docs)
UPDATE projects 
SET images = ARRAY[
  'https://olmstedian.github.io/portfolio/images/projects/spexop-homepage.png'
]
WHERE title = 'Spexop-UI';

-- Alternative: Remove specific image from array using array_remove
-- This removes a specific image URL from the images array
UPDATE projects 
SET images = array_remove(images, 'https://olmstedian.github.io/portfolio/images/projects/spexop-builder.png')
WHERE title = 'Spexop-UI';

UPDATE projects 
SET images = array_remove(images, 'https://olmstedian.github.io/portfolio/images/projects/spexop-docs.png')
WHERE title = 'Spexop-UI';

-- ============================================================================
-- 2. DELETE ENTIRE PROJECT ROWS
-- ============================================================================

-- Delete a specific project by title
DELETE FROM projects 
WHERE title = 'Project Name Here';

-- Delete a project by ID
DELETE FROM projects 
WHERE id = 'your-uuid-here';

-- Delete multiple projects by title
DELETE FROM projects 
WHERE title IN ('Project 1', 'Project 2', 'Project 3');

-- Delete projects matching a condition
DELETE FROM projects 
WHERE featured = false AND active = false;

-- ============================================================================
-- 3. DELETE ITEMS FROM ARRAYS (technologies, roles, etc.)
-- ============================================================================

-- Remove a specific technology from all projects
UPDATE projects 
SET technologies = array_remove(technologies, 'Technology Name')
WHERE 'Technology Name' = ANY(technologies);

-- Remove a specific role from all projects
UPDATE projects 
SET roles = array_remove(roles, 'Role Name')
WHERE 'Role Name' = ANY(roles);

-- Remove multiple items from an array
UPDATE projects 
SET technologies = array_remove(
  array_remove(technologies, 'Tech 1'), 
  'Tech 2'
)
WHERE title = 'Project Name';

-- ============================================================================
-- 4. CLEAR ARRAYS (set to empty)
-- ============================================================================

-- Clear images array for a project
UPDATE projects 
SET images = '{}'
WHERE title = 'Spexop-UI';

-- Clear technologies array
UPDATE projects 
SET technologies = '{}'
WHERE title = 'Project Name';

-- ============================================================================
-- 5. VERIFICATION QUERIES (check before deleting)
-- ============================================================================

-- View all projects with their images
SELECT 
  id,
  title,
  image,
  images,
  array_length(images, 1) as image_count
FROM projects
ORDER BY display_order;

-- View specific project details
SELECT 
  id,
  title,
  image,
  images,
  technologies,
  roles
FROM projects
WHERE title = 'Spexop-UI';

-- Count items in arrays
SELECT 
  title,
  array_length(images, 1) as image_count,
  array_length(technologies, 1) as tech_count,
  array_length(roles, 1) as role_count
FROM projects;

-- ============================================================================
-- 6. SAFE DELETE WITH BACKUP (recommended approach)
-- ============================================================================

-- Step 1: Create a backup of data you want to delete
CREATE TABLE projects_backup AS 
SELECT * FROM projects WHERE title = 'Project Name';

-- Step 2: Verify backup
SELECT * FROM projects_backup;

-- Step 3: Delete from original table
DELETE FROM projects WHERE title = 'Project Name';

-- Step 4: If you need to restore:
-- INSERT INTO projects SELECT * FROM projects_backup;

-- ============================================================================
-- 7. BULK OPERATIONS
-- ============================================================================

-- Delete all inactive projects
DELETE FROM projects 
WHERE active = false;

-- Delete projects older than a certain date
DELETE FROM projects 
WHERE created_at < '2024-01-01'::timestamp;

-- Update all projects to remove a specific image
UPDATE projects 
SET images = array_remove(images, 'https://example.com/image.png')
WHERE 'https://example.com/image.png' = ANY(images);

