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
import { Textarea } from './ui/textarea';
import { useAuth } from './AuthContext';
import { Wrench, Plus, Search, Edit, Trash2, UserCheck, UserX } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
  cost: number;
  status: 'available' | 'assigned' | 'maintenance' | 'damaged';
  assignedTo: string | null;
  assignedEmployee: string | null;
  location: string;
  description: string;
  maintenanceDate: string | null;
}

// Mock equipment data
const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'Laptop Dell XPS 15',
    category: 'Computer',
    serialNumber: 'DL001',
    model: 'XPS 15 9520',
    manufacturer: 'Dell',
    purchaseDate: '2024-01-15',
    cost: 2500,
    status: 'assigned',
    assignedTo: 'EMP001',
    assignedEmployee: 'John Smith',
    location: 'Main Office',
    description: 'High-performance laptop for development work',
    maintenanceDate: null
  },
  {
    id: '2',
    name: 'Safety Helmet',
    category: 'Safety',
    serialNumber: 'SH001',
    model: 'ProGuard X1',
    manufacturer: 'SafetyFirst',
    purchaseDate: '2024-02-01',
    cost: 85,
    status: 'assigned',
    assignedTo: 'EMP003',
    assignedEmployee: 'Mike Johnson',
    location: 'Project Site B',
    description: 'Construction safety helmet with chin strap',
    maintenanceDate: null
  },
  {
    id: '3',
    name: 'Drill Machine',
    category: 'Tools',
    serialNumber: 'DM001',
    model: 'PowerMax 2000',
    manufacturer: 'ToolCorp',
    purchaseDate: '2024-01-20',
    cost: 320,
    status: 'available',
    assignedTo: null,
    assignedEmployee: null,
    location: 'Equipment Storage',
    description: 'Cordless drill with multiple bits',
    maintenanceDate: null
  },
  {
    id: '4',
    name: 'Measuring Tape',
    category: 'Tools',
    serialNumber: 'MT001',
    model: 'ProMeasure 50ft',
    manufacturer: 'MeasureTech',
    purchaseDate: '2024-02-10',
    cost: 45,
    status: 'maintenance',
    assignedTo: null,
    assignedEmployee: null,
    location: 'Maintenance Shop',
    description: 'Professional measuring tape for construction',
    maintenanceDate: '2024-02-20'
  },
  {
    id: '5',
    name: 'iPad Pro',
    category: 'Computer',
    serialNumber: 'IP001',
    model: 'iPad Pro 12.9"',
    manufacturer: 'Apple',
    purchaseDate: '2024-01-30',
    cost: 1100,
    status: 'available',
    assignedTo: null,
    assignedEmployee: null,
    location: 'IT Storage',
    description: 'Tablet for field documentation and presentations',
    maintenanceDate: null
  }
];

const equipmentCategories = ['Computer', 'Tools', 'Safety', 'Vehicle', 'Communication', 'Other'];
const equipmentStatuses = ['available', 'assigned', 'maintenance', 'damaged'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'default';
    case 'assigned':
      return 'secondary';
    case 'maintenance':
      return 'outline';
    case 'damaged':
      return 'destructive';
    default:
      return 'default';
  }
};

