import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Calendar, Users, MapPin, Plus } from 'lucide-react';

// Mock project data
const mockProjects = [
  {
    id: 1,
    name: 'Project Alpha',
    description: 'Enterprise software development project',
    status: 'Active',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    location: 'Office Building A',
    totalWorkers: 15,
    activeWorkers: 15,
    budget: 250000,
    workGroups: [
      { name: 'Engineers', count: 8 },
      { name: 'Supervisors', count: 2 },
      { name: 'Workers', count: 5 }
    ]
  },
  {
    id: 2,
    name: 'Project Beta',
    description: 'Construction of new facility',
    status: 'Active',
    progress: 45,
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    location: 'Site B - Downtown',
    totalWorkers: 12,
    activeWorkers: 11,
    budget: 500000,
    workGroups: [
      { name: 'Engineers', count: 3 },
      { name: 'Technicians', count: 4 },
      { name: 'Workers', count: 5 }
    ]
  },
  {
    id: 3,
    name: 'Project Gamma',
    description: 'Infrastructure upgrade project',
    status: 'Planning',
    progress: 20,
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    location: 'Multiple Sites',
    totalWorkers: 8,
    activeWorkers: 6,
    budget: 180000,
    workGroups: [
      { name: 'Engineers', count: 3 },
      { name: 'Workers', count: 5 }
    ]
  },
  {
    id: 4,
    name: 'Office Operations',
    description: 'Daily office and administrative work',
    status: 'Ongoing',
    progress: 100,
    startDate: '2024-01-01',
    endDate: 'Ongoing',
    location: 'Main Office',
    totalWorkers: 20,
    activeWorkers: 18,
    budget: 0,
    workGroups: [
      { name: 'Admin Staff', count: 8 },
      { name: 'HR', count: 3 },
      { name: 'Accounting', count: 3 },
      { name: 'Operations', count: 6 }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Planning':
      return 'secondary';
    case 'Ongoing':
      return 'outline';
    case 'Completed':
      return 'secondary';
    case 'On Hold':
      return 'destructive';
    default:
      return 'default';
  }
};

export function Projects() {
  const [projects] = useState(mockProjects);

  const totalActiveProjects = projects.filter(p => p.status === 'Active').length;
  const totalWorkers = projects.reduce((sum, p) => sum + p.activeWorkers, 0);
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Projects</h1>
          <p className="text-muted-foreground">
            Manage all company projects and assignments
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBudget > 0 ? `$${totalBudget.toLocaleString()}` : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{project.name}</CardTitle>
                <Badge variant={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p>{new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">End Date</p>
                    <p>{project.endDate === 'Ongoing' ? 'Ongoing' : new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p>{project.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Workers</p>
                    <p>{project.activeWorkers} / {project.totalWorkers}</p>
                  </div>
                </div>
              </div>

              {/* Budget */}
              {project.budget > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-lg font-semibold">${project.budget.toLocaleString()}</p>
                </div>
              )}

              {/* Work Groups */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Work Groups</p>
                <div className="flex flex-wrap gap-2">
                  {project.workGroups.map((group, index) => (
                    <Badge key={index} variant="outline">
                      {group.name}: {group.count}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Manage Workers
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}