import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  type: 'customer' | 'employee' | 'admin';
}

const ProtectedRoute = ({ children, type }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user, userType } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/');
      return;
    }

    if (!isLoading && isAuthenticated) {
      if (type === 'admin' && user?.role !== 'admin') {
        setLocation('/');
        return;
      }

      if (type === 'employee' && userType !== 'employee') {
        setLocation('/');
        return;
      }

      if (type === 'customer' && userType !== 'customer') {
        setLocation('/');
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, userType, type, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (type === 'admin' && user?.role !== 'admin') {
    return null;
  }

  if (type === 'employee' && userType !== 'employee') {
    return null;
  }

  if (type === 'customer' && userType !== 'customer') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
