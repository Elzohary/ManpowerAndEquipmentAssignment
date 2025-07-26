import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { useAuth } from './AuthContext';
import { Clock, CheckCircle, XCircle, Calendar, Search } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  badgeNumber: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  hoursWorked: number;
  status: 'present' | 'absent' | 'late' | 'partial';
  location: string;
}

// Mock attendance data
const mockAttendanceData: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Smith',
    badgeNumber: 'EMP001',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:30',
    checkOut: null,
    hoursWorked: 0,
    status: 'present',
    location: 'Main Office'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Jane Doe',
    badgeNumber: 'EMP002',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:15',
    checkOut: null,
    hoursWorked: 0,
    status: 'late',
    location: 'Project Site A'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Mike Johnson',
    badgeNumber: 'EMP003',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:00',
    checkOut: '17:00',
    hoursWorked: 9,
    status: 'present',
    location: 'Project Site B'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'present':
      return 'default';
    case 'late':
      return 'secondary';
    case 'absent':
      return 'destructive';
    case 'partial':
      return 'outline';
    default:
      return 'default';
  }
};

export function AttendanceTracker() {
  const { user, hasPermission } = useAuth();
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredAttendance = attendanceData.filter(record => 
    record.date === selectedDate &&
    (record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     record.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCheckIn = () => {
    if (!user) return;
    
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    
    const existingRecord = attendanceData.find(record => 
      record.badgeNumber === user.badgeNumber && record.date === selectedDate
    );

    if (existingRecord && !existingRecord.checkIn) {
      setAttendanceData(prev => prev.map(record => 
        record.id === existingRecord.id 
          ? { 
              ...record, 
              checkIn: timeString, 
              status: now.getHours() > 9 ? 'late' : 'present',
              location: 'Main Office'
            }
          : record
      ));
    } else if (!existingRecord) {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        employeeId: user.id,
        employeeName: user.name,
        badgeNumber: user.badgeNumber,
        date: selectedDate,
        checkIn: timeString,
        checkOut: null,
        hoursWorked: 0,
        status: now.getHours() > 9 ? 'late' : 'present',
        location: 'Main Office'
      };
      setAttendanceData(prev => [...prev, newRecord]);
    }
  };

  const handleCheckOut = () => {
    if (!user) return;
    
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    
    setAttendanceData(prev => prev.map(record => {
      if (record.badgeNumber === user.badgeNumber && record.date === selectedDate && record.checkIn) {
        const checkInTime = new Date(`2024-01-01 ${record.checkIn}`);
        const checkOutTime = new Date(`2024-01-01 ${timeString}`);
        const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
        
        return {
          ...record,
          checkOut: timeString,
          hoursWorked: Math.round(hoursWorked * 100) / 100
        };
      }
      return record;
    }));
  };

  const myAttendance = attendanceData.find(record => 
    user && record.badgeNumber === user.badgeNumber && record.date === selectedDate
  );

  const presentCount = filteredAttendance.filter(r => r.status === 'present' || r.status === 'late').length;
  const absentCount = filteredAttendance.filter(r => r.status === 'absent').length;
  const totalHours = filteredAttendance.reduce((sum, r) => sum + r.hoursWorked, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Attendance Tracker</h1>
          <p className="text-muted-foreground">
            Current Time: {currentTime.toLocaleTimeString()}
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

      {/* Personal Check-in/out Card (for employees) */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              My Attendance - {user.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                {myAttendance ? (
                  <>
                    <div className="flex items-center gap-4">
                      <Badge variant={getStatusColor(myAttendance.status)}>
                        {myAttendance.status.toUpperCase()}
                      </Badge>
                      {myAttendance.checkIn && (
                        <span className="text-sm">Check-in: {myAttendance.checkIn}</span>
                      )}
                      {myAttendance.checkOut && (
                        <span className="text-sm">Check-out: {myAttendance.checkOut}</span>
                      )}
                    </div>
                    {myAttendance.hoursWorked > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Hours worked: {myAttendance.hoursWorked}h
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground">No attendance record for today</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleCheckIn}
                  disabled={myAttendance?.checkIn != null}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Check In
                </Button>
                <Button 
                  onClick={handleCheckOut}
                  disabled={!myAttendance?.checkIn || myAttendance?.checkOut != null}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Check Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      {hasPermission(['admin', 'hr', 'manager']) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Present Today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Absent Today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {presentCount > 0 ? (totalHours / presentCount).toFixed(1) : '0'}h
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Table */}
      {hasPermission(['admin', 'hr', 'manager']) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daily Attendance</CardTitle>
                <CardDescription>Attendance records for {selectedDate}</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {record.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{record.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{record.badgeNumber}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{record.checkIn || 'Not checked in'}</TableCell>
                    <TableCell>{record.checkOut || 'Working'}</TableCell>
                    <TableCell>{record.hoursWorked > 0 ? `${record.hoursWorked}h` : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}