import React, { useState, useEffect } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { employeesService } from '../lib/database';

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'mock' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [employeeCount, setEmployeeCount] = useState<number>(0);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking');
      
      if (!isSupabaseConfigured()) {
        setConnectionStatus('mock');
        // Test mock data
        const employees = await employeesService.getAll();
        setEmployeeCount(employees.length);
        return;
      }

      // Test Supabase connection
      const { data, error } = await supabase
        .from('employees')
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.error('Supabase connection error:', error);
        setErrorMessage(error.message);
        setConnectionStatus('error');
        // Fallback to mock data
        const employees = await employeesService.getAll();
        setEmployeeCount(employees.length);
      } else {
        setConnectionStatus('connected');
        setEmployeeCount(data?.length || 0);
      }
    } catch (err) {
      console.error('Connection test failed:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      setConnectionStatus('error');
      // Fallback to mock data
      const employees = await employeesService.getAll();
      setEmployeeCount(employees.length);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'mock': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return '✅';
      case 'mock': return '⚠️';
      case 'error': return '❌';
      default: return '🔄';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Supabase Connected';
      case 'mock': return 'Using Mock Data';
      case 'error': return 'Supabase Error (Using Mock Data)';
      default: return 'Checking Connection...';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Database Status</h3>
        <button
          onClick={checkConnection}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          disabled={connectionStatus === 'checking'}
        >
          {connectionStatus === 'checking' ? 'Checking...' : 'Refresh'}
        </button>
      </div>
      
      <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
        <span className="text-xl">{getStatusIcon()}</span>
        <span className="font-medium">{getStatusText()}</span>
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        <p>Employee Records: {employeeCount}</p>
        {connectionStatus === 'mock' && (
          <p className="text-yellow-700 mt-1">
            💡 To use Supabase, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file
          </p>
        )}
        {connectionStatus === 'error' && errorMessage && (
          <p className="text-red-700 mt-1">
            Error: {errorMessage}
          </p>
        )}
      </div>
      
      {connectionStatus === 'connected' && (
        <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
          <p className="text-sm text-green-800">
            🎉 Great! Your application is successfully connected to Supabase and ready for production.
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;