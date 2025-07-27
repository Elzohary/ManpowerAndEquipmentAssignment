import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar, Edit, Save, X } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { employeesService, jobTitlesService, workGroupsService } from '../lib/database';
import type { Employee, JobTitle, WorkGroup } from '../lib/supabase';

interface DailyManpowerLogsProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

interface EmployeeLog extends Employee {
  originalJobTitle: string;
  todaysJobTitle: string;
  workDescription: string;
  workGroup: string;
  project: string;
}

export function DailyManpowerLogs({ selectedDate, onDateChange }: DailyManpowerLogsProps) {
  const [employees, setEmployees] = useState<EmployeeLog[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [workGroups, setWorkGroups] = useState<WorkGroup[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [employeesData, jobTitlesData, workGroupsData] = await Promise.all([
        employeesService.getAll(),
        jobTitlesService.getAll(),
        workGroupsService.getAll()
      ]);
      
      // Transform employees data to include log-specific fields
      const employeeLogs: EmployeeLog[] = employeesData.map(emp => {
        const jobTitle = jobTitlesData.find(jt => jt.id === emp.job_title_id);
        const workGroup = workGroupsData.find(wg => wg.id === emp.work_group_id);
        
        return {
          ...emp,
          originalJobTitle: jobTitle?.name || 'Unknown',
          todaysJobTitle: jobTitle?.name || 'Unknown',
          workDescription: 'Regular duties',
          workGroup: workGroup?.name || 'Unknown',
          project: 'Project Alpha' // Default project, could be enhanced
        };
      });
      
      setEmployees(employeeLogs);
      setJobTitles(jobTitlesData);
      setWorkGroups(workGroupsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const groupedEmployees = employees.reduce((acc, employee) => {
    if (!acc[employee.project]) {
      acc[employee.project] = [];
    }
    acc[employee.project].push(employee);
    return acc;
  }, {} as Record<string, typeof employees>);

  const handleEdit = (employee: EmployeeLog) => {
    setEditingId(employee.id);
    setEditData({
      todaysJobTitle: employee.todaysJobTitle,
      workDescription: employee.workDescription,
      workGroup: employee.workGroup
    });
  };

  const handleSave = (employeeId: string) => {
    setEmployees(employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, ...editData }
        : emp
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
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {employee.first_name[0]}{employee.last_name[0]}
                      </div>
                      <div>
                        <h4 className="font-medium">{employee.first_name} {employee.last_name}</h4>
                        <p className="text-sm text-gray-600">Badge: {employee.badge_number || employee.id}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Original Job Title</label>
                        <p className="text-sm text-gray-600">{employee.originalJobTitle}</p>
                      </div>
                      
                      {editingId === employee.id ? (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Today's Job Title</label>
                            <Select 
                              value={editData.todaysJobTitle} 
                              onValueChange={(value) => setEditData({...editData, todaysJobTitle: value})}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {jobTitles.map(title => (
                                  <SelectItem key={title.id} value={title.name}>{title.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-700">Work Description</label>
                            <Textarea
                              value={editData.workDescription}
                              onChange={(e) => setEditData({...editData, workDescription: e.target.value})}
                              className="mt-1"
                              rows={2}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700">Work Group</label>
                            <Select 
                              value={editData.workGroup} 
                              onValueChange={(value) => setEditData({...editData, workGroup: value})}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {workGroups.map(group => (
                                  <SelectItem key={group.id} value={group.name}>{group.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Today's Job Title</label>
                            <p className="text-sm text-gray-600">{employee.todaysJobTitle}</p>
                          </div>
                          
                          <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-700">Work Description</label>
                            <p className="text-sm text-gray-600">{employee.workDescription}</p>
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-gray-700">Work Group</label>
                            <Badge variant="secondary">{employee.workGroup}</Badge>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {editingId === employee.id ? (
                      <>
                        <Button size="sm" onClick={() => handleSave(employee.id)}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(employee)}>
                        <Edit className="w-4 h-4" />
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