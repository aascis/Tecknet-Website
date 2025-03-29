import { Request, Response } from 'express';
import { zammadService } from '../services/zammad';
import { storage } from '../storage';
import { InsertTicket } from '@shared/schema';

// Get all tickets for the current user
export async function getTickets(req: Request, res: Response) {
  try {
    const { user, adUser } = req.session as any;
    
    if (!user && !adUser) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Use email from the authenticated user
    const email = user?.email || adUser?.email;
    
    if (!email) {
      return res.status(400).json({ message: 'User email not found' });
    }
    
    // Get tickets from Zammad by user's email
    const zammadTickets = await zammadService.getTicketsByCustomer(email);
    
    // Map Zammad tickets to our internal format
    const tickets = zammadTickets.map(ticket => zammadService.mapZammadToTicket(ticket));
    
    return res.status(200).json({ tickets });
  } catch (error: any) {
    console.error('Error fetching tickets from Zammad:', error);
    return res.status(500).json({ message: `Failed to fetch tickets: ${error.message}` });
  }
}

// Get a specific ticket by ID
export async function getTicketById(req: Request, res: Response) {
  try {
    const { user, adUser } = req.session as any;
    const { id } = req.params;
    
    if (!user && !adUser) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get the ticket from Zammad
    const zammadTicket = await zammadService.getTicket(id);
    
    // Map to our format
    const ticket = zammadService.mapZammadToTicket(zammadTicket);
    
    return res.status(200).json({ ticket });
  } catch (error: any) {
    console.error(`Error fetching ticket ${req.params.id} from Zammad:`, error);
    return res.status(500).json({ message: `Failed to fetch ticket: ${error.message}` });
  }
}

// Create a new ticket
export async function createTicket(req: Request, res: Response) {
  console.log('Zammad controller: createTicket called', req.body);
  try {
    // Get user information from session or request
    const { user, adUser } = req.session as any;
    
    // Check authentication - for now, we'll make this more lenient for testing
    if (!user && !adUser) {
      console.log('No authenticated user found in session');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Determine the user's email and name
    const userEmail = user?.email || adUser?.email;
    const userName = user?.fullName || adUser?.fullName || (user?.username || adUser?.username) || '';
    
    console.log(`Creating ticket for user: ${userName} (${userEmail})`);
    
    // Map the request data to Zammad ticket format
    const ticketData = zammadService.mapTicketToZammad(req.body, userEmail, userName);
    
    // Create the ticket as an agent
    console.log('Calling createTicketAsAgent with data:', JSON.stringify(ticketData, null, 2));
    const zammadTicket = await zammadService.createTicketAsAgent(ticketData, userEmail);
    
    console.log('Zammad ticket created:', zammadTicket.id);
    
    // Create a local ticket record
    const insertTicket: InsertTicket = {
      ticketId: zammadTicket.id.toString(),
      subject: req.body.subject,
      description: req.body.description,
      status: req.body.status || 'open',
      priority: req.body.priority || 'medium',
      userId: user ? user.id : null,
      adUserId: adUser ? adUser.id : null
      // createdAt and updatedAt are handled automatically by the schema
    };
    
    const newTicket = await storage.createTicket(insertTicket);
    console.log('Local ticket record created:', newTicket.id);
    
    res.status(201).json({ ticket: newTicket });
  } catch (error: any) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: `Failed to create ticket: ${error.message}` });
  }
}

// Update an existing ticket
export async function updateTicket(req: Request, res: Response) {
  try {
    const { user, adUser } = req.session as any;
    const { id } = req.params;
    
    if (!user && !adUser) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get the ticket data from the request body
    const ticketData = req.body;
    
    // Get the ticket from our database to get the Zammad ticketId
    const ticket = await storage.getTicket(parseInt(id));
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Determine the user's email and name
    const email = user?.email || adUser?.email;
    const name = user?.fullName || adUser?.fullName || (user?.username || adUser?.username);
    
    if (!email) {
      return res.status(400).json({ message: 'User email not found' });
    }
    
    // Map our updates to Zammad format
    const zammadTicketData = zammadService.mapTicketToZammad(
      { ...ticket, ...ticketData },
      email,
      name
    );
    
    // Update the ticket in Zammad
    await zammadService.updateTicket(ticket.ticketId, zammadTicketData);
    
    // Also update the ticket in our local database
    const updatedTicket = await storage.updateTicket(parseInt(id), {
      ...ticketData
    });
    
    return res.status(200).json({ ticket: updatedTicket });
  } catch (error: any) {
    console.error(`Error updating ticket ${req.params.id} in Zammad:`, error);
    return res.status(500).json({ message: `Failed to update ticket: ${error.message}` });
  }
}