// Supabase Configuration
const SUPABASE_URL = 'https://iraexyvraqmzqzglopph.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWV4eXZyYXFtenF6Z2xvcHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTE5NDAsImV4cCI6MjA3ODk2Nzk0MH0.Q5UUnvlOwEYUIAB3J6CQHb2Meg7htnX_BS4J7RqwEXQ';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database schema for projects table:
/*
CREATE TABLE projects (
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

-- Trigger to auto-update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
*/

