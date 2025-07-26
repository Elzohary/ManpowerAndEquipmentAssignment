import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar, Edit, Save, X } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface DailyManpowerLogsProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

// Mock data
const mockEmployeeData = [
  {
    id: 1,
    badgeNumber: 'EMP001',
    name: 'John Smith',
    originalJobTitle: 'Software Engineer',
    todaysJobTitle: 'Project Lead',
    workDescription: 'Leading the alpha project development team',
    workGroup: 'Engineering',
    project: 'Project Alpha'
  },
  {
    id: 2,
    badgeNumber: 'EMP002',
    name: 'Jane Doe',
    originalJobTitle: 'Junior Developer',
    todaysJobTitle: 'Frontend Developer',
    workDescription: 'Working on user interface components',
    workGroup: 'Engineering',
    project: 'Project Alpha'
  },
  {
    id: 3,
    badgeNumber: 'EMP003',
    name: 'Mike Johnson',
    originalJobTitle: 'Site Supervisor',
    todaysJobTitle: 'Site Supervisor',
    workDescription: 'Overseeing construction activities',
    workGroup: 'Supervision',
    project: 'Project Beta'
  },
  {
    id: 4,
    badgeNumber: 'EMP004',
    name: 'Sarah Wilson',
    originalJobTitle: 'HR Manager',
    todaysJobTitle: 'HR Manager',
    workDescription: 'Conducting employee interviews',
    workGroup: 'HR',
    project: 'Office Work'
  }
];

const mockJobTitles = [
  'Software Engineer',
  'Project Lead',
  'Frontend Developer',
  'Site Supervisor',
  'HR Manager',
  'Quality Inspector',
  'Safety Officer'
];

const mockWorkGroups = [
  'Engineering',
  'Supervision',
  'HR',
  'Quality Control',
  'Safety',
  'Administration'
];

export function DailyManpowerLogs({ selectedDate, onDateChange }: DailyManpowerLogsProps) {
  const [employees, setEmployees] = useState(mockEmployeeData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>({});

  const groupedEmployees = employees.reduce((acc, employee) => {
    if (!acc[employee.project]) {
      acc[employee.project] = [];
    }
    acc[employee.project].push(employee);
    return acc;
  }, {} as Record<string, typeof employees>);

  const handleEdit = (employee: any) => {
    setEditingId(employee.id);
    setEditData({ ...employee });
  };

  const handleSave = () => {
    setEmployees(employees.map(emp => 
      emp.id === editingId ? { ...editData } : emp
    ));
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Daily Manpower Logs</h1>
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

      {Object.entries(groupedEmployees).map(([project, projectEmployees]) => (
        <Card key={project}>
          <CardHeader>
            <CardTitle>{project}</CardTitle>
            <CardDescription>
              {projectEmployees.length} employees assigned for {selectedDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectEmployees.map((employee) => (
                <div key={employee.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                    <div>
                      <label className="text-sm text-muted-foreground">Badge Number</label>
                      <p>{employee.badgeNumber}</p>
                      <p className="text-sm">{employee.name}</p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Original Job Title</label>
                      <p>{employee.originalJobTitle}</p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Today's Job Title</label>
                      {editingId === employee.id ? (
                        <Select
                          value={editData.todaysJobTitle}
                          onValueChange={(value) => setEditData({ ...editData, todaysJobTitle: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mockJobTitles.map((title) => (
                              <SelectItem key={title} value={title}>{title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p>{employee.todaysJobTitle}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Work Group</label>
                      {editingId === employee.id ? (
                        <Select
                          value={editData.workGroup}
                          onValueChange={(value) => setEditData({ ...editData, workGroup: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mockWorkGroups.map((group) => (
                              <SelectItem key={group} value={group}>{group}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="secondary">{employee.workGroup}</Badge>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-muted-foreground">Work Description</label>
                      {editingId === employee.id ? (
                        <Textarea
                          value={editData.workDescription}
                          onChange={(e) => setEditData({ ...editData, workDescription: e.target.value })}
                          className="mt-1"
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm">{employee.workDescription}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    {editingId === employee.id ? (
                      <>
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                          <X className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}