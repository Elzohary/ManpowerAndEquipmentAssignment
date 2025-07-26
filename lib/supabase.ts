import { createClient } from '@supabase/supabase-js'

// These will be your Supabase project credentials
// You'll get these from your Supabase dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

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
  name: string
  email: string
  job_title_id: string
  department_id: string
  work_group_id: string
  created_at: string
  updated_at?: string
}