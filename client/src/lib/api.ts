import { apiRequest } from "./queryClient";

export interface AuthResponse {
  user: {
    id: number;
    username: string;
    email?: string;
    fullName?: string;
    companyName?: string;
    role: string;
    status?: string;
  };
  type?: string;
}

export interface RegistrationData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface CustomerLoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface EmployeeLoginData {
  username: string;
  password: string;
}

export interface ApiError {
  message: string;
}

export interface Ticket {
  id: number;
  ticketId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  userId?: number;
  adUserId?: number;
  assignedTo?: number;
  createdAt: Date;
  updatedAt: Date;
  lastUpdated: Date;
}

export interface Subscription {
  id: number;
  userId: number;
  name: string;
  description?: string;
  status: string;
  renewalDate?: Date;
  licenseType?: string;
  subscriptionId: string;
}

export interface ApplicationLink {
  id: number;
  name: string;
  url: string;
  description?: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface TicketStats {
  total: number;
  open: number;
  resolved: number;
  highPriority: number;
}

export interface UserForApproval {
  id: number;
  username: string;
  email: string;
  fullName: string;
  companyName?: string;
  phone?: string;
  createdAt: Date;
}

// Authentication API
export const authApi = {
  // Register a new customer
  register: async (data: RegistrationData): Promise<{ message: string }> => {
    const response = await apiRequest('POST', '/api/auth/register', data);
    return response.json();
  },
  
  // Login as a customer
  customerLogin: async (data: CustomerLoginData): Promise<AuthResponse> => {
    const response = await apiRequest('POST', '/api/auth/login', data);
    return response.json();
  },
  
  // Login as an employee using AD credentials
  employeeLogin: async (data: EmployeeLoginData): Promise<AuthResponse> => {
    const response = await apiRequest('POST', '/api/auth/ad-login', data);
    return response.json();
  },
  
  // Get current user
  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await apiRequest('GET', '/api/me');
    return response.json();
  },
  
  // Logout
  logout: async (): Promise<{ message: string }> => {
    const response = await apiRequest('POST', '/api/auth/logout');
    return response.json();
  }
};

// Ticket API
export const ticketApi = {
  // Get tickets for current user
  getTickets: async (): Promise<{ tickets: Ticket[] }> => {
    const response = await apiRequest('GET', '/api/tickets');
    return response.json();
  },
  
  // Create a ticket
  createTicket: async (data: Partial<Ticket>): Promise<{ ticket: Ticket }> => {
    const response = await apiRequest('POST', '/api/tickets', data);
    return response.json();
  },
  
  // Update a ticket
  updateTicket: async (id: number, data: Partial<Ticket>): Promise<{ ticket: Ticket }> => {
    const response = await apiRequest('PATCH', `/api/tickets/${id}`, data);
    return response.json();
  },
  
  // Calculate ticket stats from ticket list
  calculateStats: (tickets: Ticket[]): TicketStats => {
    return {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
      highPriority: tickets.filter(t => t.priority === 'high' || t.priority === 'critical').length
    };
  }
};

// Zammad integration API
export const zammadApi = {
  // Get tickets from Zammad for current user
  getZammadTickets: async (): Promise<{ tickets: Ticket[] }> => {
    const response = await apiRequest('GET', '/api/tickets'); // Using the Zammad controller
    return response.json();
  },
  
  // Get a specific ticket from Zammad
  getZammadTicket: async (id: string): Promise<{ ticket: Ticket }> => {
    const response = await apiRequest('GET', `/api/tickets/${id}`);
    return response.json();
  },
  
  // Create a ticket in Zammad
  createZammadTicket: async (data: { 
    subject: string; 
    description: string; 
    priority?: 'low' | 'medium' | 'high' | 'critical';
    status?: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  }): Promise<{ ticket: Ticket }> => {
    const response = await apiRequest('POST', '/api/tickets', data);
    return response.json();
  },
  
  // Update a ticket in Zammad
  updateZammadTicket: async (id: number, data: Partial<Ticket>): Promise<{ ticket: Ticket }> => {
    const response = await apiRequest('PATCH', `/api/tickets/${id}`, data);
    return response.json();
  }
};

// Subscription API
export const subscriptionApi = {
  // Get subscriptions for current user
  getSubscriptions: async (): Promise<{ subscriptions: Subscription[] }> => {
    const response = await apiRequest('GET', '/api/subscriptions');
    return response.json();
  }
};

// Application links API
export const appLinkApi = {
  // Get application links
  getApplicationLinks: async (): Promise<{ links: ApplicationLink[] }> => {
    const response = await apiRequest('GET', '/api/application-links');
    return response.json();
  }
};

// Admin API
export const adminApi = {
  // Get pending customers
  getPendingCustomers: async (): Promise<{ users: UserForApproval[] }> => {
    const response = await apiRequest('GET', '/api/admin/pending-customers');
    return response.json();
  },
  
  // Approve a customer
  approveCustomer: async (userId: number): Promise<{ user: UserForApproval }> => {
    const response = await apiRequest('POST', `/api/admin/approve-customer/${userId}`);
    return response.json();
  },
  
  // Reset application links (re-initialize them with the default set)
  resetApplicationLinks: async (): Promise<{ message: string, links: ApplicationLink[] }> => {
    const response = await apiRequest('POST', '/api/admin/reset-app-links');
    return response.json();
  }
};
