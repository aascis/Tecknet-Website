import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  TicketIcon, 
  Package, 
  FileText, 
  UserCircle,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerSidebarProps {
  activePage: string;
}

const CustomerSidebar = ({ activePage }: CustomerSidebarProps) => {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };
  
  const navLinks = [
    {
      name: 'Dashboard',
      href: '/customer-dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      id: 'dashboard'
    },
    {
      name: 'Support Tickets',
      href: '#',
      icon: <TicketIcon className="h-5 w-5" />,
      id: 'tickets'
    },
    {
      name: 'My Subscriptions',
      href: '#',
      icon: <Package className="h-5 w-5" />,
      id: 'subscriptions'
    },
    {
      name: 'Invoices',
      href: '#',
      icon: <FileText className="h-5 w-5" />,
      id: 'invoices'
    },
    {
      name: 'My Profile',
      href: '#',
      icon: <UserCircle className="h-5 w-5" />,
      id: 'profile'
    },
    {
      name: 'Settings',
      href: '#',
      icon: <Settings className="h-5 w-5" />,
      id: 'settings'
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
          {navLinks.map((link) => {
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
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user?.companyName 
                ? user.companyName.split(" ").map(n => n[0]).join("").toUpperCase() 
                : (user?.fullName || "").split(" ").map(n => n[0]).join("").toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{user?.fullName}</p>
            <p className="text-xs font-medium text-gray-300">{user?.companyName}</p>
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

export default CustomerSidebar;
