import { supabase } from './supabase'
import type { JobTitle, WorkGroup, Department, ProjectType } from './supabase'

// Job Titles Service
export const jobTitlesService = {
  async getAll(): Promise<JobTitle[]> {
    const { data, error } = await supabase
      .from('job_titles')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(jobTitle: Omit<JobTitle, 'id' | 'created_at' | 'updated_at'>): Promise<JobTitle> {
    const { data, error } = await supabase
      .from('job_titles')
      .insert([jobTitle])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Omit<JobTitle, 'id' | 'created_at' | 'updated_at'>>): Promise<JobTitle> {
    const { data, error } = await supabase
      .from('job_titles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('job_titles')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Work Groups Service
export const workGroupsService = {
  async getAll(): Promise<WorkGroup[]> {
    const { data, error } = await supabase
      .from('work_groups')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(workGroup: Omit<WorkGroup, 'id' | 'created_at' | 'updated_at'>): Promise<WorkGroup> {
    const { data, error } = await supabase
      .from('work_groups')
      .insert([workGroup])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Omit<WorkGroup, 'id' | 'created_at' | 'updated_at'>>): Promise<WorkGroup> {
    const { data, error } = await supabase
      .from('work_groups')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('work_groups')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Departments Service
export const departmentsService = {
  async getAll(): Promise<Department[]> {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .insert([department])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Omit<Department, 'id' | 'created_at' | 'updated_at'>>): Promise<Department> {
    const { data, error } = await supabase
      .from('departments')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Project Types Service
export const projectTypesService = {
  async getAll(): Promise<ProjectType[]> {
    const { data, error } = await supabase
      .from('project_types')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(projectType: Omit<ProjectType, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectType> {
    const { data, error } = await supabase
      .from('project_types')
      .insert([projectType])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Omit<ProjectType, 'id' | 'created_at' | 'updated_at'>>): Promise<ProjectType> {
    const { data, error } = await supabase
      .from('project_types')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('project_types')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}