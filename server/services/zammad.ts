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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    console.log(`Making Zammad API request to: ${url}`);
    console.log(`Method: ${method}`);
    
    // Use token authentication exactly like the Python script
    if (this.token) {
      headers['Authorization'] = `Token token=${this.token}`;
      console.log('Using token authentication');
    } else {
      throw new Error('Zammad is not configured. Please set ZAMMAD_URL and ZAMMAD_TOKEN environment variables.');
    }
    
    console.log('Request headers:', JSON.stringify(headers, (key, value) => 
      key === 'Authorization' ? '[HIDDEN]' : value));
    
    if (data) {
      console.log('Request data:', JSON.stringify(data));
    }
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
      });
      
      const responseText = await response.text();
      console.log(`Response status: ${response.status}`);
      console.log(`Response body: ${responseText}`);
      
      if (!response.ok) {
        throw new Error(`Zammad API error (${response.status}): ${responseText}`);
      }
      
      // Parse the response if it's JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.warn('Failed to parse response as JSON:', responseText);
        result = responseText;
      }
      
      return result;
    } catch (error: any) {
      console.error(`Zammad API request failed for ${endpoint}:`, error);
      throw error;
    }
  }
  
  // Get all tickets associated with a customer email
  async getTicketsByCustomer(email: string): Promise<any[]> {
    try {
      // First, we need to find the customer by email
      console.log(`Looking up tickets for customer email: ${email}`);
      const searchResult = await this.request(`/users/search?query=${encodeURIComponent(email)}`);
      
      if (!searchResult || !searchResult.length) {
        console.log(`No customer found with email: ${email}`);
        return []; // No customer found with this email
      }
      
      const customer = searchResult[0];
      console.log(`Found customer with ID: ${customer.id}`);
      
      // Get tickets for this customer
      console.log(`Searching tickets for customer ID: ${customer.id}`);
      const tickets = await this.request(`/tickets/search?query=customer.id:${customer.id}`);
      console.log(`Found ${tickets?.length || 0} tickets`);
      
      return tickets || [];
    } catch (error) {
      console.error(`Error getting tickets for customer ${email}:`, error);
      throw error;
    }
  }
  
  // Get a specific ticket by ID
  async getTicket(ticketId: string): Promise<any> {
    console.log(`Getting ticket with ID: ${ticketId}`);
    return await this.request(`/tickets/${ticketId}`);
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
    
    return await this.request('/tickets', 'POST', ticketPayload);
  }
  
  // Update an existing ticket
  async updateTicket(ticketId: string, ticketData: any): Promise<any> {
    return await this.request(`/tickets/${ticketId}`, 'PUT', ticketData);
  }
  
  // Find or create a customer in Zammad
  async findOrCreateCustomer(userData: {
    email: string;
    firstname?: string;
    lastname?: string;
    organization?: string;
    phone?: string;
  }): Promise<any> {
    try {
      console.log('Finding or creating customer with email:', userData.email);
      
      // Search for the customer
      const searchResult = await this.request(`/users/search?query=${encodeURIComponent(userData.email)}`);
      
      if (searchResult && searchResult.length > 0) {
        console.log('Customer already exists in Zammad:', searchResult[0]);
        return searchResult[0]; // Customer exists
      }
      
      console.log('Creating new customer in Zammad:', userData);
      
      // Create a new customer
      const newCustomer = await this.request('/users', 'POST', {
        email: userData.email,
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        organization: userData.organization || '',
        phone: userData.phone || '',
        role_ids: [3] // Customer role in Zammad
      });
      
      console.log('Customer created in Zammad:', newCustomer);
      return newCustomer;
    } catch (error) {
      console.error(`Error finding or creating customer ${userData.email}:`, error);
      throw error;
    }
  }
  
  // Get user ID by email
  async getUserIdByEmail(email: string): Promise<number | null> {
    try {
      console.log(`Looking up Zammad user ID for email: ${email}`);
      const searchUrl = `/users/search?query=${encodeURIComponent(email)}`;
      const users = await this.request(searchUrl);
      
      if (!users || users.length === 0) {
        console.log(`No user found with email: ${email}`);
        return null;
      }
      
      console.log(`Found user with ID: ${users[0].id} for email: ${email}`);
      return users[0].id;
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error);
      return null;
    }
  }

  // Create ticket as agent with token auth
  async createTicketAsAgent(ticketData: Partial<{
    title: string;
    group_id: string | number;
    customer_id: string | number;
    state_id: string | number;
    priority_id: string | number;
    article: any;
  }>, userEmail?: string): Promise<any> {
    try {
      console.log('Creating ticket with data:', JSON.stringify(ticketData, null, 2));
      
      // If we have a customer email but no customer_id, look up the customer
      if (userEmail && !ticketData.customer_id) {
        const customerId = await this.getUserIdByEmail(userEmail);
        if (customerId) {
          ticketData.customer_id = customerId;
        } else {
          console.log(`Warning: Could not find customer with email ${userEmail}, using default customer_id=2`);
          // Use customer ID 2 as fallback - update this based on your Zammad setup
          ticketData.customer_id = 2;
        }
      }
      
      // Complete the ticket data with defaults if needed
      const completeTicketData = {
        ...ticketData,
        group_id: ticketData.group_id || 1, // Default to the first group
        state_id: ticketData.state_id || 1,  // Default new state
        priority_id: ticketData.priority_id || 2, // Default normal priority
      };
      
      console.log('Sending finalized ticket data:', JSON.stringify(completeTicketData, null, 2));
      return await this.request('/tickets', 'POST', completeTicketData);
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  // Map our ticket format to Zammad format
  mapTicketToZammad(ticket: Partial<Ticket>, userEmail: string, userName: string): any {
    return {
      title: ticket.subject, // Use the subject as the title
      // Don't set customer_id here, we'll set it in createTicketAsAgent after lookup
      article: {
        subject: ticket.subject,
        body: ticket.description,
        content_type: 'text/plain', // or 'text/html' if you want HTML support
        internal: false,
      },
      state_id: this.mapStatusToZammad(ticket.status),
      priority_id: this.mapPriorityToZammad(ticket.priority),
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