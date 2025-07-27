import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Plus, Edit, Trash2, Settings, Loader2 } from 'lucide-react';
import { 
  jobTitlesService, 
  workGroupsService, 
  departmentsService, 
  projectTypesService 
} from '../lib/database';
import type { JobTitle, WorkGroup, Department, ProjectType } from '../lib/supabase';

export function MasterData() {
  // State for data
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [workGroups, setWorkGroups] = useState<WorkGroup[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);

  // Loading states
  const [loading, setLoading] = useState({
    jobTitles: false,
    workGroups: false,
    departments: false,
    projectTypes: false
  });

  // Modal states
  const [isJobTitleModalOpen, setIsJobTitleModalOpen] = useState(false);
  const [isWorkGroupModalOpen, setIsWorkGroupModalOpen] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isProjectTypeModalOpen, setIsProjectTypeModalOpen] = useState(false);

  // Form states
  const [newJobTitle, setNewJobTitle] = useState({ name: '', description: '' });
  const [newWorkGroup, setNewWorkGroup] = useState({ name: '', description: '' });
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  const [newProjectType, setNewProjectType] = useState({ name: '', description: '' });

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setError(null);
      await Promise.all([
        loadJobTitles(),
        loadWorkGroups(),
        loadDepartments(),
        loadProjectTypes()
      ]);
    } catch (err) {
      setError('Failed to load data. Please check your database connection.');
      console.error('Error loading data:', err);
    }
  };

  const loadJobTitles = async () => {
    setLoading(prev => ({ ...prev, jobTitles: true }));
    try {
      const data = await jobTitlesService.getAll();
      setJobTitles(data);
    } catch (err) {
      console.error('Error loading job titles:', err);
    } finally {
      setLoading(prev => ({ ...prev, jobTitles: false }));
    }
  };

  const loadWorkGroups = async () => {
    setLoading(prev => ({ ...prev, workGroups: true }));
    try {
      const data = await workGroupsService.getAll();
      setWorkGroups(data);
    } catch (err) {
      console.error('Error loading work groups:', err);
    } finally {
      setLoading(prev => ({ ...prev, workGroups: false }));
    }
  };

  const loadDepartments = async () => {
    setLoading(prev => ({ ...prev, departments: true }));
    try {
      const data = await departmentsService.getAll();
      setDepartments(data);
    } catch (err) {
      console.error('Error loading departments:', err);
    } finally {
      setLoading(prev => ({ ...prev, departments: false }));
    }
  };

  const loadProjectTypes = async () => {
    setLoading(prev => ({ ...prev, projectTypes: true }));
    try {
      const data = await projectTypesService.getAll();
      setProjectTypes(data);
    } catch (err) {
      console.error('Error loading project types:', err);
    } finally {
      setLoading(prev => ({ ...prev, projectTypes: false }));
    }
  };

  // CRUD operations
  const handleAddJobTitle = async () => {
    if (!newJobTitle.name.trim()) return;
    
    try {
      const created = await jobTitlesService.create(newJobTitle);
      setJobTitles(prev => [...prev, created]);
      setNewJobTitle({ name: '', description: '' });
      setIsJobTitleModalOpen(false);
    } catch (err) {
      console.error('Error creating job title:', err);
      setError('Failed to create job title');
    }
  };

  const handleDeleteJobTitle = async (id: string) => {
    try {
      await jobTitlesService.delete(id);
      setJobTitles(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting job title:', err);
      setError('Failed to delete job title');
    }
  };

  const handleAddWorkGroup = async () => {
    if (!newWorkGroup.name.trim()) return;
    
    try {
      const created = await workGroupsService.create(newWorkGroup);
      setWorkGroups(prev => [...prev, created]);
      setNewWorkGroup({ name: '', description: '' });
      setIsWorkGroupModalOpen(false);
    } catch (err) {
      console.error('Error creating work group:', err);
      setError('Failed to create work group');
    }
  };

  const handleDeleteWorkGroup = async (id: string) => {
    try {
      await workGroupsService.delete(id);
      setWorkGroups(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting work group:', err);
      setError('Failed to delete work group');
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.name.trim()) return;
    
    try {
      const created = await departmentsService.create(newDepartment);
      setDepartments(prev => [...prev, created]);
      setNewDepartment({ name: '', description: '' });
      setIsDepartmentModalOpen(false);
    } catch (err) {
      console.error('Error creating department:', err);
      setError('Failed to create department');
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      await departmentsService.delete(id);
      setDepartments(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting department:', err);
      setError('Failed to delete department');
    }
  };

  const handleAddProjectType = async () => {
    if (!newProjectType.name.trim()) return;
    
    try {
      const created = await projectTypesService.create(newProjectType);
      setProjectTypes(prev => [...prev, created]);
      setNewProjectType({ name: '', description: '' });
      setIsProjectTypeModalOpen(false);
    } catch (err) {
      console.error('Error creating project type:', err);
      setError('Failed to create project type');
    }
  };

  const handleDeleteProjectType = async (id: string) => {
    try {
      await projectTypesService.delete(id);
      setProjectTypes(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting project type:', err);
      setError('Failed to delete project type');
    }
  };

  const totalRecords = jobTitles.length + workGroups.length + departments.length + projectTypes.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-800">{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Settings & Master Data</h1>
              </div>
              <p className="text-slate-600 text-lg">
                Manage job titles, work groups, departments, and other system settings
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">Total Records</p>
                <p className="text-2xl font-bold text-slate-900">{totalRecords}</p>
              </div>
              <Button 
                onClick={loadAllData} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="space-y-6">
          <Tabs defaultValue="job-titles">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2">
            <TabsList className="grid w-full grid-cols-4 bg-slate-50 rounded-lg p-1">
              <TabsTrigger value="job-titles" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Job Titles
              </TabsTrigger>
              <TabsTrigger value="work-groups" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Work Groups
              </TabsTrigger>
              <TabsTrigger value="departments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Departments
              </TabsTrigger>
              <TabsTrigger value="project-types" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Project Types
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Job Titles Tab */}
          <TabsContent value="job-titles">
            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded-lg">
                        <Plus className="h-4 w-4 text-blue-600" />
                      </div>
                      Job Titles
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Manage job titles and their descriptions
                    </CardDescription>
                  </div>
                  <Dialog open={isJobTitleModalOpen} onOpenChange={setIsJobTitleModalOpen}>
                    <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white shadow-md h-10 px-4 py-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Job Title
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Job Title</DialogTitle>
                        <DialogDescription>
                          Create a new job title with description
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            value={newJobTitle.name}
                            onChange={(e) => setNewJobTitle({...newJobTitle, name: e.target.value})}
                            placeholder="Senior Software Engineer"
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobDescription">Description</Label>
                          <Input
                            id="jobDescription"
                            value={newJobTitle.description}
                            onChange={(e) => setNewJobTitle({...newJobTitle, description: e.target.value})}
                            placeholder="Experienced software developer with 5+ years experience"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleAddJobTitle} className="flex-1">
                            Add Job Title
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsJobTitleModalOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading.jobTitles ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-slate-600">Loading job titles...</span>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {jobTitles.map((title) => (
                      <div key={title.id} className="group bg-slate-50 hover:bg-slate-100 transition-all duration-200 p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-slate-900">{title.name}</h4>
                            <p className="text-slate-600">{title.description}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button variant="ghost" size="sm" className="hover:bg-orange-100 hover:text-orange-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-red-100 hover:text-red-600"
                              onClick={() => handleDeleteJobTitle(title.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {jobTitles.length === 0 && !loading.jobTitles && (
                      <div className="text-center py-8 text-slate-500">
                        No job titles found. Add your first job title to get started.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Work Groups Tab */}
          <TabsContent value="work-groups">
            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                      <div className="p-1.5 bg-green-100 rounded-lg">
                        <Plus className="h-4 w-4 text-green-600" />
                      </div>
                      Work Groups
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Organize employees into functional work groups
                    </CardDescription>
                  </div>
                  <Dialog open={isWorkGroupModalOpen} onOpenChange={setIsWorkGroupModalOpen}>
                    <DialogTrigger>
                      <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Work Group
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Work Group</DialogTitle>
                        <DialogDescription>
                          Create a new work group for organizing employees
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="workGroupName">Work Group Name</Label>
                          <Input
                            id="workGroupName"
                            value={newWorkGroup.name}
                            onChange={(e) => setNewWorkGroup({...newWorkGroup, name: e.target.value})}
                            placeholder="Development Team"
                          />
                        </div>
                        <div>
                          <Label htmlFor="workGroupDescription">Description</Label>
                          <Input
                            id="workGroupDescription"
                            value={newWorkGroup.description}
                            onChange={(e) => setNewWorkGroup({...newWorkGroup, description: e.target.value})}
                            placeholder="Software development and engineering"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleAddWorkGroup} className="flex-1">
                            Add Work Group
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsWorkGroupModalOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading.workGroups ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                    <span className="ml-2 text-slate-600">Loading work groups...</span>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {workGroups.map((group) => (
                      <div key={group.id} className="group bg-slate-50 hover:bg-slate-100 transition-all duration-200 p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-slate-900">{group.name}</h4>
                            <p className="text-slate-600">{group.description}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button variant="ghost" size="sm" className="hover:bg-orange-100 hover:text-orange-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-red-100 hover:text-red-600"
                              onClick={() => handleDeleteWorkGroup(group.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {workGroups.length === 0 && !loading.workGroups && (
                      <div className="text-center py-8 text-slate-500">
                        No work groups found. Add your first work group to get started.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                      <div className="p-1.5 bg-purple-100 rounded-lg">
                        <Plus className="h-4 w-4 text-purple-600" />
                      </div>
                      Departments
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Manage company departments and organizational structure
                    </CardDescription>
                  </div>
                  <Dialog open={isDepartmentModalOpen} onOpenChange={setIsDepartmentModalOpen}>
                    <DialogTrigger>
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Department
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Department</DialogTitle>
                        <DialogDescription>
                          Create a new department for your organization
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="departmentName">Department Name</Label>
                          <Input
                            id="departmentName"
                            value={newDepartment.name}
                            onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                            placeholder="Engineering"
                          />
                        </div>
                        <div>
                          <Label htmlFor="departmentDescription">Description</Label>
                          <Input
                            id="departmentDescription"
                            value={newDepartment.description}
                            onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                            placeholder="Software and technical development"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleAddDepartment} className="flex-1">
                            Add Department
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsDepartmentModalOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading.departments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="ml-2 text-slate-600">Loading departments...</span>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="group bg-slate-50 hover:bg-slate-100 transition-all duration-200 p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-slate-900">{dept.name}</h4>
                            <p className="text-slate-600">{dept.description}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button variant="ghost" size="sm" className="hover:bg-orange-100 hover:text-orange-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-red-100 hover:text-red-600"
                              onClick={() => handleDeleteDepartment(dept.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {departments.length === 0 && !loading.departments && (
                      <div className="text-center py-8 text-slate-500">
                        No departments found. Add your first department to get started.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Types Tab */}
          <TabsContent value="project-types">
            <Card className="bg-white shadow-lg border-0 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                      <div className="p-1.5 bg-orange-100 rounded-lg">
                        <Plus className="h-4 w-4 text-orange-600" />
                      </div>
                      Project Types
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Define different types of projects for better organization
                    </CardDescription>
                  </div>
                  <Dialog open={isProjectTypeModalOpen} onOpenChange={setIsProjectTypeModalOpen}>
                    <DialogTrigger>
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-md">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project Type
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Project Type</DialogTitle>
                        <DialogDescription>
                          Create a new project type for categorizing projects
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="projectTypeName">Project Type Name</Label>
                          <Input
                            id="projectTypeName"
                            value={newProjectType.name}
                            onChange={(e) => setNewProjectType({...newProjectType, name: e.target.value})}
                            placeholder="Web Development"
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectTypeDescription">Description</Label>
                          <Input
                            id="projectTypeDescription"
                            value={newProjectType.description}
                            onChange={(e) => setNewProjectType({...newProjectType, description: e.target.value})}
                            placeholder="Website and web application projects"
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleAddProjectType} className="flex-1">
                            Add Project Type
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsProjectTypeModalOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loading.projectTypes ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                    <span className="ml-2 text-slate-600">Loading project types...</span>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {projectTypes.map((type) => (
                      <div key={type.id} className="group bg-slate-50 hover:bg-slate-100 transition-all duration-200 p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h4 className="text-lg font-semibold text-slate-900">{type.name}</h4>
                            <p className="text-slate-600">{type.description}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button variant="ghost" size="sm" className="hover:bg-orange-100 hover:text-orange-600">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-red-100 hover:text-red-600"
                              onClick={() => handleDeleteProjectType(type.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {projectTypes.length === 0 && !loading.projectTypes && (
                      <div className="text-center py-8 text-slate-500">
                        No project types found. Add your first project type to get started.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
       </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}