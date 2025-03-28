import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { TicketTable } from "@/components/dashboard/TicketTable";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Ticket } from "@shared/schema";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function CustomerDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [ticketModalOpen, setTicketModalOpen] = useState(false);

  // Redirect if not logged in or not a customer
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.role !== "customer" && user.role !== "admin") {
      navigate("/");
      toast({
        title: "Access denied",
        description: "You don't have permission to access the customer dashboard",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  // Fetch tickets
  const { data: tickets, isLoading: isLoadingTickets } = useQuery<Ticket[]>({
    queryKey: ['/api/tickets/my'],
    enabled: !!user && (user.role === "customer" || user.role === "admin"),
  });

  // Navigation items for customer dashboard
  const navItems = [
    { icon: "home", label: "Dashboard", href: "/customer-dashboard" },
    { icon: "ticket", label: "My Tickets", href: "/customer-dashboard/tickets" },
    { icon: "desktop", label: "Services", href: "/customer-dashboard/services" },
    { icon: "file-text", label: "Subscriptions", href: "/customer-dashboard/subscriptions" },
    { icon: "user", label: "Profile", href: "/customer-dashboard/profile" },
  ];

  // Quick link cards
  const quickLinks = [
    { 
      icon: "book", 
      title: "Knowledge Base", 
      description: "Access guides, tutorials, and troubleshooting information.", 
      link: "Browse Articles", 
      href: "/customer-dashboard/knowledge" 
    },
    { 
      icon: "file-invoice", 
      title: "Billing & Invoices", 
      description: "View your payment history and download invoice records.", 
      link: "View Invoices", 
      href: "/customer-dashboard/billing" 
    },
    { 
      icon: "headphones", 
      title: "Live Support", 
      description: "Connect with our support team via chat or schedule a call.", 
      link: "Start Chat", 
      href: "#" 
    }
  ];

  if (!user || (user.role !== "customer" && user.role !== "admin")) {
    return null;
  }

  return (
    <DashboardLayout navItems={navItems} title="Customer Dashboard">
      <StatsCards userRole="customer" />
      
      <div className="mb-8">
        <SubscriptionCard />
      </div>
      
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Support Tickets</CardTitle>
          <Button 
            variant="link" 
            onClick={() => navigate("/customer-dashboard/tickets")}
          >
            View All Tickets
          </Button>
        </CardHeader>
        <CardContent>
          <TicketTable 
            tickets={tickets || []} 
            isLoading={isLoadingTickets} 
          />
          
          <div className="mt-6">
            <Button 
              onClick={() => setTicketModalOpen(true)}
              className="bg-secondary hover:bg-secondary/90"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create New Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickLinks.map((item, i) => (
          <Card key={i} className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-secondary" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    {item.icon === "book" && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    )}
                    {item.icon === "file-invoice" && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    )}
                    {item.icon === "headphones" && (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M17 21h-2a2 2 0 01-2-2v-4a2 2 0 012-2h2M7 21h2a2 2 0 002-2v-4a2 2 0 00-2-2H7" />
                    )}
                  </svg>
                </div>
                <h3 className="text-lg font-medium ml-3">{item.title}</h3>
              </div>
              <p className="text-neutral-600 mb-4">{item.description}</p>
              <a href={item.href} className="text-secondary hover:text-secondary/80 font-medium transition-colors inline-flex items-center">
                {item.link}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* TODO: Add create ticket modal */}
    </DashboardLayout>
  );
}
