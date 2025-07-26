import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Users, Wrench, MapPin } from 'lucide-react';

interface Assignment {
  employeeId: string;
  employeeName: string;
  badgeNumber: string;
  project: string;
  workGroup: string;
  equipment: string[];
  location: string;
}

// Mock data
const mockEmployees = [
  { id: 'EMP001', name: 'John Smith', badgeNumber: 'EMP001' },
  { id: 'EMP002', name: 'Jane Doe', badgeNumber: 'EMP002' },
  { id: 'EMP003', name: 'Mike Johnson', badgeNumber: 'EMP003' },
];

const mockProjects = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Office Work'];
const mockWorkGroups = ['Engineering', 'Supervision', 'Quality Control', 'Safety'];
const mockLocations = ['Main Office', 'Project Site A', 'Project Site B', 'Remote'];
const mockEquipment = [
  'Laptop Dell XPS 15',
  'Safety Helmet',
  'Drill Machine',
  'Measuring Tape',
  'iPad Pro'
];

export function SimpleAssignment() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedWorkGroup, setSelectedWorkGroup] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const handleAddAssignment = () => {
    if (!selectedEmployee || !selectedProject || !selectedWorkGroup || !selectedLocation) {
      return;
    }

    const employee = mockEmployees.find(emp => emp.id === selectedEmployee);
    if (!employee) return;

    const newAssignment: Assignment = {
      employeeId: employee.id,
      employeeName: employee.name,
      badgeNumber: employee.badgeNumber,
      project: selectedProject,
      workGroup: selectedWorkGroup,
      equipment: selectedEquipment,
      location: selectedLocation
    };

    setAssignments([...assignments, newAssignment]);
    
    // Reset form
    setSelectedEmployee('');
    setSelectedProject('');
    setSelectedWorkGroup('');
    setSelectedLocation('');
    setSelectedEquipment([]);
  };

  const handleRemoveAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const handleEquipmentToggle = (equipment: string) => {
    if (selectedEquipment.includes(equipment)) {
      setSelectedEquipment(selectedEquipment.filter(e => e !== equipment));
    } else {
      setSelectedEquipment([...selectedEquipment, equipment]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Quick Assignment</h1>
          <p className="text-muted-foreground">
            Simplified workflow for assigning employees to projects with equipment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Assignment</CardTitle>
            <CardDescription>Assign employee to project with equipment for {selectedDate}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose employee" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.badgeNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Project</label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose project" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Work Group</label>
              <Select value={selectedWorkGroup} onValueChange={setSelectedWorkGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose work group" />
                </SelectTrigger>
                <SelectContent>
                  {mockWorkGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose location" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Equipment (Optional)</label>
              <div className="grid grid-cols-1 gap-2">
                {mockEquipment.map((equipment) => (
                  <label key={equipment} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-accent">
                    <input
                      type="checkbox"
                      checked={selectedEquipment.includes(equipment)}
                      onChange={() => handleEquipmentToggle(equipment)}
                      className="rounded"
                    />
                    <span className="text-sm">{equipment}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleAddAssignment} 
              className="w-full"
              disabled={!selectedEmployee || !selectedProject || !selectedWorkGroup || !selectedLocation}
            >
              Create Assignment
            </Button>
          </CardContent>
        </Card>

        {/* Current Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Today's Assignments
            </CardTitle>
            <CardDescription>
              {assignments.length} assignments for {selectedDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No assignments created yet
                </div>
              ) : (
                assignments.map((assignment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {assignment.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{assignment.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{assignment.badgeNumber}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveAssignment(index)}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Project</p>
                        <Badge variant="outline">{assignment.project}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Work Group</p>
                        <Badge variant="secondary">{assignment.workGroup}</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{assignment.location}</span>
                    </div>

                    {assignment.equipment.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Equipment:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {assignment.equipment.map((equipment, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {equipment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}