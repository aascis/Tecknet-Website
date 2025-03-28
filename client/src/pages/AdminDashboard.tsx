import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import EmployeeSidebar from '@/components/dashboard/EmployeeSidebar';
import TicketStats from '@/components/dashboard/TicketStats';
import TicketTable from '@/components/dashboard/TicketTable';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlusIcon, 
  CheckCircle, 
  XCircle,
  UserPlus,
  UserCheck,
  UserX 
} from 'lucide-react';
import { ticketApi, adminApi, Ticket, UserForApproval } from '@/lib/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch tickets
  const { 
    data: ticketsData, 
    isLoading: isLoadingTickets,
    error: ticketsError
  } = useQuery({ 
    queryKey: ['/api/tickets']
  });

  // Fetch pending customer registrations
  const { 
    data: pendingUsersData, 
    isLoading: isLoadingPendingUsers,
    error: pendingUsersError
  } = useQuery({ 
    queryKey: ['/api/admin/pending-customers']
  });

  // Approve user mutation
  const approveMutation = useMutation({
    mutationFn: (userId: number) => adminApi.approveCustomer(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-customers'] });
      toast({
        title: "Success",
        description: "Customer account has been approved",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve customer",
        variant: "destructive",
      });
    },
  });

  const tickets: Ticket[] = ticketsData?.tickets || [];
  const pendingUsers: UserForApproval[] = pendingUsersData?.users || [];
  
  const ticketStats = ticketApi.calculateStats(tickets);

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle approve customer
  const handleApproveCustomer = (userId: number) => {
    approveMutation.mutate(userId);
  };

  if (isLoadingTickets || isLoadingPendingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (ticketsError || pendingUsersError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">
            {(ticketsError as Error)?.message || (pendingUsersError as Error)?.message || "Failed to load dashboard data"}
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
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="mt-3 sm:mt-0 sm:ml-4">
              <Button className="inline-flex items-center">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pending-users" className="relative">
                Pending Users
                {pendingUsers.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingUsers.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Ticket Stats */}
              <TicketStats 
                total={ticketStats.total}
                pending={ticketStats.open}
                resolved={ticketStats.resolved}
                highPriority={ticketStats.highPriority}
              />

              {/* Recent Tickets */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">All Tickets</h2>
                <TicketTable tickets={tickets} isAdmin={true} />
              </div>
            </TabsContent>
            
            <TabsContent value="pending-users">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Pending Customer Approvals
                  </CardTitle>
                  <CardDescription>
                    Review and approve customer registration requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Company
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Registration Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pendingUsers.map((user) => (
                            <tr key={user.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {user.fullName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.companyName || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.phone || "-"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex items-center text-green-600 hover:text-green-800 border-green-600 hover:border-green-800"
                                    onClick={() => handleApproveCustomer(user.id)}
                                    disabled={approveMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex items-center text-red-600 hover:text-red-800 border-red-600 hover:border-red-800"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
                      <p className="mt-1 text-sm text-gray-500">There are no pending customer registrations to approve.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>View and manage system settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-gray-500">Environment</h3>
                        <p className="mt-1 text-sm text-gray-900">Production</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-gray-500">Server Status</h3>
                        <div className="mt-1 flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          <p className="text-sm text-gray-900">Online</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-gray-500">Database Status</h3>
                        <div className="mt-1 flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                          <p className="text-sm text-gray-900">Connected</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h3 className="text-sm font-medium text-gray-500">Last System Update</h3>
                        <p className="mt-1 text-sm text-gray-900">Today, 8:15 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button variant="outline">View System Logs</Button>
                  <Button>Run Diagnostics</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
