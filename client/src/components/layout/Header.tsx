import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, UserCircle } from 'lucide-react';

export function Header() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState<'employee' | 'customer' | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const openLoginModal = (type: 'employee' | 'customer') => {
    setLoginModalOpen(type);
  };

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
  };

  const getDashboardLink = () => {
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
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-semibold">
              <span className="text-secondary">Teck</span>
              <span className="text-primary">Net</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`text-neutral-700 hover:text-primary font-medium ${location === '/' ? 'text-primary' : ''}`}>
              Home
            </Link>
            <Link href="/#services" className="text-neutral-700 hover:text-primary font-medium">
              Services
            </Link>
            <Link href="/#about" className="text-neutral-700 hover:text-primary font-medium">
              About
            </Link>
            <Link href="/#portfolio" className="text-neutral-700 hover:text-primary font-medium">
              Portfolio
            </Link>
            <Link href="/#contact" className="text-neutral-700 hover:text-primary font-medium">
              Contact
            </Link>
            
            {/* Login/Portal Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-white flex items-center">
                    <span className="mr-2">
                      {user.firstName ? `${user.firstName}` : user.username}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`${getDashboardLink()}/profile`} className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-white flex items-center">
                    <span>Portal</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => openLoginModal('employee')} className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Employee Login</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openLoginModal('customer')} className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Customer Login</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openRegisterModal} className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Register as Customer</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="py-2 text-neutral-700 hover:text-primary">
                Home
              </Link>
              <Link href="/#services" className="py-2 text-neutral-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Services
              </Link>
              <Link href="/#about" className="py-2 text-neutral-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/#portfolio" className="py-2 text-neutral-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Portfolio
              </Link>
              <Link href="/#contact" className="py-2 text-neutral-700 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <div className="pt-2 border-t border-neutral-200 mt-2">
                {user ? (
                  <>
                    <Link href={getDashboardLink()} className="block py-2 text-neutral-700 hover:text-primary">
                      Dashboard
                    </Link>
                    <Link href={`${getDashboardLink()}/profile`} className="block py-2 text-neutral-700 hover:text-primary">
                      Profile
                    </Link>
                    <button 
                      onClick={logout} 
                      className="block w-full text-left py-2 text-neutral-700 hover:text-primary"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        openLoginModal('employee');
                        setMobileMenuOpen(false);
                      }} 
                      className="block w-full text-left py-2 text-neutral-700 hover:text-primary"
                    >
                      Employee Login
                    </button>
                    <button 
                      onClick={() => {
                        openLoginModal('customer');
                        setMobileMenuOpen(false);
                      }} 
                      className="block w-full text-left py-2 text-neutral-700 hover:text-primary"
                    >
                      Customer Login
                    </button>
                    <button 
                      onClick={() => {
                        openRegisterModal();
                        setMobileMenuOpen(false);
                      }} 
                      className="block w-full text-left py-2 text-neutral-700 hover:text-primary"
                    >
                      Register as Customer
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modals */}
      <LoginModal 
        type={loginModalOpen} 
        isOpen={loginModalOpen !== null} 
        onClose={() => setLoginModalOpen(null)} 
      />
      
      <RegisterModal 
        isOpen={registerModalOpen} 
        onClose={() => setRegisterModalOpen(false)} 
      />
    </header>
  );
}
