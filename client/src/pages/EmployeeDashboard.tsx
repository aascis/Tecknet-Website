import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TicketTable } from "@/components/dashboard/TicketTable";
import { ApplicationLinks } from "@/components/dashboard/ApplicationLinks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Ticket } from "@shared/schema";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function EmployeeDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Redirect if not logged in or not an employee
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.role !== "employee" && user.role !== "admin") {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access the employee dashboard",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  // Fetch tickets
  const { data: tickets, isLoading: isLoadingTickets } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets'],
    enabled: !!user && (user.role === "employee" || user.role === "admin"),
  });

  // Navigation items for employee dashboard
  const navItems = [
    { icon: "home", label: "Dashboard", href: "/employee-dashboard" },
    { icon: "ticket", label: "Tickets", href: "/employee-dashboard/tickets" },
    { icon: "bar-chart", label: "Reports", href: "/employee-dashboard/reports" },
    { icon: "users", label: "Customers", href: "/employee-dashboard/customers" },
    { icon: "settings", label: "Settings", href: "/employee-dashboard/settings" },
    { icon: "user", label: "Profile", href: "/employee-dashboard/profile" },
  ];

  // Quick actions
  const quickActions = [
    { icon: "plus", title: "Create Ticket", color: "bg-primary/10 text-primary", action: () => setTicketModalOpen(true) },
    { icon: "search", title: "Search Tickets", color: "bg-secondary/10 text-secondary", action: () => navigate("/employee-dashboard/tickets") },
    { icon: "file-text", title: "Export Reports", color: "bg-[#107C10]/10 text-[#107C10]", action: () => navigate("/employee-dashboard/reports") },
  ];

  if (!user || (user.role !== "employee" && user.role !== "admin")) {
    return null;
  }

  return (
    <DashboardLayout navItems={navItems} title="Employee Dashboard">
      <StatsCards userRole="employee" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <TicketTable 
                tickets={tickets?.slice(0, 5) || []} 
                isLoading={isLoadingTickets} 
              />
              {tickets && tickets.length > 5 && (
                <div className="mt-4 text-right">
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/employee-dashboard/tickets")}
                  >
                    View All Tickets
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <ApplicationLinks />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <button 
                key={i}
                onClick={action.action}
                className="flex flex-col items-center justify-center bg-neutral-100 hover:bg-neutral-200 p-4 rounded-lg transition-colors"
              >
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    {action.icon === "plus" && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    )}
                    {action.icon === "search" && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    )}
                    {action.icon === "file-text" && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    )}
                  </svg>
                </div>
                <span className="text-neutral-800 font-medium">{action.title}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* TODO: Add create ticket modal */}
    </DashboardLayout>
  );
}
