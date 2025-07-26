import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Edit, UserPlus, Building2 } from 'lucide-react';

// Mock data
const mockOfficeStaff = {
  'HR Department': [
    { id: 1, badgeNumber: 'HR001', name: 'Sarah Wilson', jobTitle: 'HR Manager', status: 'Active' },
    { id: 2, badgeNumber: 'HR002', name: 'Mark Davis', jobTitle: 'HR Assistant', status: 'Active' },
    { id: 3, badgeNumber: 'HR003', name: 'Lisa Brown', jobTitle: 'Recruiter', status: 'On Leave' }
  ],
  'Engineering Department': [
    { id: 4, badgeNumber: 'ENG001', name: 'John Smith', jobTitle: 'Senior Engineer', status: 'Active', project: 'Project Alpha' },
    { id: 5, badgeNumber: 'ENG002', name: 'Jane Doe', jobTitle: 'Software Developer', status: 'Active', project: 'Project Alpha' },
    { id: 6, badgeNumber: 'ENG003', name: 'Robert Kim', jobTitle: 'QA Engineer', status: 'Active', project: 'Project Beta' },
    { id: 7, badgeNumber: 'ENG004', name: 'Emily Chen', jobTitle: 'Frontend Developer', status: 'Active', project: 'Project Gamma' }
  ],
  'Admin Department': [
    { id: 8, badgeNumber: 'ADM001', name: 'Michael Johnson', jobTitle: 'Office Manager', status: 'Active' },
    { id: 9, badgeNumber: 'ADM002', name: 'Jennifer Lee', jobTitle: 'Administrative Assistant', status: 'Active' },
    { id: 10, badgeNumber: 'ADM003', name: 'David Wilson', jobTitle: 'Data Entry Clerk', status: 'Active' }
  ],
  'Office Coordinators': [
    { id: 11, badgeNumber: 'OFC001', name: 'Amanda Taylor', jobTitle: 'Project Coordinator', status: 'Active' },
    { id: 12, badgeNumber: 'OFC002', name: 'James Miller', jobTitle: 'Operations Coordinator', status: 'Active' }
  ],
  'Operations Department': [
    { id: 13, badgeNumber: 'OPS001', name: 'Kevin Brown', jobTitle: 'Operations Manager', status: 'Active' },
    { id: 14, badgeNumber: 'OPS002', name: 'Rachel Green', jobTitle: 'Logistics Coordinator', status: 'Active' },
    { id: 15, badgeNumber: 'OPS003', name: 'Tom Anderson', jobTitle: 'Supply Chain Specialist', status: 'Active' }
  ],
  'Accounting Department': [
    { id: 16, badgeNumber: 'ACC001', name: 'Patricia Martinez', jobTitle: 'Chief Accountant', status: 'Active' },
    { id: 17, badgeNumber: 'ACC002', name: 'Steven Clark', jobTitle: 'Bookkeeper', status: 'Active' },
    { id: 18, badgeNumber: 'ACC003', name: 'Michelle White', jobTitle: 'Financial Analyst', status: 'On Leave' }
  ],
  'Office Boys': [
    { id: 19, badgeNumber: 'OB001', name: 'Carlos Rodriguez', jobTitle: 'Office Assistant', status: 'Active' },
    { id: 20, badgeNumber: 'OB002', name: 'Daniel Garcia', jobTitle: 'Maintenance Helper', status: 'Active' }
  ]
};

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

export function OfficeStaffOverview() {
  const totalStaff = Object.values(mockOfficeStaff).flat().length;
  const activeStaff = Object.values(mockOfficeStaff).flat().filter(staff => staff.status === 'Active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Office Staff Overview</h1>
          <p className="text-muted-foreground">
            {activeStaff} of {totalStaff} staff members are currently active
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Department Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(mockOfficeStaff).map(([department, staff]) => (
          <Card key={department}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                {department}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{staff.length}</span>
                <Badge variant="secondary">
                  {staff.filter(s => s.status === 'Active').length} Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Staff by Department */}
      <div className="space-y-6">
        {Object.entries(mockOfficeStaff).map(([department, staff]) => (
          <Card key={department}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{department}</span>
                <Badge variant="outline">{staff.length} employees</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staff.map((employee) => (
                  <div key={employee.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium truncate">{employee.name}</p>
                          <Badge variant={getStatusColor(employee.status)} className="text-xs">
                            {employee.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{employee.badgeNumber}</p>
                        <p className="text-sm">{employee.jobTitle}</p>
                        {employee.project && (
                          <Badge variant="outline" className="text-xs mt-2">
                            {employee.project}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Reassign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}