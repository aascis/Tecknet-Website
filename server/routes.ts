import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as localAuth from "./auth/local";
import * as adAuth from "./auth/ad";
import * as zammadController from "./controllers/zammad-controller";
import session from "express-session";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { insertTicketSchema } from "@shared/schema";

// Generate a secret key for session
const SESSION_SECRET = process.env.SESSION_SECRET || "tecknet-secret-key-change-in-production";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup express-session middleware
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // Auth routes
  app.post("/api/auth/register", localAuth.registerCustomer);
  app.post("/api/auth/login", localAuth.loginCustomer);
  app.post("/api/auth/ad-login", adAuth.loginWithAD);
  app.post("/api/auth/logout", localAuth.logout);
  
  // Customer approval routes (admin only)
  app.get("/api/admin/pending-customers", localAuth.isAuthenticated, localAuth.isAdmin, localAuth.getPendingCustomers);
  app.post("/api/admin/approve-customer/:userId", localAuth.isAuthenticated, localAuth.isAdmin, localAuth.approveCustomer);
  
  // Get current user
  app.get("/api/me", (req: Request, res: Response) => {
    if (req.session && req.session.isAuthenticated) {
      if (req.session.user) {
        const { password, ...userWithoutPassword } = req.session.user;
        return res.json({ user: userWithoutPassword, type: "customer" });
      } else if (req.session.adUser) {
        return res.json({ user: req.session.adUser, type: "employee" });
      }
    }
    return res.status(401).json({ message: "Not authenticated" });
  });
  
  // Application Links routes
  app.get("/api/application-links", adAuth.isADAuthenticated, async (req: Request, res: Response) => {
    try {
      const links = await storage.getAllApplicationLinks();
      return res.json({ links });
    } catch (error) {
      console.error("Error getting application links:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Route to reset application links (admin only)
  app.post("/api/admin/reset-app-links", adAuth.isADAuthenticated, adAuth.isADAdmin, async (req: Request, res: Response) => {
    try {
      // Clear all existing application links
      await storage.clearApplicationLinks();
      
      // Initialize with the new set of links
      const links = await storage.initializeAndGetApplicationLinks();
      
      return res.json({ 
        message: "Application links have been reset", 
        links 
      });
    } catch (error) {
      console.error("Error resetting application links:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Subscription routes
  app.get("/api/subscriptions", localAuth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.session?.user?.id) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const subscriptions = await storage.getSubscriptionsByUserId(req.session.user.id);
      return res.json({ subscriptions });
    } catch (error) {
      console.error("Error getting subscriptions:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Zammad Ticket routes
  app.get("/api/tickets", zammadController.getTickets);
  app.get("/api/tickets/:id", zammadController.getTicketById);
  app.post("/api/tickets", zammadController.createTicket);
  app.patch("/api/tickets/:id", zammadController.updateTicket);
  
  // Legacy ticket routes (can be removed once Zammad integration is complete)
  app.get("/api/local-tickets", async (req: Request, res: Response) => {
    try {
      if (!req.session?.isAuthenticated) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      let tickets;
      
      if (req.session.user) {
        // Customer tickets
        tickets = await storage.getTicketsByUserId(req.session.user.id);
      } else if (req.session.adUser) {
        // Employee or admin tickets
        if (req.session.adUser.role === "admin") {
          // Admin sees all tickets
          tickets = await storage.getAllTickets();
        } else {
          // Employee sees their tickets
          tickets = await storage.getTicketsByADUserId(req.session.adUser.id);
        }
      }
      
      return res.json({ tickets });
    } catch (error) {
      console.error("Error getting tickets:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Initialize demo data (this would not be in a production app)
  await initializeDemoData();

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize demo data for testing
async function initializeDemoData() {
  try {
    // Create admin user
    const adminExists = await storage.getUserByEmail("admin@tecknet.ca");
    if (!adminExists) {
      await storage.createUser({
        username: "admin",
        email: "admin@tecknet.ca",
        password: localAuth.hashPassword("admin123"),
        fullName: "Admin User",
        role: "admin",
        status: "active"
      });
    }
    
    // Create a demo customer
    const customerExists = await storage.getUserByEmail("customer@example.com");
    if (!customerExists) {
      const customer = await storage.createUser({
        username: "customer",
        email: "customer@example.com",
        password: localAuth.hashPassword("customer123"),
        fullName: "Demo Customer",
        companyName: "Acme Corporation",
        phone: "555-1234",
        role: "customer",
        status: "active"
      });
      
      // Create a subscription for the customer
      await storage.createSubscription({
        userId: customer.id,
        name: "Enterprise Software Package",
        description: "Includes CRM, Analytics, and Database Management solutions",
        status: "active",
        renewalDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        licenseType: "25 User Enterprise",
        subscriptionId: "SUB-87293"
      });
      
      // Create some tickets for the customer
      await storage.createTicket({
        ticketId: "CS-4587",
        subject: "Need assistance with CRM data import",
        description: "We're trying to import our customer data but encountering errors.",
        status: "in_progress",
        priority: "medium",
        userId: customer.id
      });
      
      await storage.createTicket({
        ticketId: "CS-4581",
        subject: "Database connection issue after upgrade",
        description: "After upgrading to the latest version, we can't connect to the database.",
        status: "resolved",
        priority: "high",
        userId: customer.id
      });
      
      await storage.createTicket({
        ticketId: "CS-4573",
        subject: "Request for additional user accounts",
        description: "We need to add 5 more users to our subscription.",
        status: "pending",
        priority: "low",
        userId: customer.id
      });
    }
  } catch (error) {
    console.error("Error initializing demo data:", error);
  }
}
