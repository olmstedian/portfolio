import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iraexyvraqmzqzglopph.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyYWV4eXZyYXFtenF6Z2xvcHBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTE5NDAsImV4cCI6MjA3ODk2Nzk0MH0.Q5UUnvlOwEYUIAB3J6CQHb2Meg7htnX_BS4J7RqwEXQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Project {
  id: string
  title: string
  description: string
  image: string
  images?: string[] // Optional array of additional images for carousel
  technologies: string[]
  roles?: string[]
  github?: string | null
  demo?: string | null
  featured: boolean
  confidential: boolean
  macos_window: boolean
  classification?: string | null
  development_status?: string | null
  development_timeline?: string | null
  display_order: number
  active: boolean
  created_at?: string
  updated_at?: string
}

