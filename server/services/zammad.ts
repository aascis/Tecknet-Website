import fetch from 'node-fetch'; // Using ESM import
import { Ticket } from '@shared/schema';

// Check if environment variables are set
const ZAMMAD_URL = process.env.ZAMMAD_URL;
const ZAMMAD_TOKEN = process.env.ZAMMAD_TOKEN;

class ZammadService {
  private baseUrl: string;
  private token: string;

  constructor() {
    if (!ZAMMAD_URL) {
      console.warn('ZAMMAD_URL environment variable is not set. Zammad integration will not work.');
    }
    
    if (!ZAMMAD_TOKEN) {
      console.warn('ZAMMAD_TOKEN environment variable is not set. Zammad integration will not work.');
    }
    
    this.baseUrl = ZAMMAD_URL || '';
    this.token = ZAMMAD_TOKEN || '';
  }

  private async request(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    if (!this.baseUrl || !this.token) {
      throw new Error('Zammad is not configured. Please set ZAMMAD_URL and ZAMMAD_TOKEN environment variables.');
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Token token=${this.token}`,
      'Content-Type': 'application/json'
    };
    
    const options: any = {
      method,
      headers
    };
    
    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Zammad API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      // For DELETE requests or other responses without content
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {};
      }
      
      return await response.json();
    } catch (error: any) {
      console.error(`Zammad API request failed: ${error.message}`);
      throw error;
    }
  }
  
  // Get all tickets associated with a customer email
  async getTicketsByCustomer(email: string): Promise<any[]> {
    try {
      // First, we need to find the customer by email
      const searchResult = await this.request(`/api/v1/users/search?query=${encodeURIComponent(email)}`);
      
      if (!searchResult || !searchResult.length) {
        return []; // No customer found with this email
      }
      
      const customer = searchResult[0];
      
      // Get tickets for this customer
      const tickets = await this.request(`/api/v1/tickets/search?query=customer.id:${customer.id}`);
      
      return tickets || [];
    } catch (error) {
      console.error(`Error getting tickets for customer ${email}:`, error);
      throw error;
    }
  }
  
  // Get a specific ticket by ID
  async getTicket(ticketId: string): Promise<any> {
    return await this.request(`/api/v1/tickets/${ticketId}`);
  }
  
  // Create a new ticket in Zammad
  async createTicket(ticketData: any): Promise<any> {
    // First, make sure the customer exists
    let customerId;
    
    if (ticketData.customer) {
      const customerResult = await this.findOrCreateCustomer({
        email: ticketData.customer.email,
        name: ticketData.customer.name
      });
      customerId = customerResult.id;
    }
    
    // Create the ticket with the customer ID
    const ticketPayload = {
      ...ticketData,
      customer_id: customerId
    };
    
    return await this.request('/api/v1/tickets', 'POST', ticketPayload);
  }
  
  // Update an existing ticket
  async updateTicket(ticketId: string, ticketData: any): Promise<any> {
    return await this.request(`/api/v1/tickets/${ticketId}`, 'PUT', ticketData);
  }
  
  // Find or create a customer in Zammad
  async findOrCreateCustomer(userData: {
    email: string;
    name: string;
  }): Promise<any> {
    try {
      // Search for the customer
      const searchResult = await this.request(`/api/v1/users/search?query=${encodeURIComponent(userData.email)}`);
      
      if (searchResult && searchResult.length > 0) {
        return searchResult[0]; // Customer exists
      }
      
      // Create a new customer
      const newCustomer = await this.request('/api/v1/users', 'POST', {
        email: userData.email,
        firstname: userData.name.split(' ')[0] || '',
        lastname: userData.name.split(' ').slice(1).join(' ') || '',
        role_ids: [3] // Customer role in Zammad
      });
      
      return newCustomer;
    } catch (error) {
      console.error(`Error finding or creating customer ${userData.email}:`, error);
      throw error;
    }
  }
  
  // Map our ticket format to Zammad format
  mapTicketToZammad(ticket: Partial<Ticket>, userEmail: string, userName: string): any {
    return {
      title: ticket.subject,
      customer: {
        email: userEmail,
        name: userName
      },
      article: {
        subject: ticket.subject,
        body: ticket.description,
        type: 'note',
        internal: false,
      },
      state_id: this.mapStatusToZammad(ticket.status),
      priority_id: this.mapPriorityToZammad(ticket.priority)
    };
  }
  
  // Map our status to Zammad status ID
  private mapStatusToZammad(status?: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed'): number {
    switch (status) {
      case 'open':
        return 1; // 'new' in Zammad
      case 'in_progress':
        return 2; // 'open' in Zammad
      case 'pending':
        return 3; // 'pending reminder' in Zammad
      case 'resolved':
        return 4; // 'closed' in Zammad
      case 'closed':
        return 6; // 'closed successful' in Zammad
      default:
        return 1; // Default to 'new'
    }
  }
  
  // Map our priority to Zammad priority ID
  private mapPriorityToZammad(priority?: 'low' | 'medium' | 'high' | 'critical'): number {
    switch (priority) {
      case 'low':
        return 1; // 'low' in Zammad
      case 'medium':
        return 2; // 'normal' in Zammad
      case 'high':
        return 3; // 'high' in Zammad
      case 'critical':
        return 4; // 'very high' in Zammad
      default:
        return 2; // Default to 'normal'
    }
  }
  
  // Map Zammad ticket to our format
  mapZammadToTicket(zammadTicket: any): Partial<Ticket> {
    if (!zammadTicket) {
      return {};
    }
    
    return {
      ticketId: zammadTicket.id?.toString(),
      subject: zammadTicket.title,
      description: this.getTicketDescription(zammadTicket),
      status: this.mapZammadStatusToInternal(zammadTicket.state_id),
      priority: this.mapZammadPriorityToInternal(zammadTicket.priority_id)
    };
  }
  
  // Extract the ticket description from Zammad ticket
  private getTicketDescription(zammadTicket: any): string {
    // Try to get the first article body
    if (zammadTicket.articles && zammadTicket.articles.length > 0) {
      return zammadTicket.articles[0].body || '';
    }
    
    // Fallback to an empty string
    return '';
  }
  
  // Map Zammad status ID to our status
  private mapZammadStatusToInternal(stateId: number): 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed' {
    switch (stateId) {
      case 1: // 'new' in Zammad
        return 'open';
      case 2: // 'open' in Zammad
        return 'in_progress';
      case 3: // 'pending reminder' in Zammad
      case 5: // 'pending close' in Zammad
        return 'pending';
      case 4: // 'closed' in Zammad
      case 6: // 'closed successful' in Zammad
      case 7: // 'closed unsuccessful' in Zammad
        return 'closed';
      default:
        return 'open';
    }
  }
  
  // Map Zammad priority ID to our priority
  private mapZammadPriorityToInternal(priorityId: number): 'low' | 'medium' | 'high' | 'critical' {
    switch (priorityId) {
      case 1: // 'low' in Zammad
        return 'low';
      case 2: // 'normal' in Zammad
        return 'medium';
      case 3: // 'high' in Zammad
        return 'high';
      case 4: // 'very high' in Zammad
        return 'critical';
      default:
        return 'medium';
    }
  }
}

export const zammadService = new ZammadService();