import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from './AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  UserCheck, 
  FolderOpen, 
  Settings,
  Calendar,
  DollarSign,
  Wrench,
  ClipboardCheck,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout, hasPermission } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'hr', 'manager', 'employee'] },
    { id: 'attendance', label: 'Attendance Tracker', icon: ClipboardCheck, roles: ['admin', 'hr', 'manager', 'employee'] },
    { id: 'manpower', label: 'Daily Manpower Logs', icon: Calendar, roles: ['admin', 'hr', 'manager'] },
    { id: 'staff', label: 'Office Staff Overview', icon: Building2, roles: ['admin', 'hr', 'manager'] },
    { id: 'employees', label: 'Employee Directory', icon: Users, roles: ['admin', 'hr', 'manager'] },
    { id: 'equipment', label: 'Equipment Directory', icon: Wrench, roles: ['admin', 'hr', 'manager', 'employee'] },
    { id: 'projects', label: 'Projects', icon: FolderOpen, roles: ['admin', 'hr', 'manager'] },
    { id: 'costs', label: 'Project Costs', icon: DollarSign, roles: ['admin', 'manager'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'hr'] },
  ];

  const visibleMenuItems = menuItems.filter(item => hasPermission(item.roles));

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'hr':
        return 'secondary';
      case 'manager':
        return 'outline';
      case 'employee':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="w-64 min-h-screen rounded-none border-r border-l-0 border-t-0 border-b-0">
      <div className="p-6">
        <h2 className="mb-6">Company Dashboard</h2>
        
        {/* User Profile */}
        {user && (
          <div className="mb-6 p-3 bg-accent rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Avatar>
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.badgeNumber}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant={getRoleBadgeColor(user.role)} className="text-xs">
                {user.role.toUpperCase()}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="h-6 px-2"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <nav className="space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'default' : 'ghost'}
                className="w-full justify-start text-sm"
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </Card>
  );
}