import { supabase } from './supabase';
import type { JobTitle, WorkGroup, Department, ProjectType } from './supabase';

// Helper function to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && 
         import.meta.env.VITE_SUPABASE_ANON_KEY &&
         import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';
};

// Mock data for when Supabase isn't configured
const mockJobTitles: JobTitle[] = [
  { id: '1', name: 'Senior Software Engineer', description: 'Experienced software developer with 5+ years experience', created_at: new Date().toISOString() },
  { id: '2', name: 'Frontend Developer', description: 'Specializes in user interface development', created_at: new Date().toISOString() },
  { id: '3', name: 'Site Supervisor', description: 'Oversees construction and field operations', created_at: new Date().toISOString() }
];

const mockWorkGroups: WorkGroup[] = [
  { id: '1', name: 'Engineering', description: 'Software development and technical roles', created_at: new Date().toISOString() },
  { id: '2', name: 'Operations', description: 'Field operations and project management', created_at: new Date().toISOString() },
  { id: '3', name: 'Administration', description: 'Administrative and support functions', created_at: new Date().toISOString() }
];

const mockDepartments: Department[] = [
  { id: '1', name: 'Engineering', description: 'Software development and technical operations', created_at: new Date().toISOString() },
  { id: '2', name: 'HR', description: 'Human resources and employee management', created_at: new Date().toISOString() },
  { id: '3', name: 'Operations', description: 'Field operations and project management', created_at: new Date().toISOString() }
];

const mockProjectTypes: ProjectType[] = [
  { id: '1', name: 'Web Development', description: 'Website and web application projects', created_at: new Date().toISOString() },
  { id: '2', name: 'Mobile Development', description: 'Mobile application projects', created_at: new Date().toISOString() },
  { id: '3', name: 'Infrastructure', description: 'System and infrastructure projects', created_at: new Date().toISOString() }
];

// Job Titles Service
export const jobTitlesService = {
  async getAll(): Promise<JobTitle[]> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock data');
      return mockJobTitles;
    }
    
    const { data, error } = await supabase
      .from('job_titles')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(jobTitle: Omit<JobTitle, 'id' | 'created_at' | 'updated_at'>): Promise<JobTitle> {
    if (!isSupabaseConfigured()) {
      const newItem = { 
        ...jobTitle, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString() 
      };
      mockJobTitles.unshift(newItem);
      return newItem;
    }
    
    const { data, error } = await supabase
      .from('job_titles')
      .insert([jobTitle])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Omit<JobTitle, 'id' | 'created_at' | 'updated_at'>>): Promise<JobTitle> {
    if (!isSupabaseConfigured()) {
      const index = mockJobTitles.findIndex(item => item.id === id);
      if (index !== -1) {
        mockJobTitles[index] = { ...mockJobTitles[index], ...updates };
        return mockJobTitles[index];
      }
      throw new Error('Job title not found');
    }
    
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
    if (!isSupabaseConfigured()) {
      const index = mockJobTitles.findIndex(item => item.id === id);
      if (index !== -1) {
        mockJobTitles.splice(index, 1);
      }
      return;
    }
    
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
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock data');
      return mockWorkGroups;
    }
    
    const { data, error } = await supabase
      .from('work_groups')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(workGroup: Omit<WorkGroup, 'id' | 'created_at' | 'updated_at'>): Promise<WorkGroup> {
    if (!isSupabaseConfigured()) {
      const newItem = { 
        ...workGroup, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString() 
      };
      mockWorkGroups.unshift(newItem);
      return newItem;
    }
    
    const { data, error } = await supabase
      .from('work_groups')
      .insert([workGroup])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Omit<WorkGroup, 'id' | 'created_at' | 'updated_at'>>): Promise<WorkGroup> {
    if (!isSupabaseConfigured()) {
      const index = mockWorkGroups.findIndex(item => item.id === id);
      if (index !== -1) {
        mockWorkGroups[index] = { ...mockWorkGroups[index], ...updates };
        return mockWorkGroups[index];
      }
      throw new Error('Work group not found');
    }
    
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
    if (!isSupabaseConfigured()) {
      const index = mockWorkGroups.findIndex(item => item.id === id);
      if (index !== -1) {
        mockWorkGroups.splice(index, 1);
      }
      return;
    }
    
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
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock data');
      return mockDepartments;
    }
    
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(department: Omit<Department, 'id' | 'created_at' | 'updated_at'>): Promise<Department> {
    if (!isSupabaseConfigured()) {
      const newItem = { 
        ...department, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString() 
      };
      mockDepartments.unshift(newItem);
      return newItem;
    }
    
    const { data, error } = await supabase
      .from('departments')
      .insert([department])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Omit<Department, 'id' | 'created_at' | 'updated_at'>>): Promise<Department> {
    if (!isSupabaseConfigured()) {
      const index = mockDepartments.findIndex(item => item.id === id);
      if (index !== -1) {
        mockDepartments[index] = { ...mockDepartments[index], ...updates };
        return mockDepartments[index];
      }
      throw new Error('Department not found');
    }
    
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
    if (!isSupabaseConfigured()) {
      const index = mockDepartments.findIndex(item => item.id === id);
      if (index !== -1) {
        mockDepartments.splice(index, 1);
      }
      return;
    }
    
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
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using mock data');
      return mockProjectTypes;
    }
    
    const { data, error } = await supabase
      .from('project_types')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data || []
  },

  async create(projectType: Omit<ProjectType, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectType> {
    if (!isSupabaseConfigured()) {
      const newItem = { 
        ...projectType, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString() 
      };
      mockProjectTypes.unshift(newItem);
      return newItem;
    }
    
    const { data, error } = await supabase
      .from('project_types')
      .insert([projectType])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Omit<ProjectType, 'id' | 'created_at' | 'updated_at'>>): Promise<ProjectType> {
    if (!isSupabaseConfigured()) {
      const index = mockProjectTypes.findIndex(item => item.id === id);
      if (index !== -1) {
        mockProjectTypes[index] = { ...mockProjectTypes[index], ...updates };
        return mockProjectTypes[index];
      }
      throw new Error('Project type not found');
    }
    
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
    if (!isSupabaseConfigured()) {
      const index = mockProjectTypes.findIndex(item => item.id === id);
      if (index !== -1) {
        mockProjectTypes.splice(index, 1);
      }
      return;
    }
    
    const { error } = await supabase
      .from('project_types')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}