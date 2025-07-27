import { createClient } from '@supabase/supabase-js'

// These will be your Supabase project credentials
// You'll get these from your Supabase dashboard
const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have valid Supabase credentials
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return url.includes('supabase.co') && !url.includes('placeholder')
  } catch {
    return false
  }
}

const isValidKey = (key: string) => {
  return key && key.length > 20 && !key.includes('placeholder') && !key.includes('your-supabase')
}

// Use valid credentials or fallback to mock values
const supabaseUrl = (envUrl && isValidUrl(envUrl)) ? envUrl : 'https://mock.supabase.co'
const supabaseAnonKey = (envKey && isValidKey(envKey)) ? envKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vY2siLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NjA2NzI2MCwiZXhwIjoxOTYxNjQzMjYwfQ.mock-key-for-development'

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return envUrl && envKey && isValidUrl(envUrl) && isValidKey(envKey)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface JobTitle {
  id: string
  name: string
  description: string
  created_at: string
  updated_at?: string
}

export interface WorkGroup {
  id: string
  name: string
  description: string
  created_at: string
  updated_at?: string
}

export interface Department {
  id: string
  name: string
  description: string
  created_at: string
  updated_at?: string
}

export interface ProjectType {
  id: string
  name: string
  description: string
  created_at: string
  updated_at?: string
}

export interface Employee {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  badge_number?: string
  hire_date: string
  job_title_id: string
  department_id: string
  work_group_id: string
  project_type_id: string
  is_active: boolean
  created_at: string
  updated_at?: string
}