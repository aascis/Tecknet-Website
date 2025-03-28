import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';

// Login form schemas
const employeeLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

const customerLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type EmployeeLoginFormValues = z.infer<typeof employeeLoginSchema>;
type CustomerLoginFormValues = z.infer<typeof customerLoginSchema>;

interface LoginModalProps {
  type: 'employee' | 'customer' | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ type, isOpen, onClose }: LoginModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { loginEmployee, loginCustomer } = useAuth();
  const [, navigate] = useLocation();

  // Employee login form
  const employeeForm = useForm<EmployeeLoginFormValues>({
    resolver: zodResolver(employeeLoginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  // Customer login form
  const customerForm = useForm<CustomerLoginFormValues>({
    resolver: zodResolver(customerLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Handle employee login
  const handleEmployeeLogin = async (data: EmployeeLoginFormValues) => {
    setIsLoading(true);
    try {
      const user = await loginEmployee(data.username, data.password);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName || user.username}`,
      });
      onClose();
      navigate('/employee-dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle customer login
  const handleCustomerLogin = async (data: CustomerLoginFormValues) => {
    setIsLoading(true);
    try {
      const user = await loginCustomer(data.email, data.password);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName || user.username}`,
      });
      onClose();
      navigate('/customer-dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const title = type === 'employee' ? 'Employee Login' : 'Customer Login';
  const description = type === 'employee' 
    ? 'Sign in with your Windows AD credentials'
    : 'Sign in to your customer portal account';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        {type === 'employee' ? (
          <form onSubmit={employeeForm.handleSubmit(handleEmployeeLogin)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employee-username">Username</Label>
                <Input
                  id="employee-username"
                  type="text"
                  placeholder="john.doe@tecknet.local"
                  {...employeeForm.register('username')}
                />
                {employeeForm.formState.errors.username && (
                  <p className="text-sm text-destructive">{employeeForm.formState.errors.username.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Enter your Windows AD account username</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="employee-password">Password</Label>
                <Input
                  id="employee-password"
                  type="password"
                  {...employeeForm.register('password')}
                />
                {employeeForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{employeeForm.formState.errors.password.message}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="employee-remember-me"
                    {...employeeForm.register('rememberMe')}
                  />
                  <Label htmlFor="employee-remember-me" className="text-sm">Remember me</Label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-primary hover:text-primary/80">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={customerForm.handleSubmit(handleCustomerLogin)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer-email">Email</Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="you@example.com"
                  {...customerForm.register('email')}
                />
                {customerForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{customerForm.formState.errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer-password">Password</Label>
                <Input
                  id="customer-password"
                  type="password"
                  {...customerForm.register('password')}
                />
                {customerForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{customerForm.formState.errors.password.message}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="customer-remember-me"
                    {...customerForm.register('rememberMe')}
                  />
                  <Label htmlFor="customer-remember-me" className="text-sm">Remember me</Label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-primary hover:text-primary/80">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">Don't have an account?</span>{' '}
                <a 
                  href="#" 
                  className="text-primary hover:text-primary/80"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    // Dispatch event to open registration modal
                    const event = new CustomEvent('open-register-modal');
                    window.dispatchEvent(event);
                  }}
                >
                  Register as a customer
                </a>
              </div>
            </div>
          </form>
        )}
        
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            Having trouble?{' '}
            <a href="#contact" className="text-primary hover:text-primary/80" onClick={onClose}>
              Contact Support
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
