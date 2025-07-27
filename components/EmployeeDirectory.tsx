'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { employeesService, jobTitlesService, departmentsService, workGroupsService, projectTypesService } from '../lib/database';
import type { Employee, JobTitle, Department, WorkGroup, ProjectType } from '../lib/supabase';

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [workGroups, setWorkGroups] = useState<WorkGroup[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    hire_date: '',
    job_title_id: '',
    department_id: '',
    work_group_id: '',
    project_type_id: '',
    is_active: true
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [employeesData, jobTitlesData, departmentsData, workGroupsData, projectTypesData] = await Promise.all([
        employeesService.getAll(),
        jobTitlesService.getAll(),
        departmentsService.getAll(),
        workGroupsService.getAll(),
        projectTypesService.getAll()
      ]);
      
      setEmployees(employeesData);
      setJobTitles(jobTitlesData);
      setDepartments(departmentsData);
      setWorkGroups(workGroupsData);
      setProjectTypes(projectTypesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Helper functions to get names by ID
  const getJobTitleName = (id: string) => {
    const jobTitle = jobTitles.find(jt => jt.id === id);
    return jobTitle ? jobTitle.name : 'Unknown';
  };

  const getDepartmentName = (id: string) => {
    const department = departments.find(d => d.id === id);
    return department ? department.name : 'Unknown';
  };

  const getWorkGroupName = (id: string) => {
    const workGroup = workGroups.find(wg => wg.id === id);
    return workGroup ? workGroup.name : 'Unknown';
  };

  // Filter employees based on search term and department
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.first_name} ${employee.last_name}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department_id === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddEmployee = async () => {
    if (newEmployee.first_name && newEmployee.last_name && newEmployee.email && newEmployee.job_title_id && 
        newEmployee.department_id && newEmployee.work_group_id && newEmployee.project_type_id && newEmployee.hire_date) {
      try {
        const employee = await employeesService.create({
          first_name: newEmployee.first_name,
          last_name: newEmployee.last_name,
          email: newEmployee.email,
          phone: newEmployee.phone,
          hire_date: newEmployee.hire_date,
          job_title_id: newEmployee.job_title_id,
          department_id: newEmployee.department_id,
          work_group_id: newEmployee.work_group_id,
          project_type_id: newEmployee.project_type_id,
          is_active: newEmployee.is_active
        });
        
        setEmployees([...employees, employee]);
        setNewEmployee({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          hire_date: '',
          job_title_id: '',
          department_id: '',
          work_group_id: '',
          project_type_id: '',
          is_active: true
        });
        setIsAddModalOpen(false);
      } catch (error) {
        console.error('Error adding employee:', error);
      }
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async () => {
    if (editingEmployee) {
      try {
        const updatedEmployee = await employeesService.update(editingEmployee.id, editingEmployee);
        setEmployees(employees.map(emp => emp.id === editingEmployee.id ? updatedEmployee : emp));
        setIsEditModalOpen(false);
        setEditingEmployee(null);
      } catch (error) {
        console.error('Error updating employee:', error);
      }
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await employeesService.delete(id);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
          <p className="text-muted-foreground">
            Manage all employees, their roles, and department assignments
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the employee details below
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newEmployee.first_name}
                    onChange={(e) => setNewEmployee({...newEmployee, first_name: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newEmployee.last_name}
                    onChange={(e) => setNewEmployee({...newEmployee, last_name: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={newEmployee.hire_date}
                  onChange={(e) => setNewEmployee({...newEmployee, hire_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Select value={newEmployee.job_title_id} onValueChange={(value) => setNewEmployee({...newEmployee, job_title_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job title" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles.map((title) => (
                      <SelectItem key={title.id} value={title.id}>{title.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={newEmployee.department_id} onValueChange={(value) => setNewEmployee({...newEmployee, department_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="workGroup">Work Group</Label>
                <Select value={newEmployee.work_group_id} onValueChange={(value) => setNewEmployee({...newEmployee, work_group_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work group" />
                  </SelectTrigger>
                  <SelectContent>
                    {workGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="projectType">Project Type</Label>
                <Select value={newEmployee.project_type_id} onValueChange={(value) => setNewEmployee({...newEmployee, project_type_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddEmployee} className="w-full">
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
          <CardDescription>
            {filteredEmployees.length} of {employees.length} employees shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Work Group</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {employee.first_name[0]}{employee.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.first_name} {employee.last_name}</p>
                        <p className="text-sm text-muted-foreground">{employee.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getJobTitleName(employee.job_title_id)}</TableCell>
                  <TableCell>{getDepartmentName(employee.department_id)}</TableCell>
                  <TableCell>{getWorkGroupName(employee.work_group_id)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditEmployee(employee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteEmployee(employee.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Employee Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee details
            </DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input
                    id="editFirstName"
                    value={editingEmployee.first_name}
                    onChange={(e) => setEditingEmployee({...editingEmployee, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input
                    id="editLastName"
                    value={editingEmployee.last_name}
                    onChange={(e) => setEditingEmployee({...editingEmployee, last_name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({...editingEmployee, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editPhone">Phone</Label>
                <Input
                  id="editPhone"
                  value={editingEmployee.phone}
                  onChange={(e) => setEditingEmployee({...editingEmployee, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editHireDate">Hire Date</Label>
                <Input
                  id="editHireDate"
                  type="date"
                  value={editingEmployee.hire_date}
                  onChange={(e) => setEditingEmployee({...editingEmployee, hire_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editJobTitle">Job Title</Label>
                <Select value={editingEmployee.job_title_id} onValueChange={(value) => setEditingEmployee({...editingEmployee, job_title_id: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles.map((title) => (
                      <SelectItem key={title.id} value={title.id}>{title.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editDepartment">Department</Label>
                <Select value={editingEmployee.department_id} onValueChange={(value) => setEditingEmployee({...editingEmployee, department_id: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editWorkGroup">Work Group</Label>
                <Select value={editingEmployee.work_group_id} onValueChange={(value) => setEditingEmployee({...editingEmployee, work_group_id: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editProjectType">Project Type</Label>
                <Select value={editingEmployee.project_type_id} onValueChange={(value) => setEditingEmployee({...editingEmployee, project_type_id: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateEmployee} className="w-full">
                Update Employee
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}