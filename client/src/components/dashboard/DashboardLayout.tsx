import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Icon } from '@/lib/icons';
import { Menu, X } from 'lucide-react';

interface NavItem {
  icon: string;
  label: string;
  href: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  navItems: NavItem[];
}

export function DashboardLayout({ children, title, navItems }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  // Get appropriate dashboard link based on user role
  const getDashboardUrl = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin-dashboard';
      case 'employee':
        return '/employee-dashboard';
      case 'customer':
        return '/customer-dashboard';
      default:
        return '/';
    }
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar (desktop) */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <div className="flex-1 flex flex-col min-h-0 bg-sidebar">
          {/* Sidebar header */}
          <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
            <Link href="/" className="text-xl font-semibold text-sidebar-foreground">
              <span className="text-sidebar-primary">Teck</span>
              <span className="text-sidebar-foreground">Net</span>
            </Link>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* User info */}
            <div className="px-4 py-4 border-b border-sidebar-border">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </div>
                <div className="ml-3 truncate">
                  <div className="text-sm font-medium text-sidebar-primary">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-sidebar-foreground opacity-75">
                    {user?.role === 'employee' ? 'Employee' : user?.role === 'admin' ? 'Administrator' : user?.company}
                  </div>
                </div>
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    location === item.href
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon name={item.icon} className="mr-3 h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="outline" 
              className="w-full border-sidebar-border text-sidebar-foreground hover:text-sidebar-primary hover:border-sidebar-primary" 
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="md:hidden bg-white border-b border-border h-16 flex items-center px-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle menu">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <Link href="/" className="ml-3 text-xl font-semibold">
            <span className="text-secondary">Teck</span>
            <span className="text-primary">Net</span>
          </Link>
        </div>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 bg-background/80 z-50">
            <div className="fixed inset-y-0 left-0 w-64 bg-sidebar">
              {/* Mobile sidebar header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
                <Link href="/" className="text-xl font-semibold text-sidebar-foreground">
                  <span className="text-sidebar-primary">Teck</span>
                  <span className="text-sidebar-foreground">Net</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-primary">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile sidebar content */}
              <div className="flex-1 flex flex-col overflow-y-auto">
                {/* User info */}
                <div className="px-4 py-4 border-b border-sidebar-border">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar">
                      {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-sidebar-primary">{user?.firstName} {user?.lastName}</div>
                      <div className="text-xs text-sidebar-foreground opacity-75">
                        {user?.role === 'employee' ? 'Employee' : user?.role === 'admin' ? 'Administrator' : user?.company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-2 py-4 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        location === item.href
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <Icon name={item.icon} className="mr-3 h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Mobile sidebar footer */}
              <div className="p-4 border-t border-sidebar-border">
                <Button 
                  variant="outline" 
                  className="w-full border-sidebar-border text-sidebar-foreground hover:text-sidebar-primary hover:border-sidebar-primary" 
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <main className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold">{title}</h1>
                {user && (
                  <p className="text-muted-foreground">
                    Welcome, {user.firstName || user.username}
                  </p>
                )}
              </div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