export function EquipmentDirectory() {
  const { hasPermission } = useAuth();
  const [equipment, setEquipment] = useState(mockEquipment);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    category: '',
    serialNumber: '',
    model: '',
    manufacturer: '',
    purchaseDate: '',
    cost: '',
    location: '',
    description: ''
  });

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddEquipment = () => {
    const equipmentItem: Equipment = {
      ...newEquipment,
      id: Math.max(...equipment.map(e => parseInt(e.id))) + 1 + '',
      cost: parseInt(newEquipment.cost) || 0,
      status: 'available',
      assignedTo: null,
      assignedEmployee: null,
      maintenanceDate: null
    };
    setEquipment([...equipment, equipmentItem]);
    setNewEquipment({
      name: '',
      category: '',
      serialNumber: '',
      model: '',
      manufacturer: '',
      purchaseDate: '',
      cost: '',
      location: '',
      description: ''
    });
    setIsAddModalOpen(false);
  };

  const handleAssignEquipment = (badgeNumber: string, employeeName: string) => {
    if (!selectedEquipment) return;
    
    setEquipment(prev => prev.map(item => 
      item.id === selectedEquipment.id 
        ? { 
            ...item, 
            status: 'assigned', 
            assignedTo: badgeNumber,
            assignedEmployee: employeeName
          }
        : item
    ));
    setIsAssignModalOpen(false);
    setSelectedEquipment(null);
  };

  const handleUnassignEquipment = (equipmentId: string) => {
    setEquipment(prev => prev.map(item => 
      item.id === equipmentId 
        ? { 
            ...item, 
            status: 'available', 
            assignedTo: null,
            assignedEmployee: null
          }
        : item
    ));
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipment(equipment.filter(item => item.id !== id));
  };

  const availableCount = equipment.filter(e => e.status === 'available').length;
  const assignedCount = equipment.filter(e => e.status === 'assigned').length;
  const maintenanceCount = equipment.filter(e => e.status === 'maintenance').length;
  const totalValue = equipment.reduce((sum, e) => sum + e.cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Equipment Directory</h1>
          <p className="text-muted-foreground">
            Manage company equipment and assignments
          </p>
        </div>
        {hasPermission(['admin', 'hr', 'manager']) && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>
                  Enter the details for the new equipment
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="equipmentName">Equipment Name</Label>
                  <Input
                    id="equipmentName"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                    placeholder="Laptop Dell XPS 15"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newEquipment.category} onValueChange={(value) => setNewEquipment({...newEquipment, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={newEquipment.serialNumber}
                    onChange={(e) => setNewEquipment({...newEquipment, serialNumber: e.target.value})}
                    placeholder="DL001"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={newEquipment.model}
                    onChange={(e) => setNewEquipment({...newEquipment, model: e.target.value})}
                    placeholder="XPS 15 9520"
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={newEquipment.manufacturer}
                    onChange={(e) => setNewEquipment({...newEquipment, manufacturer: e.target.value})}
                    placeholder="Dell"
                  />
                </div>
                <div>
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={newEquipment.purchaseDate}
                    onChange={(e) => setNewEquipment({...newEquipment, purchaseDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newEquipment.cost}
                    onChange={(e) => setNewEquipment({...newEquipment, cost: e.target.value})}
                    placeholder="2500"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newEquipment.location}
                    onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                    placeholder="Main Office"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEquipment.description}
                    onChange={(e) => setNewEquipment({...newEquipment, description: e.target.value})}
                    placeholder="High-performance laptop for development work"
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddEquipment} className="w-full">
                  Add Equipment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Available Equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Assigned Equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{assignedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Maintenance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{maintenanceCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {equipmentCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {equipmentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Equipment Inventory
          </CardTitle>
          <CardDescription>
            {filteredEquipment.length} of {equipment.length} equipment items shown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.serialNumber}</p>
                      <p className="text-xs text-muted-foreground">{item.model}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.assignedEmployee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {item.assignedEmployee.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{item.assignedEmployee}</p>
                          <p className="text-xs text-muted-foreground">{item.assignedTo}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>${item.cost.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {hasPermission(['admin', 'hr', 'manager']) && (
                        <>
                          {item.status === 'available' ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedEquipment(item);
                                setIsAssignModalOpen(true);
                              }}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          ) : item.status === 'assigned' ? (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleUnassignEquipment(item.id)}
                            >
                              <UserX className="h-4 w-4" />
                            </Button>
                          ) : null}
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteEquipment(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assignment Modal */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Equipment</DialogTitle>
            <DialogDescription>
              Assign {selectedEquipment?.name} to an employee
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="badgeNumber">Employee Badge Number</Label>
              <Input
                id="badgeNumber"
                placeholder="EMP001"
              />
            </div>
            <div>
              <Label htmlFor="employeeName">Employee Name</Label>
              <Input
                id="employeeName"
                placeholder="John Smith"
              />
            </div>
            <Button 
              onClick={() => {
                const badgeInput = document.getElementById('badgeNumber') as HTMLInputElement;
                const nameInput = document.getElementById('employeeName') as HTMLInputElement;
                handleAssignEquipment(badgeInput.value, nameInput.value);
              }} 
              className="w-full"
            >
              Assign Equipment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}