import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import EmployeeSidebar from '@/components/dashboard/EmployeeSidebar';
import TicketStats from '@/components/dashboard/TicketStats';
import TicketTable from '@/components/dashboard/TicketTable';
import AppLinkCard from '@/components/dashboard/AppLinkCard';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { ticketApi, appLinkApi, ApplicationLink, Ticket } from '@/lib/api';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch tickets
  const { 
    data: ticketsData, 
    isLoading: isLoadingTickets,
    error: ticketsError
  } = useQuery({ 
    queryKey: ['/api/tickets'],
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Fetch application links
  const { 
    data: appLinksData, 
    isLoading: isLoadingAppLinks,
    error: appLinksError
  } = useQuery({ 
    queryKey: ['/api/application-links']
  });

  const tickets: Ticket[] = ticketsData?.tickets || [];
  const appLinks: ApplicationLink[] = appLinksData?.links || [];
  
  const ticketStats = ticketApi.calculateStats(tickets);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoadingTickets || isLoadingAppLinks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (ticketsError || appLinksError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">
            {(ticketsError as Error)?.message || (appLinksError as Error)?.message || "Failed to load dashboard data"}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar - hidden on mobile */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block fixed inset-0 z-20 md:relative md:z-0`}>
        <EmployeeSidebar activePage="dashboard" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button className="md:hidden text-gray-500 focus:outline-none" onClick={toggleMobileMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex-1"></div>

            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="hidden md:block mr-3 text-sm font-medium text-gray-700">
                    {user?.fullName || user?.username}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {(user?.fullName || user?.username || "").split(" ").map(n => n[0]).join("").toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <Button className="inline-flex items-center">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </div>
          </div>

          {/* Application Links */}
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Applications</h2>
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {appLinks.map((app) => (
                <AppLinkCard 
                  key={app.id}
                  name={app.name}
                  icon={app.icon}
                  url={app.url}
                />
              ))}
            </div>
          </div>

          {/* Ticket Stats */}
          <TicketStats 
            total={ticketStats.total}
            pending={ticketStats.open}
            resolved={ticketStats.resolved}
            highPriority={ticketStats.highPriority}
          />

          {/* Recent Tickets */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Recent Tickets</h2>
            <TicketTable tickets={tickets} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
