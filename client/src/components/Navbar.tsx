import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { isAuthenticated, user, userType, logout } = useAuth();
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleRegisterModalOpen = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const getDashboardPath = () => {
    if (user?.role === 'admin') {
      return '/admin-dashboard';
    } else if (userType === 'employee') {
      return '/employee-dashboard';
    } else {
      return '/customer-dashboard';
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <div className="flex items-center cursor-pointer">
                    <div className="h-8 w-8 bg-primary rounded flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-lg">T</span>
                    </div>
                    <span className="text-xl font-bold text-primary">TeckNet</span>
                  </div>
                </Link>
              </div>
              <div className="hidden sm:flex sm:space-x-8 sm:ml-10">
                <Link href="/">
                  <a className={`${location === '/' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Home
                  </a>
                </Link>
                <Link href="/services">
                  <a className={`${location === '/services' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Services
                  </a>
                </Link>
                <Link href="/solutions">
                  <a className={`${location === '/solutions' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Solutions
                  </a>
                </Link>
                <Link href="/about">
                  <a className={`${location === '/about' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    About Us
                  </a>
                </Link>
                <Link href="/contact">
                  <a className={`${location === '/contact' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                    Contact
                  </a>
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link href={getDashboardPath()}>
                    <Button variant="outline">Dashboard</Button>
                  </Link>
                  <Button onClick={handleLogout}>Log out</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={handleLoginClick}>Log in</Button>
                  <Link href="/contact">
                    <Button>Contact Us</Button>
                  </Link>
                </>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className={`${location === '/' ? 'bg-primary-light border-primary text-white' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Home
              </a>
            </Link>
            <Link href="/services">
              <a className={`${location === '/services' ? 'bg-primary-light border-primary text-white' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Services
              </a>
            </Link>
            <Link href="/solutions">
              <a className={`${location === '/solutions' ? 'bg-primary-light border-primary text-white' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Solutions
              </a>
            </Link>
            <Link href="/about">
              <a className={`${location === '/about' ? 'bg-primary-light border-primary text-white' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                About Us
              </a>
            </Link>
            <Link href="/contact">
              <a className={`${location === '/contact' ? 'bg-primary-light border-primary text-white' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}>
                Contact
              </a>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 flex flex-col space-y-2 px-3">
            {isAuthenticated ? (
              <>
                <Link href={getDashboardPath()}>
                  <Button className="w-full" variant="outline">Dashboard</Button>
                </Link>
                <Button className="w-full" onClick={handleLogout}>Log out</Button>
              </>
            ) : (
              <>
                <Button className="w-full" variant="outline" onClick={handleLoginClick}>Log in</Button>
                <Link href="/contact">
                  <Button className="w-full">Contact Us</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onRegisterClick={handleRegisterModalOpen}
      />
      
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
      />
    </>
  );
};

export default Navbar;
