import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ChartContainer, ChartTooltipContent } from './ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, Calculator } from 'lucide-react';

interface ProjectCost {
  id: string;
  projectName: string;
  budget: number;
  laborCost: number;
  equipmentCost: number;
  materialCost: number;
  otherCosts: number;
  totalSpent: number;
  hoursWorked: number;
  employeeCount: number;
  equipmentCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'overbudget' | 'planning';
}

// Mock project cost data
const mockProjectCosts: ProjectCost[] = [
  {
    id: '1',
    projectName: 'Project Alpha',
    budget: 250000,
    laborCost: 125000,
    equipmentCost: 45000,
    materialCost: 35000,
    otherCosts: 8000,
    totalSpent: 213000,
    hoursWorked: 1250,
    employeeCount: 15,
    equipmentCount: 8,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    status: 'active'
  },
  {
    id: '2',
    projectName: 'Project Beta',
    budget: 500000,
    laborCost: 280000,
    equipmentCost: 95000,
    materialCost: 85000,
    otherCosts: 15000,
    totalSpent: 475000,
    hoursWorked: 2100,
    employeeCount: 12,
    equipmentCount: 15,
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    status: 'active'
  },
  {
    id: '3',
    projectName: 'Project Gamma',
    budget: 180000,
    laborCost: 95000,
    equipmentCost: 25000,
    materialCost: 20000,
    otherCosts: 5000,
    totalSpent: 145000,
    hoursWorked: 950,
    employeeCount: 8,
    equipmentCount: 5,
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    status: 'active'
  },
  {
    id: '4',
    projectName: 'Completed Project X',
    budget: 150000,
    laborCost: 85000,
    equipmentCost: 35000,
    materialCost: 25000,
    otherCosts: 8000,
    totalSpent: 153000,
    hoursWorked: 1800,
    employeeCount: 10,
    equipmentCount: 6,
    startDate: '2023-10-01',
    endDate: '2024-01-15',
    status: 'overbudget'
  }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'overbudget':
      return 'destructive';
    case 'planning':
      return 'outline';
    default:
      return 'default';
  }
};

export function ProjectCosts() {
  const [selectedProject, setSelectedProject] = useState<ProjectCost | null>(null);

  const totalBudget = mockProjectCosts.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = mockProjectCosts.reduce((sum, project) => sum + project.totalSpent, 0);
  const activeProjects = mockProjectCosts.filter(p => p.status === 'active').length;
  const overbudgetProjects = mockProjectCosts.filter(p => p.status === 'overbudget').length;

  const costBreakdownData = selectedProject ? [
    { name: 'Labor', value: selectedProject.laborCost, color: COLORS[0] },
    { name: 'Equipment', value: selectedProject.equipmentCost, color: COLORS[1] },
    { name: 'Materials', value: selectedProject.materialCost, color: COLORS[2] },
    { name: 'Other', value: selectedProject.otherCosts, color: COLORS[3] }
  ] : [];

  const projectComparisonData = mockProjectCosts.map(project => ({
    name: project.projectName.replace('Project ', ''),
    budget: project.budget,
    spent: project.totalSpent,
    remaining: project.budget - project.totalSpent
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Project Cost Analysis</h1>
          <p className="text-muted-foreground">
            Track financial performance and budget utilization across all projects
          </p>
        </div>
        <Calculator className="h-6 w-6 text-muted-foreground" />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Over Budget</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overbudgetProjects}</div>
          </CardContent>
        </Card>
      </div>

      {/* Project Selection and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Select a project to view detailed costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockProjectCosts.map((project) => (
              <div
                key={project.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedProject?.id === project.id ? 'border-primary bg-accent' : 'hover:bg-accent'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{project.projectName}</h4>
                  <Badge variant={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Budget:</span>
                    <span>${project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Spent:</span>
                    <span className={project.totalSpent > project.budget ? 'text-destructive' : ''}>
                      ${project.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((project.totalSpent / project.budget) * 100, 100)} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedProject ? selectedProject.projectName : 'Select a Project'}
            </CardTitle>
            <CardDescription>
              {selectedProject ? 'Detailed cost breakdown and analysis' : 'Choose a project from the list to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedProject ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">${selectedProject.budget.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Budget</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">${selectedProject.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedProject.employeeCount}</p>
                    <p className="text-sm text-muted-foreground">Employees</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedProject.hoursWorked}</p>
                    <p className="text-sm text-muted-foreground">Hours Worked</p>
                  </div>
                </div>

                {/* Cost Breakdown Chart */}
                <div>
                  <h4 className="mb-4">Cost Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Amount",
                        },
                      }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdownData}
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {costBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>

                    <div className="space-y-3">
                      {costBreakdownData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">${item.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Cost per Hour</h5>
                    <p className="text-2xl font-bold">
                      ${(selectedProject.totalSpent / selectedProject.hoursWorked).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Cost per Employee</h5>
                    <p className="text-2xl font-bold">
                      ${(selectedProject.totalSpent / selectedProject.employeeCount).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Budget Status */}
                <div className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium">Budget Utilization</h5>
                    <span className={`font-medium ${
                      selectedProject.totalSpent > selectedProject.budget ? 'text-destructive' : 'text-green-600'
                    }`}>
                      {((selectedProject.totalSpent / selectedProject.budget) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min((selectedProject.totalSpent / selectedProject.budget) * 100, 100)} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>Spent: ${selectedProject.totalSpent.toLocaleString()}</span>
                    <span>
                      {selectedProject.budget - selectedProject.totalSpent >= 0 
                        ? `Remaining: $${(selectedProject.budget - selectedProject.totalSpent).toLocaleString()}`
                        : `Over budget: $${(selectedProject.totalSpent - selectedProject.budget).toLocaleString()}`
                      }
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                Select a project from the list to view detailed cost analysis
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Project Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Project Budget Comparison</CardTitle>
          <CardDescription>Compare budget vs actual spending across all projects</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              budget: {
                label: "Budget",
                color: "hsl(var(--chart-1))",
              },
              spent: {
                label: "Spent",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectComparisonData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="budget" fill="var(--color-chart-1)" name="Budget" />
                <Bar dataKey="spent" fill="var(--color-chart-2)" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}