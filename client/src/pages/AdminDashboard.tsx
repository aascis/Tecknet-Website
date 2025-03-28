import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TicketTable } from "@/components/dashboard/TicketTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Ticket, User } from "@shared/schema";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.role !== "admin") {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin dashboard",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  // Fetch pending users
  const { data: pendingUsers, isLoading: isLoadingPendingUsers } = useQuery<User[]>({
    queryKey: ['/api/users/pending'],
    enabled: !!user && user.role === "admin",
  });

  // Fetch tickets
  const { data: tickets, isLoading: isLoadingTickets } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets'],
    enabled: !!user && user.role === "admin",
  });

  // Approve user mutation
  const approveMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest('POST', `/api/users/${userId}/approve`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/pending'] });
      toast({
        title: "User approved",
        description: "The user account has been successfully approved.",
      });
      setApproveDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve user",
        variant: "destructive",
      });
    },
  });

  // Navigation items for admin dashboard
  const navItems = [
    { icon: "home", label: "Dashboard", href: "/admin-dashboard" },
    { icon: "users", label: "Users", href: "/admin-dashboard/users" },
    { icon: "ticket", label: "Tickets", href: "/admin-dashboard/tickets" },
    { icon: "bar-chart", label: "Reports", href: "/admin-dashboard/reports" },
    { icon: "settings", label: "Settings", href: "/admin-dashboard/settings" },
    { icon: "user", label: "Profile", href: "/admin-dashboard/profile" },
  ];

  const handleApproveClick = (userId: number) => {
    setSelectedUserId(userId);
    setApproveDialogOpen(true);
  };

  const confirmApprove = () => {
    if (selectedUserId) {
      approveMutation.mutate(selectedUserId);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      <StatsCards userRole="admin" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Pending User Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingPendingUsers ? (
              <div className="h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : !pendingUsers || pendingUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No pending user approvals</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingUsers.map((pendingUser) => (
                      <TableRow key={pendingUser.id}>
                        <TableCell className="font-medium">
                          {pendingUser.firstName} {pendingUser.lastName}
                        </TableCell>
                        <TableCell>{pendingUser.email}</TableCell>
                        <TableCell>{pendingUser.company || "—"}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApproveClick(pendingUser.id)}
                          >
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets?.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-start pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
                    {ticket.status === 'open' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    )}
                    {ticket.status === 'in_progress' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    )}
                    {ticket.status === 'resolved' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#107C10]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium">{ticket.subject}</h4>
                      <Badge className={`badge-status-${ticket.status}`}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Ticket #{ticket.id} • {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                    <div className="flex justify-end">
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="px-0 h-auto" 
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoadingTickets && (
                <div className="h-[200px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
              
              {!isLoadingTickets && (!tickets || tickets.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
            
            {tickets && tickets.length > 0 && (
              <div className="mt-4 text-right">
                <Button 
                  variant="link" 
                  onClick={() => navigate("/admin-dashboard/tickets")}
                >
                  View All Activity
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Open Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketTable 
            tickets={tickets?.filter(ticket => ticket.status === 'open') || []} 
            isLoading={isLoadingTickets} 
          />
        </CardContent>
      </Card>
      
      {/* Approval confirmation dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve User Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this user account? The user will immediately gain access to the customer portal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmApprove} 
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
