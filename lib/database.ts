import { supabase, type JobTitle, type WorkGroup, type Department, type ProjectType, type Employee, isSupabaseConfigured } from './supabase';

// Mock data for when Supabase is not configured
const mockJobTitles: JobTitle[] = [
  { id: '1', name: 'Software Engineer', description: 'Develops and maintains software applications', created_at: '2023-01-01T00:00:00Z' },
  { id: '2', name: 'Product Manager', description: 'Manages product development and strategy', created_at: '2023-01-01T00:00:00Z' },
  { id: '3', name: 'UX Designer', description: 'Designs user experiences and interfaces', created_at: '2023-01-01T00:00:00Z' },
  { id: '4', name: 'Data Analyst', description: 'Analyzes data to provide business insights', created_at: '2023-01-01T00:00:00Z' },
];

const mockWorkGroups: WorkGroup[] = [
  { id: '1', name: 'Engineering', description: 'Software development team', created_at: '2023-01-01T00:00:00Z' },
  { id: '2', name: 'Product', description: 'Product management and strategy', created_at: '2023-01-01T00:00:00Z' },
  { id: '3', name: 'Design', description: 'User experience and visual design', created_at: '2023-01-01T00:00:00Z' },
  { id: '4', name: 'Analytics', description: 'Data analysis and business intelligence', created_at: '2023-01-01T00:00:00Z' },
];

const mockDepartments: Department[] = [
  { id: '1', name: 'Technology', description: 'IT and software development', created_at: '2023-01-01T00:00:00Z' },
  { id: '2', name: 'Marketing', description: 'Marketing and communications', created_at: '2023-01-01T00:00:00Z' },
  { id: '3', name: 'Sales', description: 'Sales and business development', created_at: '2023-01-01T00:00:00Z' },
  { id: '4', name: 'Operations', description: 'Operations and administration', created_at: '2023-01-01T00:00:00Z' },
];

const mockProjectTypes: ProjectType[] = [
  { id: '1', name: 'Web Development', description: 'Web application projects', created_at: '2023-01-01T00:00:00Z' },
  { id: '2', name: 'Mobile App', description: 'Mobile application development', created_at: '2023-01-01T00:00:00Z' },
  { id: '3', name: 'Data Analysis', description: 'Data analysis and reporting projects', created_at: '2023-01-01T00:00:00Z' },
  { id: '4', name: 'Marketing Campaign', description: 'Marketing and promotional campaigns', created_at: '2023-01-01T00:00:00Z' },
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0123',
    badge_number: 'EMP001',
    hire_date: '2023-01-15',
    job_title_id: '1',
    work_group_id: '1',
    department_id: '1',
    project_type_id: '1',
    is_active: true,
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1-555-0124',
    badge_number: 'EMP002',
    hire_date: '2023-02-01',
    job_title_id: '2',
    work_group_id: '2',
    department_id: '2',
    project_type_id: '2',
    is_active: true,
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-02-01T00:00:00Z'
  },
  {
    id: '3',
    first_name: 'Mike',
    last_name: 'Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1-555-0125',
    badge_number: 'EMP003',
    hire_date: '2023-03-10',
    job_title_id: '3',
    work_group_id: '3',
    department_id: '3',
    project_type_id: '3',
    is_active: true,
    created_at: '2023-03-10T00:00:00Z',
    updated_at: '2023-03-10T00:00:00Z'
  }
];

// Generic service creator that handles both Supabase and mock data
function createService<T extends { id: string }>(tableName: string, mockData: T[]) {
  return {
    async getAll(): Promise<T[]> {
      if (!isSupabaseConfigured()) {
        console.log(`Using mock data for ${tableName}`);
        return Promise.resolve([...mockData]);
      }

      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          console.error(`Error fetching ${tableName}:`, error);
          console.log(`Falling back to mock data for ${tableName}`);
          return [...mockData];
        }

        return data || [];
      } catch (err) {
        console.error(`Error fetching ${tableName}:`, err);
        console.log(`Falling back to mock data for ${tableName}`);
        return [...mockData];
      }
    },

    async create(item: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
      if (!isSupabaseConfigured()) {
        console.log(`Using mock data for creating ${tableName}`);
        const newItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as unknown as T;
        mockData.push(newItem);
        return Promise.resolve(newItem);
      }

      try {
        const { data, error } = await supabase
          .from(tableName)
          .insert([item])
          .select()
          .single();

        if (error) {
          console.error(`Error creating ${tableName}:`, error);
          throw error;
        }

        return data;
      } catch (err) {
        console.error(`Error creating ${tableName}:`, err);
        throw err;
      }
    },

    async update(id: string, updates: Partial<Omit<T, 'id' | 'created_at'>>): Promise<T> {
      if (!isSupabaseConfigured()) {
        console.log(`Using mock data for updating ${tableName}`);
        const index = mockData.findIndex(item => item.id === id);
        if (index === -1) {
          throw new Error(`${tableName} not found`);
        }
        const updatedItem = {
          ...mockData[index],
          ...updates,
          updated_at: new Date().toISOString()
        } as T;
        mockData[index] = updatedItem;
        return Promise.resolve(updatedItem);
      }

      try {
        const { data, error } = await supabase
          .from(tableName)
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error(`Error updating ${tableName}:`, error);
          throw error;
        }

        return data;
      } catch (err) {
        console.error(`Error updating ${tableName}:`, err);
        throw err;
      }
    },

    async delete(id: string): Promise<void> {
      if (!isSupabaseConfigured()) {
        console.log(`Using mock data for deleting ${tableName}`);
        const index = mockData.findIndex(item => item.id === id);
        if (index === -1) {
          throw new Error(`${tableName} not found`);
        }
        mockData.splice(index, 1);
        return Promise.resolve();
      }

      try {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);

        if (error) {
          console.error(`Error deleting ${tableName}:`, error);
          throw error;
        }
      } catch (err) {
        console.error(`Error deleting ${tableName}:`, err);
        throw err;
      }
    }
  };
}

// Export services
export const jobTitlesService = createService<JobTitle>('job_titles', mockJobTitles);
export const workGroupsService = createService<WorkGroup>('work_groups', mockWorkGroups);
export const departmentsService = createService<Department>('departments', mockDepartments);
export const projectTypesService = createService<ProjectType>('project_types', mockProjectTypes);
export const employeesService = createService<Employee>('employees', mockEmployees);