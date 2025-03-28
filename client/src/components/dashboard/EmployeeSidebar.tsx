import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  TicketIcon, 
  Users, 
  FolderIcon, 
  Settings,
  Database,
  Bug,
  Calendar,
  FileText,
  BarChart,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmployeeSidebarProps {
  activePage: string;
}

const EmployeeSidebar = ({ activePage }: EmployeeSidebarProps) => {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const isAdmin = user?.role === 'admin';
  
  const mainLinks = [
    {
      name: 'Dashboard',
      href: isAdmin ? '/admin-dashboard' : '/employee-dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      id: 'dashboard'
    },
    {
      name: 'Tickets',
      href: '#',
      icon: <TicketIcon className="h-5 w-5" />,
      id: 'tickets'
    },
    {
      name: 'Team',
      href: '#',
      icon: <Users className="h-5 w-5" />,
      id: 'team'
    },
    {
      name: 'Documents',
      href: '#',
      icon: <FolderIcon className="h-5 w-5" />,
      id: 'documents'
    },
    {
      name: 'Settings',
      href: '#',
      icon: <Settings className="h-5 w-5" />,
      id: 'settings'
    }
  ];

  const applicationLinks = [
    {
      name: 'CRM System',
      href: 'https://crm.tecknet.ca',
      icon: <Database className="h-5 w-5" />,
      id: 'crm'
    },
    {
      name: 'Bug Tracker',
      href: 'https://bugs.tecknet.ca',
      icon: <Bug className="h-5 w-5" />,
      id: 'bug-tracker'
    },
    {
      name: 'Calendar',
      href: 'https://calendar.tecknet.ca',
      icon: <Calendar className="h-5 w-5" />,
      id: 'calendar'
    },
    {
      name: 'Documentation',
      href: 'https://docs.tecknet.ca',
      icon: <FileText className="h-5 w-5" />,
      id: 'documentation'
    },
    {
      name: 'Analytics',
      href: 'https://analytics.tecknet.ca',
      icon: <BarChart className="h-5 w-5" />,
      id: 'analytics'
    }
  ];

  return (
    <div className="bg-gray-800 text-white w-64 flex-shrink-0 h-screen flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <Link href="/">
          <a className="flex items-center">
            <div className="h-8 w-8 bg-white rounded flex items-center justify-center mr-2">
              <span className="text-primary font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold">TeckNet</span>
          </a>
        </Link>
      </div>
      
      <nav className="mt-5 flex-grow px-2">
        <div className="space-y-1">
          {mainLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <Link key={link.id} href={link.href}>
                <a className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}>
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </a>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-10">
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Applications
          </h3>
          <div className="mt-3 space-y-1">
            {applicationLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <span className="mr-3">{link.icon}</span>
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {(user?.fullName || user?.username || "").split(" ").map(n => n[0]).join("").toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
            <p className="text-xs font-medium text-gray-300">{isAdmin ? 'Administrator' : 'Employee'}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white flex items-center justify-center"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
