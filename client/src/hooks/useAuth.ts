import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface LoginResponse {
  user: User;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check if user is logged in
  const { 
    data: user, 
    error, 
    isLoading, 
    refetch 
  } = useQuery<User>({
    queryKey: ['/api/auth/me'],
    retry: false,
    // Don't show error toast for 401
    throwOnError: (error) => {
      if (error instanceof Response && error.status === 401) {
        return false;
      }
      return true;
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/logout', {});
      return response.json();
    },
    onSuccess: () => {
      // Clear cache and refetch to update user state
      queryClient.clear();
      refetch();
    }
  });

  // Employee login function
  const loginEmployee = async (username: string, password: string): Promise<User> => {
    setIsLoggingIn(true);
    try {
      const response = await apiRequest('POST', '/api/auth/employee/login', { 
        username, 
        password 
      });
      const data: LoginResponse = await response.json();
      // Refetch user data after login
      await refetch();
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Customer login function
  const loginCustomer = async (email: string, password: string): Promise<User> => {
    setIsLoggingIn(true);
    try {
      const response = await apiRequest('POST', '/api/auth/customer/login', { 
        email, 
        password 
      });
      const data: LoginResponse = await response.json();
      // Refetch user data after login
      await refetch();
      return data.user;
    } catch (error) {
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout function
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return {
    user,
    isLoading: isLoading || isLoggingIn,
    isLoggedIn: !!user,
    loginEmployee,
    loginCustomer,
    logout,
    error
  };
}
