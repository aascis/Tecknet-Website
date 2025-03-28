import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useToast } from '../hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { 
  authApi, 
  CustomerLoginData, 
  EmployeeLoginData, 
  RegistrationData 
} from '../lib/api';

export type User = {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  companyName?: string;
  role: 'admin' | 'employee' | 'customer';
  status?: string;
};

export type AuthContextType = {
  user: User | null;
  userType: 'customer' | 'employee' | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  registerCustomer: (data: RegistrationData) => Promise<{ success: boolean; message: string }>;
  loginCustomer: (data: CustomerLoginData) => Promise<boolean>;
  loginEmployee: (data: EmployeeLoginData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.ReactNode {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'customer' | 'employee' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const registerCustomer = async (data: RegistrationData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await authApi.register(data);
      return { success: true, message: response.message };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const loginCustomer = async (data: CustomerLoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authApi.customerLogin(data);
      
      if (response.user) {
        setUser(response.user as unknown as User);
        setUserType('customer');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Customer login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginEmployee = async (data: EmployeeLoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authApi.employeeLogin(data);
      
      if (response.user) {
        setUser(response.user as unknown as User);
        setUserType('employee');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Employee login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid AD credentials',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      
      // Clear all queries in the cache
      queryClient.clear();
      
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authApi.getCurrentUser();
      
      if (response.user) {
        setUser(response.user as unknown as User);
        setUserType(response.type as 'customer' | 'employee');
        setIsAuthenticated(true);
        return true;
      } else {
        setUser(null);
        setUserType(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      setUserType(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const contextValue = {
    user,
    userType,
    isLoading,
    isAuthenticated,
    registerCustomer,
    loginCustomer,
    loginEmployee,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}