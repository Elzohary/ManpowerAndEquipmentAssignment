import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { DashboardHome } from './components/DashboardHome';
import { DailyManpowerLogs } from './components/DailyManpowerLogs';
import { OfficeStaffOverview } from './components/OfficeStaffOverview';
import EmployeeDirectory from './components/EmployeeDirectory';
import { MasterData } from './components/MasterData';
import { Projects } from './components/Projects';
import { AttendanceTracker } from './components/AttendanceTracker';
import { ProjectCosts } from './components/ProjectCosts';
import { EquipmentDirectory } from './components/EquipmentDirectory';
import { SimpleAssignment } from './components/SimpleAssignment';

function AppContent() {
  const { user, hasPermission } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome selectedDate={selectedDate} onDateChange={setSelectedDate} />;
      case 'attendance':
        return <AttendanceTracker />;
      case 'manpower':
        return hasPermission(['admin', 'hr', 'manager']) ? 
          <DailyManpowerLogs selectedDate={selectedDate} onDateChange={setSelectedDate} /> :
          <div className="p-8 text-center text-muted-foreground">Access denied. Insufficient permissions.</div>;
      case 'staff':
        return hasPermission(['admin', 'hr', 'manager']) ? 
          <OfficeStaffOverview /> :
          <div className="p-8 text-center text-muted-foreground">Access denied. Insufficient permissions.</div>;
      case 'employees':
        return hasPermission(['admin', 'hr', 'manager']) ? 
          <EmployeeDirectory /> :
          <div className="p-8 text-center text-muted-foreground">Access denied. Insufficient permissions.</div>;
      case 'equipment':
        return <EquipmentDirectory />;
      case 'projects':
        return hasPermission(['admin', 'hr', 'manager']) ? 
          <Projects /> :
          <div className="p-8 text-center text-muted-foreground">Access denied. Insufficient permissions.</div>;
      case 'costs':
        return hasPermission(['admin', 'manager']) ? 
          <ProjectCosts /> :
          <div className="p-8 text-center text-muted-foreground">Access denied. Insufficient permissions.</div>;
      case 'assignment':
        return hasPermission(['admin', 'hr', 'manager']) ? 
          <SimpleAssignment /> :
          <div className="p-8 text-center text-muted-foreground">Access denied. Insufficient permissions.</div>;
      case 'settings':
        return hasPermission(['admin', 'hr']) ? 
          <MasterData /> :
          <div className="p-8 text-center text-muted-foreground">Access denied. Insufficient permissions.</div>;
      default:
        return <DashboardHome selectedDate={selectedDate} onDateChange={setSelectedDate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}