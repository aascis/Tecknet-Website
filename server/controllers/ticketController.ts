import { Request, Response } from 'express';
import { storage } from '../storage';
import { insertTicketSchema, insertTicketCommentSchema, Ticket, TicketComment } from '@shared/schema';
import { ZodError } from 'zod';

export const ticketController = {
  // Get all tickets (for employees/admins)
  async getAllTickets(req: Request, res: Response) {
    try {
      const tickets = await storage.getOpenTickets();
      res.json(tickets);
    } catch (error) {
      console.error('Error getting tickets:', error);
      res.status(500).json({ message: 'Failed to get tickets' });
    }
  },

  // Get tickets for the current user
  async getUserTickets(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const userId = req.session.user.id;
      const tickets = await storage.getTicketsByUserId(userId);
      res.json(tickets);
    } catch (error) {
      console.error('Error getting user tickets:', error);
      res.status(500).json({ message: 'Failed to get tickets' });
    }
  },

  // Get a specific ticket by ID
  async getTicket(req: Request, res: Response) {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: 'Invalid ticket ID' });
      }

      const ticket = await storage.getTicket(ticketId);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      // If the user is a customer, they can only view their own tickets
      if (req.session.user?.role === 'customer' && ticket.userId !== req.session.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Get the ticket comments
      const comments = await storage.getTicketComments(ticketId);

      res.json({ ticket, comments });
    } catch (error) {
      console.error('Error getting ticket:', error);
      res.status(500).json({ message: 'Failed to get ticket' });
    }
  },

  // Create a new ticket
  async createTicket(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const validData = insertTicketSchema.parse({
        ...req.body,
        userId: req.session.user.id
      });

      const ticket = await storage.createTicket(validData);
      res.status(201).json(ticket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      
      res.status(500).json({ message: 'Failed to create ticket' });
    }
  },

  // Update a ticket
  async updateTicket(req: Request, res: Response) {
    try {
      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: 'Invalid ticket ID' });
      }

      const ticket = await storage.getTicket(ticketId);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      // If the user is a customer, they can only update their own tickets
      if (req.session.user?.role === 'customer' && ticket.userId !== req.session.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Customers can only update certain fields
      let updateData = req.body;
      if (req.session.user?.role === 'customer') {
        // Limit what a customer can update
        const { subject, description } = req.body;
        updateData = { subject, description };
      }

      const updatedTicket = await storage.updateTicket(ticketId, updateData);
      res.json(updatedTicket);
    } catch (error) {
      console.error('Error updating ticket:', error);
      res.status(500).json({ message: 'Failed to update ticket' });
    }
  },

  // Add a comment to a ticket
  async addComment(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const ticketId = parseInt(req.params.id);
      if (isNaN(ticketId)) {
        return res.status(400).json({ message: 'Invalid ticket ID' });
      }

      const ticket = await storage.getTicket(ticketId);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }

      // If the user is a customer, they can only comment on their own tickets
      if (req.session.user.role === 'customer' && ticket.userId !== req.session.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const validData = insertTicketCommentSchema.parse({
        ticketId,
        userId: req.session.user.id,
        comment: req.body.comment
      });

      const comment = await storage.createTicketComment(validData);
      
      // Update the ticket's updated_at field
      await storage.updateTicket(ticketId, {});
      
      res.status(201).json(comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      
      res.status(500).json({ message: 'Failed to add comment' });
    }
  },

  // Get statistics for tickets
  async getTicketStats(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const allTickets = await storage.getOpenTickets();
      const userId = req.session.user.id;
      
      // Get relevant ticket stats based on user role
      if (req.session.user.role === 'customer') {
        // For customers, only show their tickets
        const userTickets = allTickets.filter(ticket => ticket.userId === userId);
        
        const stats = {
          open: userTickets.filter(ticket => ticket.status === 'open').length,
          inProgress: userTickets.filter(ticket => ticket.status === 'in_progress').length,
          resolved: userTickets.filter(ticket => ticket.status === 'resolved').length,
          total: userTickets.length
        };
        
        res.json(stats);
      } else {
        // For employees and admins
        const stats = {
          open: allTickets.filter(ticket => ticket.status === 'open').length,
          inProgress: allTickets.filter(ticket => ticket.status === 'in_progress').length,
          resolved: allTickets.filter(ticket => ticket.status === 'resolved').length,
          highPriority: allTickets.filter(ticket => ticket.priority === 'high').length,
          total: allTickets.length,
          // Tickets assigned to this employee
          assignedToMe: allTickets.filter(ticket => ticket.assignedToId === userId).length
        };
        
        res.json(stats);
      }
    } catch (error) {
      console.error('Error getting ticket stats:', error);
      res.status(500).json({ message: 'Failed to get ticket statistics' });
    }
  }
};
