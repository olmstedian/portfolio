-- Supabase Database Setup for Portfolio Projects
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/iraexyvraqmzqzglopph/sql

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  github TEXT,
  demo TEXT,
  featured BOOLEAN DEFAULT false,
  confidential BOOLEAN DEFAULT false,
  macos_window BOOLEAN DEFAULT false,
  classification TEXT,
  development_status TEXT,
  development_timeline TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON projects;

-- Policy: Allow anyone to read active projects
CREATE POLICY "Anyone can view active projects"
  ON projects FOR SELECT
  USING (active = true);

-- Policy: Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can manage projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(active);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);

