import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import EmployeeDashboard from "@/pages/EmployeeDashboard";
import CustomerDashboard from "@/pages/CustomerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import TicketDetailsPage from "@/pages/TicketDetailsPage";
import { useAuth } from "@/hooks/useAuth";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Switch>
        <Route path="/" component={HomePage} />
        
        {/* Protected routes */}
        {user?.role === 'employee' && <Route path="/employee-dashboard" component={EmployeeDashboard} />}
        {user?.role === 'customer' && <Route path="/customer-dashboard" component={CustomerDashboard} />}
        {user?.role === 'admin' && <Route path="/admin-dashboard" component={AdminDashboard} />}
        
        {/* Ticket details page accessible to all authenticated users */}
        {user && <Route path="/tickets/:id" component={TicketDetailsPage} />}
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
