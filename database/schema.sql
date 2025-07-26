-- Supabase Database Schema for Company Dashboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Job Titles Table
CREATE TABLE job_titles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Groups Table
CREATE TABLE work_groups (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments Table
CREATE TABLE departments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Types Table
CREATE TABLE project_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employees Table
CREATE TABLE employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    job_title_id UUID REFERENCES job_titles(id) ON DELETE SET NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    work_group_id UUID REFERENCES work_groups(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_employees_job_title ON employees(job_title_id);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_work_group ON employees(work_group_id);
CREATE INDEX idx_employees_email ON employees(email);

-- Insert sample data
INSERT INTO job_titles (name, description) VALUES
    ('Senior Software Engineer', 'Experienced software developer with 5+ years experience'),
    ('Frontend Developer', 'Specializes in user interface development'),
    ('Site Supervisor', 'Oversees construction site operations'),
    ('HR Manager', 'Manages human resources and employee relations'),
    ('Project Manager', 'Coordinates and manages project execution');

INSERT INTO work_groups (name, description) VALUES
    ('Development Team', 'Software development and engineering'),
    ('Construction Crew', 'On-site construction workers'),
    ('Management', 'Executive and management staff'),
    ('Support Staff', 'Administrative and support personnel');

INSERT INTO departments (name, description) VALUES
    ('Engineering', 'Software and technical development'),
    ('Construction', 'Building and construction operations'),
    ('Human Resources', 'Employee management and relations'),
    ('Operations', 'Day-to-day business operations'),
    ('Finance', 'Financial planning and accounting');

INSERT INTO project_types (name, description) VALUES
    ('Web Development', 'Website and web application projects'),
    ('Mobile App', 'iOS and Android mobile applications'),
    ('Residential Construction', 'House and apartment building projects'),
    ('Commercial Construction', 'Office and retail building projects'),
    ('Infrastructure', 'Roads, bridges, and utility projects');

-- Enable Row Level Security (RLS)
ALTER TABLE job_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for authenticated users" ON job_titles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON job_titles
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON work_groups
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON work_groups
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON departments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON departments
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON project_types
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON project_types
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON employees
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all operations for authenticated users" ON employees
    FOR ALL USING (auth.role() = 'authenticated');