import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserPlus, Search, Edit, Trash2, Filter, Wrench, Plus } from 'lucide-react';

// Mock data with equipment assignments
const mockEmployees = [
  {
    id: 1,
    badgeNumber: 'EMP001',
    name: 'John Smith',
    jobTitle: 'Senior Software Engineer',
    salary: 75000,
    project: 'Project Alpha',
    department: 'Engineering',
    status: 'Active',
    equipment: ['Laptop Dell XPS 15', 'iPad Pro']
  },
  {
    id: 2,
    badgeNumber: 'EMP002',
    name: 'Jane Doe',
    jobTitle: 'Frontend Developer',
    salary: 65000,
    project: 'Project Alpha',
    department: 'Engineering',
    status: 'Active',
    equipment: ['Laptop MacBook Pro']
  },
  {
    id: 3,
    badgeNumber: 'EMP003',
    name: 'Mike Johnson',
    jobTitle: 'Site Supervisor',
    salary: 55000,
    project: 'Project Beta',
    department: 'Operations',
    status: 'Active',
    equipment: ['Safety Helmet', 'Measuring Tape', 'Radio Communicator']
  },
  {
    id: 4,
    badgeNumber: 'HR001',
    name: 'Sarah Wilson',
    jobTitle: 'HR Manager',
    salary: 70000,
    project: 'Office Work',
    department: 'HR',
    status: 'Active',
    equipment: []
  },
  {
    id: 5,
    badgeNumber: 'ENG003',
    name: 'Robert Kim',
    jobTitle: 'QA Engineer',
    salary: 60000,
    project: 'Project Beta',
    department: 'Engineering',
    status: 'On Leave',
    equipment: ['Testing Device Kit']
  }
];

const mockDepartments = ['Engineering', 'HR', 'Operations', 'Admin', 'Accounting'];
const mockProjects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Office Work'];
const mockJobTitles = ['Senior Software Engineer', 'Frontend Developer', 'Site Supervisor', 'HR Manager', 'QA Engineer'];
const mockEquipment = [
  'Laptop Dell XPS 15',
  'Laptop MacBook Pro',
  'iPad Pro',
  'Safety Helmet',
  'Measuring Tape',
  'Radio Communicator',
  'Testing Device Kit',
  'Drill Machine',
  'Phone'
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'On Leave':
      return 'secondary';
    case 'Absent':
      return 'destructive';
    default:
      return 'default';
  }
};

export function EmployeeDirectory() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [newEmployee, setNewEmployee] = useState({
    badgeNumber: '',
    name: '',
    jobTitle: '',
    salary: '',
    project: '',
    department: '',
    status: 'Active',
    equipment: [] as string[]
  });

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEmployee = () => {
    const employee = {
      ...newEmployee,
      id: Math.max(...employees.map(e => e.id)) + 1,
      salary: parseInt(newEmployee.salary) || 0
    };
    setEmployees([...employees, employee]);
    setNewEmployee({
      badgeNumber: '',
      name: '',
      jobTitle: '',
      salary: '',
      project: '',
      department: '',
      status: 'Active',
      equipment: []
    });
    setIsAddModalOpen(false);
  };

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee({ ...employee });
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = () => {
    setEmployees(employees.map(emp => 
      emp.id === editingEmployee.id ? editingEmployee : emp
    ));
    setIsEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleEquipmentToggle = (equipment: string, isEdit = false) => {
    const target = isEdit ? editingEmployee : newEmployee;
    const setter = isEdit ? setEditingEmployee : setNewEmployee;
    
    if (target.equipment.includes(equipment)) {
      setter({ ...target, equipment: target.equipment.filter((e: string) => e !== equipment) });
    } else {
      setter({ ...target, equipment: [...target.equipment, equipment] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Employee Directory</h1>
          <p className="text-muted-foreground">
            Manage all employee information, assignments, and equipment
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the details for the new employee
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="badgeNumber">Badge Number</Label>
                <Input
                  id="badgeNumber"
                  value={newEmployee.badgeNumber}
                  onChange={(e) => setNewEmployee({...newEmployee, badgeNumber: e.target.value})}
                  placeholder="EMP001"
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Select value={newEmployee.jobTitle} onValueChange={(value) => setNewEmployee({...newEmployee, jobTitle: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job title" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockJobTitles.map((title) => (
                      <SelectItem key={title} value={title}>{title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={newEmployee.department} onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="project">Project</Label>
                <Select value={newEmployee.project} onValueChange={(value) => setNewEmployee({...newEmployee, project: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project} value={project}>{project}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label className="block mb-2">Equipment Assignment (Optional)</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {mockEquipment.map((equipment) => (
                    <label key={equipment} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-accent">
                      <input
                        type="checkbox"
                        checked={newEmployee.equipment.includes(equipment)}
                        onChange={() => handleEquipmentToggle(equipment, false)}
                        className="rounded"
                      />
                      <span className="text-sm">{equipment}</span>
                    </label>
                  ))}
                </div>
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
                  placeholder="Search by name or badge number..."
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
                {mockDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
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
                <TableHead>Project</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
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
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.badgeNumber}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.jobTitle}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.project}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {employee.equipment.length > 0 ? (
                        employee.equipment.slice(0, 2).map((equipment, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {equipment}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                      {employee.equipment.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{employee.equipment.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>${employee.salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
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
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee details and equipment assignments
            </DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editJobTitle">Job Title</Label>
                <Select value={editingEmployee.jobTitle} onValueChange={(value) => setEditingEmployee({...editingEmployee, jobTitle: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockJobTitles.map((title) => (
                      <SelectItem key={title} value={title}>{title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editProject">Project</Label>
                <Select value={editingEmployee.project} onValueChange={(value) => setEditingEmployee({...editingEmployee, project: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects.map((project) => (
                      <SelectItem key={project} value={project}>{project}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block mb-2">Equipment Assignment</Label>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {mockEquipment.map((equipment) => (
                    <label key={equipment} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-accent">
                      <input
                        type="checkbox"
                        checked={editingEmployee.equipment.includes(equipment)}
                        onChange={() => handleEquipmentToggle(equipment, true)}
                        className="rounded"
                      />
                      <span className="text-sm">{equipment}</span>
                    </label>
                  ))}
                </div>
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