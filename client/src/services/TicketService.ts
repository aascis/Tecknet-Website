import { apiRequest } from '@/lib/queryClient';
import { Ticket } from '@shared/schema';

export interface TicketFormData {
  subject: string;
  description: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
}

class TicketService {
  // Get all tickets for the current user
  async getTickets(): Promise<Ticket[]> {
    try {
      const response = await apiRequest('GET', '/api/tickets');
      const data = await response.json();
      return data.tickets || [];
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      throw error;
    }
  }

  // Get a specific ticket by ID
  async getTicketById(id: string): Promise<Ticket> {
    try {
      const response = await apiRequest('GET', `/api/tickets/${id}`);
      const data = await response.json();
      return data.ticket;
    } catch (error) {
      console.error(`Failed to fetch ticket ${id}:`, error);
      throw error;
    }
  }

  // Create a new ticket
  async createTicket(ticketData: TicketFormData): Promise<Ticket> {
    try {
      const response = await apiRequest('POST', '/api/tickets', ticketData);
      const data = await response.json();
      return data.ticket;
    } catch (error) {
      console.error('Failed to create ticket:', error);
      throw error;
    }
  }

  // Update an existing ticket
  async updateTicket(id: number, ticketData: Partial<TicketFormData>): Promise<Ticket> {
    try {
      const response = await apiRequest('PATCH', `/api/tickets/${id}`, ticketData);
      const data = await response.json();
      return data.ticket;
    } catch (error) {
      console.error(`Failed to update ticket ${id}:`, error);
      throw error;
    }
  }
}

export const ticketService = new TicketService();