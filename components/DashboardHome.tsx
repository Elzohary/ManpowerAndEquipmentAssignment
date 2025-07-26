import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ChartContainer, ChartTooltipContent } from './ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, Building2, FolderOpen, Calendar } from 'lucide-react';

interface DashboardHomeProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

// Mock data
const mockSummaryData = {
  totalEmployeesWorkingToday: 45,
  employeesPerProject: [
    { name: 'Project Alpha', count: 15 },
    { name: 'Project Beta', count: 12 },
    { name: 'Project Gamma', count: 8 },
    { name: 'Office Work', count: 10 }
  ],
  officeStaffByDepartment: [
    { department: 'Engineering', count: 8 },
    { department: 'HR', count: 3 },
    { department: 'Admin', count: 4 },
    { department: 'Operations', count: 5 }
  ]
};

const mockProjects = [
  {
    id: 1,
    name: 'Project Alpha',
    totalWorkers: 15,
    workGroups: [
      { name: 'Engineers', count: 8 },
      { name: 'Supervisors', count: 2 },
      { name: 'Workers', count: 5 }
    ]
  },
  {
    id: 2,
    name: 'Project Beta',
    totalWorkers: 12,
    workGroups: [
      { name: 'Engineers', count: 5 },
      { name: 'Technicians', count: 4 },
      { name: 'Workers', count: 3 }
    ]
  },
  {
    id: 3,
    name: 'Project Gamma',
    totalWorkers: 8,
    workGroups: [
      { name: 'Engineers', count: 3 },
      { name: 'Workers', count: 5 }
    ]
  }
];

export function DashboardHome({ selectedDate, onDateChange }: DashboardHomeProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Employees Working Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSummaryData.totalEmployeesWorkingToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjects.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Office Staff</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSummaryData.officeStaffByDepartment.reduce((sum, dept) => sum + dept.count, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSummaryData.officeStaffByDepartment.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employees per Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Employees",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSummaryData.employeesPerProject}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-chart-1)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Office Staff by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Staff",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockSummaryData.officeStaffByDepartment}>
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-chart-2)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>Breakdown of workers by project and work group for {selectedDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3>{project.name}</h3>
                  <Badge variant="secondary">{project.totalWorkers} Workers</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.workGroups.map((group, index) => (
                    <Badge key={index} variant="outline">
                      {group.name}: {group.count}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  View Project Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}