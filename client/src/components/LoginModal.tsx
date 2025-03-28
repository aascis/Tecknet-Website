import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { employeeLoginSchema, customerLoginSchema } from '@shared/schema';
import { useLocation } from 'wouter';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
};

const employeeLoginFormSchema = employeeLoginSchema;
const customerLoginFormSchema = customerLoginSchema;

const LoginModal = ({ isOpen, onClose, onRegisterClick }: LoginModalProps) => {
  const [activeTab, setActiveTab] = useState('employee');
  const { toast } = useToast();
  const { loginCustomer, loginEmployee } = useAuth();
  const [, setLocation] = useLocation();

  // Employee login form
  const employeeForm = useForm<z.infer<typeof employeeLoginFormSchema>>({
    resolver: zodResolver(employeeLoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Customer login form
  const customerForm = useForm<z.infer<typeof customerLoginFormSchema>>({
    resolver: zodResolver(customerLoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onEmployeeSubmit = async (data: z.infer<typeof employeeLoginFormSchema>) => {
    try {
      const success = await loginEmployee(data);
      if (success) {
        onClose();
        toast({
          title: 'Login successful',
          description: 'Welcome back to TeckNet!',
        });
        
        // Navigate to employee dashboard
        if (data.username === 'admin') {
          setLocation('/admin-dashboard');
        } else {
          setLocation('/employee-dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
    }
  };

  const onCustomerSubmit = async (data: z.infer<typeof customerLoginFormSchema>) => {
    try {
      const success = await loginCustomer(data);
      if (success) {
        onClose();
        toast({
          title: 'Login successful',
          description: 'Welcome back to TeckNet!',
        });
        
        // Navigate to customer dashboard
        setLocation('/customer-dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Login to TeckNet</DialogTitle>
          <DialogDescription>
            Access your account or register for a new one.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="employee" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employee">Employee Login</TabsTrigger>
            <TabsTrigger value="customer">Customer Login</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employee" className="mt-4">
            <Form {...employeeForm}>
              <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-4">
                <FormField
                  control={employeeForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your AD username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={employeeForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full mt-4">
                  Sign In with AD
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="customer" className="mt-4">
            <Form {...customerForm}>
              <form onSubmit={customerForm.handleSubmit(onCustomerSubmit)} className="space-y-4">
                <FormField
                  control={customerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={customerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between">
                  <FormField
                    control={customerForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange} 
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Remember me</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <a href="#" className="text-sm font-medium text-primary hover:text-primary-dark">
                    Forgot password?
                  </a>
                </div>
                
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={onRegisterClick}
                >
                  Register Account
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
