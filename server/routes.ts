import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { isAuthenticated, hasRole, isEmployee, isCustomer, isAdmin, addUserToLocals } from "./middleware/auth";
import { activeDirectory } from "./auth/active-directory";
import { registerCustomer, loginCustomer, hashPassword } from "./auth/customer-auth";
import { employeeLoginSchema } from "@shared/schema";
import { ticketController } from "./controllers/ticketController";
import { userController } from "./controllers/userController";
import session from "express-session";
import { z } from "zod";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  const MemoryStoreClass = MemoryStore(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'tecknet-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new MemoryStoreClass({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));

  // Add user to res.locals for use in responses
  app.use(addUserToLocals);

  // API routes
  app.use('/api', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  // Auth routes
  app.post('/api/auth/employee/login', async (req, res) => {
    try {
      const { username, password } = employeeLoginSchema.parse(req.body);
      
      // Authenticate against Active Directory
      const adUser = await activeDirectory.authenticate(username, password);
      
      if (!adUser) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
      
      // Find or create the user in our system
      const user = await activeDirectory.findOrCreateUser(adUser);
      
      // Store user in session
      req.session.user = user;
      
      // Don't return the password field
      const { password: _, ...userResponse } = user;
      
      res.json({ user: userResponse });
    } catch (error) {
      console.error('Employee login error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Login failed' });
    }
  });

  app.post('/api/auth/customer/login', async (req, res) => {
    try {
      const user = await loginCustomer(req.body);
      
      // Store user in session
      req.session.user = user;
      
      // Don't return the password field
      const { password: _, ...userResponse } = user;
      
      res.json({ user: userResponse });
    } catch (error) {
      console.error('Customer login error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Login failed' });
    }
  });

  app.post('/api/auth/customer/register', async (req, res) => {
    try {
      const user = await registerCustomer(req.body);
      
      // Don't return the password field
      const { password: _, ...userResponse } = user;
      
      res.status(201).json({ 
        user: userResponse,
        message: 'Registration successful. Your account is pending approval by an administrator.'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', isAuthenticated, userController.getCurrentUser);

  // User routes
  app.get('/api/users', isAuthenticated, isAdmin, userController.getAllUsers);
  app.get('/api/users/pending', isAuthenticated, isAdmin, userController.getPendingUsers);
  app.post('/api/users', isAuthenticated, isAdmin, userController.createUser);
  app.patch('/api/users/:id', isAuthenticated, userController.updateUser);
  app.post('/api/users/:id/approve', isAuthenticated, isAdmin, userController.approveUser);

  // App links routes (for employees)
  app.get('/api/app-links', isAuthenticated, isEmployee, userController.getAppLinks);

  // Ticket routes
  app.get('/api/tickets', isAuthenticated, ticketController.getAllTickets);
  app.get('/api/tickets/my', isAuthenticated, ticketController.getUserTickets);
  app.get('/api/tickets/stats', isAuthenticated, ticketController.getTicketStats);
  app.get('/api/tickets/:id', isAuthenticated, ticketController.getTicket);
  app.post('/api/tickets', isAuthenticated, ticketController.createTicket);
  app.patch('/api/tickets/:id', isAuthenticated, ticketController.updateTicket);
  app.post('/api/tickets/:id/comments', isAuthenticated, ticketController.addComment);

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
