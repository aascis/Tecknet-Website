import { 
  users, 
  adUsers,
  tickets,
  subscriptions,
  applicationLinks,
  type User, 
  type InsertUser,
  type ADUser,
  type InsertADUser,
  type Ticket,
  type InsertTicket,
  type Subscription,
  type InsertSubscription,
  type ApplicationLink,
  type InsertApplicationLink
} from "@shared/schema";
import { nanoid } from "nanoid";

// Interface for all storage operations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getAllPendingUsers(): Promise<User[]>;
  
  // AD User methods
  getADUser(id: number): Promise<ADUser | undefined>;
  getADUserByUsername(username: string): Promise<ADUser | undefined>;
  createADUser(user: InsertADUser): Promise<ADUser>;
  updateADUser(id: number, user: Partial<ADUser>): Promise<ADUser | undefined>;
  
  // Ticket methods
  getTicket(id: number): Promise<Ticket | undefined>;
  getTicketByTicketId(ticketId: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<Ticket>): Promise<Ticket | undefined>;
  getTicketsByUserId(userId: number): Promise<Ticket[]>;
  getTicketsByADUserId(adUserId: number): Promise<Ticket[]>;
  getAllTickets(): Promise<Ticket[]>;
  
  // Subscription methods
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionsByUserId(userId: number): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<Subscription>): Promise<Subscription | undefined>;
  
  // Application Link methods
  getApplicationLink(id: number): Promise<ApplicationLink | undefined>;
  getAllApplicationLinks(): Promise<ApplicationLink[]>;
  createApplicationLink(applicationLink: InsertApplicationLink): Promise<ApplicationLink>;
  updateApplicationLink(id: number, applicationLink: Partial<ApplicationLink>): Promise<ApplicationLink | undefined>;
  clearApplicationLinks(): Promise<void>;
  initializeAndGetApplicationLinks(): Promise<ApplicationLink[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private adUsers: Map<number, ADUser>;
  private tickets: Map<number, Ticket>;
  private subscriptions: Map<number, Subscription>;
  private applicationLinks: Map<number, ApplicationLink>;
  private userId: number;
  private adUserId: number;
  private ticketId: number;
  private subscriptionId: number;
  private applicationLinkId: number;

  constructor() {
    this.users = new Map();
    this.adUsers = new Map();
    this.tickets = new Map();
    this.subscriptions = new Map();
    this.applicationLinks = new Map();
    this.userId = 1;
    this.adUserId = 1;
    this.ticketId = 1;
    this.subscriptionId = 1;
    this.applicationLinkId = 1;

    // Initialize with some application links
    this.initializeApplicationLinks();
  }

  private initializeApplicationLinks() {
    const links: InsertApplicationLink[] = [
      {
        name: "Prometheus",
        url: "https://prometheus.tecknet.ca",
        description: "Monitoring and alerting system",
        icon: "bar-chart-2",
        isActive: true,
        order: 1
      },
      {
        name: "Wazuh",
        url: "https://wazuh.tecknet.ca",
        description: "Security information and event management",
        icon: "shield",
        isActive: true,
        order: 2
      },
      {
        name: "Calendar",
        url: "https://calendar.tecknet.ca",
        description: "Company-wide calendar and scheduling",
        icon: "calendar",
        isActive: true,
        order: 3
      },
      {
        name: "Documentation",
        url: "https://docs.tecknet.ca",
        description: "Product and internal documentation",
        icon: "file-text",
        isActive: true,
        order: 4
      }
    ];

    links.forEach(link => {
      this.createApplicationLink(link);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllPendingUsers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.status === 'pending');
  }

  // AD User methods
  async getADUser(id: number): Promise<ADUser | undefined> {
    return this.adUsers.get(id);
  }

  async getADUserByUsername(username: string): Promise<ADUser | undefined> {
    return Array.from(this.adUsers.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createADUser(insertUser: InsertADUser): Promise<ADUser> {
    const id = this.adUserId++;
    const now = new Date();
    const user: ADUser = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.adUsers.set(id, user);
    return user;
  }

  async updateADUser(id: number, userData: Partial<ADUser>): Promise<ADUser | undefined> {
    const user = await this.getADUser(id);
    if (!user) return undefined;

    const updatedUser: ADUser = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    this.adUsers.set(id, updatedUser);
    return updatedUser;
  }

  // Ticket methods
  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async getTicketByTicketId(ticketId: string): Promise<Ticket | undefined> {
    return Array.from(this.tickets.values()).find(
      (ticket) => ticket.ticketId === ticketId
    );
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.ticketId++;
    const now = new Date();
    const ticketIdPrefix = insertTicket.userId ? 'CS-' : 'TK-';
    const ticketId = insertTicket.ticketId || `${ticketIdPrefix}${nanoid(5)}`;
    
    const ticket: Ticket = { 
      ...insertTicket, 
      id,
      ticketId,
      createdAt: now,
      updatedAt: now,
      lastUpdated: now
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicket(id: number, ticketData: Partial<Ticket>): Promise<Ticket | undefined> {
    const ticket = await this.getTicket(id);
    if (!ticket) return undefined;

    const now = new Date();
    const updatedTicket: Ticket = {
      ...ticket,
      ...ticketData,
      updatedAt: now,
      lastUpdated: now
    };
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.userId === userId
    );
  }

  async getTicketsByADUserId(adUserId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.adUserId === adUserId || ticket.assignedTo === adUserId
    );
  }

  async getAllTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  // Subscription methods
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionsByUserId(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(
      (subscription) => subscription.userId === userId
    );
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionId++;
    const now = new Date();
    const subscription: Subscription = { 
      ...insertSubscription, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = await this.getSubscription(id);
    if (!subscription) return undefined;

    const updatedSubscription: Subscription = {
      ...subscription,
      ...subscriptionData,
      updatedAt: new Date()
    };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  // Application Link methods
  async getApplicationLink(id: number): Promise<ApplicationLink | undefined> {
    return this.applicationLinks.get(id);
  }

  async getAllApplicationLinks(): Promise<ApplicationLink[]> {
    return Array.from(this.applicationLinks.values())
      .filter(link => link.isActive)
      .sort((a, b) => a.order - b.order);
  }

  async createApplicationLink(insertApplicationLink: InsertApplicationLink): Promise<ApplicationLink> {
    const id = this.applicationLinkId++;
    const applicationLink: ApplicationLink = { 
      ...insertApplicationLink, 
      id
    };
    this.applicationLinks.set(id, applicationLink);
    return applicationLink;
  }

  async updateApplicationLink(id: number, applicationLinkData: Partial<ApplicationLink>): Promise<ApplicationLink | undefined> {
    const applicationLink = await this.getApplicationLink(id);
    if (!applicationLink) return undefined;

    const updatedApplicationLink: ApplicationLink = {
      ...applicationLink,
      ...applicationLinkData
    };
    this.applicationLinks.set(id, updatedApplicationLink);
    return updatedApplicationLink;
  }
  
  async clearApplicationLinks(): Promise<void> {
    // Clear all application links
    this.applicationLinks.clear();
    // Reset the application link ID counter
    this.applicationLinkId = 1;
  }
  
  async initializeAndGetApplicationLinks(): Promise<ApplicationLink[]> {
    // Initialize the application links with the latest configuration
    this.initializeApplicationLinks();
    // Return all application links
    return this.getAllApplicationLinks();
  }
}

// Database storage implementation
import { eq, desc, asc, and } from "drizzle-orm";
import { db } from "./db";
import session from "express-session";
import pgSession from "connect-pg-simple";

const PostgresSessionStore = pgSession(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Ensure default values are set
    const userData = {
      ...insertUser,
      companyName: insertUser.companyName || null,
      phone: insertUser.phone || null,
      role: insertUser.role || 'customer',
      status: insertUser.status || 'pending'
    };
    
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    // Add updatedAt timestamp
    const updateData = {
      ...userData,
      updatedAt: new Date()
    };
    
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async getAllPendingUsers(): Promise<User[]> {
    return db
      .select()
      .from(users)
      .where(eq(users.status, 'pending'));
  }

  // AD User methods
  async getADUser(id: number): Promise<ADUser | undefined> {
    const [user] = await db.select().from(adUsers).where(eq(adUsers.id, id));
    return user;
  }

  async getADUserByUsername(username: string): Promise<ADUser | undefined> {
    const [user] = await db
      .select()
      .from(adUsers)
      .where(eq(adUsers.username, username));
    return user;
  }

  async createADUser(insertUser: InsertADUser): Promise<ADUser> {
    // Ensure default values are set
    const userData = {
      ...insertUser,
      email: insertUser.email || null,
      fullName: insertUser.fullName || null,
      role: insertUser.role || 'employee',
      lastLogin: insertUser.lastLogin || null
    };
    
    const [user] = await db.insert(adUsers).values(userData).returning();
    return user;
  }

  async updateADUser(id: number, userData: Partial<ADUser>): Promise<ADUser | undefined> {
    // Add updatedAt timestamp
    const updateData = {
      ...userData,
      updatedAt: new Date()
    };
    
    const [user] = await db
      .update(adUsers)
      .set(updateData)
      .where(eq(adUsers.id, id))
      .returning();
    return user;
  }

  // Ticket methods
  async getTicket(id: number): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket;
  }

  async getTicketByTicketId(ticketId: string): Promise<Ticket | undefined> {
    const [ticket] = await db
      .select()
      .from(tickets)
      .where(eq(tickets.ticketId, ticketId));
    return ticket;
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const ticketIdPrefix = insertTicket.userId ? 'CS-' : 'TK-';
    const ticketId = insertTicket.ticketId || `${ticketIdPrefix}${nanoid(5)}`;
    
    // Ensure default values are set
    const ticketData = {
      ...insertTicket,
      ticketId,
      status: insertTicket.status || 'open',
      priority: insertTicket.priority || 'medium',
      userId: insertTicket.userId || null,
      adUserId: insertTicket.adUserId || null,
      assignedTo: insertTicket.assignedTo || null
    };
    
    const [ticket] = await db
      .insert(tickets)
      .values(ticketData)
      .returning();
    return ticket;
  }

  async updateTicket(id: number, ticketData: Partial<Ticket>): Promise<Ticket | undefined> {
    // Add updatedAt and lastUpdated timestamps
    const updateData = {
      ...ticketData,
      updatedAt: new Date(),
      lastUpdated: new Date()
    };
    
    const [ticket] = await db
      .update(tickets)
      .set(updateData)
      .where(eq(tickets.id, id))
      .returning();
    return ticket;
  }

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return db
      .select()
      .from(tickets)
      .where(eq(tickets.userId, userId))
      .orderBy(desc(tickets.createdAt));
  }

  async getTicketsByADUserId(adUserId: number): Promise<Ticket[]> {
    return db
      .select()
      .from(tickets)
      .where(
        and(
          eq(tickets.adUserId, adUserId),
          eq(tickets.assignedTo, adUserId)
        )
      )
      .orderBy(desc(tickets.createdAt));
  }

  async getAllTickets(): Promise<Ticket[]> {
    return db
      .select()
      .from(tickets)
      .orderBy(desc(tickets.createdAt));
  }

  // Subscription methods
  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id));
    return subscription;
  }

  async getSubscriptionsByUserId(userId: number): Promise<Subscription[]> {
    return db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(asc(subscriptions.renewalDate));
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    // Ensure default values are set
    const subscriptionData = {
      ...insertSubscription,
      description: insertSubscription.description || null,
      renewalDate: insertSubscription.renewalDate || null,
      licenseType: insertSubscription.licenseType || null
    };
    
    const [subscription] = await db
      .insert(subscriptions)
      .values(subscriptionData)
      .returning();
    return subscription;
  }

  async updateSubscription(id: number, subscriptionData: Partial<Subscription>): Promise<Subscription | undefined> {
    // Add updatedAt timestamp
    const updateData = {
      ...subscriptionData,
      updatedAt: new Date()
    };
    
    const [subscription] = await db
      .update(subscriptions)
      .set(updateData)
      .where(eq(subscriptions.id, id))
      .returning();
    return subscription;
  }

  // Application Link methods
  async getApplicationLink(id: number): Promise<ApplicationLink | undefined> {
    const [link] = await db
      .select()
      .from(applicationLinks)
      .where(eq(applicationLinks.id, id));
    return link;
  }

  async getAllApplicationLinks(): Promise<ApplicationLink[]> {
    return db
      .select()
      .from(applicationLinks)
      .where(eq(applicationLinks.isActive, true))
      .orderBy(asc(applicationLinks.order));
  }

  async createApplicationLink(insertApplicationLink: InsertApplicationLink): Promise<ApplicationLink> {
    // Ensure default values are set
    const linkData = {
      ...insertApplicationLink,
      description: insertApplicationLink.description || null,
      isActive: insertApplicationLink.isActive !== undefined ? insertApplicationLink.isActive : true,
      order: insertApplicationLink.order || 0
    };
    
    const [link] = await db
      .insert(applicationLinks)
      .values(linkData)
      .returning();
    return link;
  }

  async updateApplicationLink(id: number, applicationLinkData: Partial<ApplicationLink>): Promise<ApplicationLink | undefined> {
    const [link] = await db
      .update(applicationLinks)
      .set(applicationLinkData)
      .where(eq(applicationLinks.id, id))
      .returning();
    return link;
  }
  
  async clearApplicationLinks(): Promise<void> {
    await db.delete(applicationLinks);
  }
  
  async initializeAndGetApplicationLinks(): Promise<ApplicationLink[]> {
    // Check if links exist
    const existingLinks = await db.select().from(applicationLinks);
    
    if (existingLinks.length === 0) {
      // Initialize with default links
      const links: InsertApplicationLink[] = [
        {
          name: "Prometheus",
          url: "https://prometheus.tecknet.ca",
          description: "Monitoring and alerting system",
          icon: "bar-chart-2",
          isActive: true,
          order: 1
        },
        {
          name: "Wazuh",
          url: "https://wazuh.tecknet.ca",
          description: "Security information and event management",
          icon: "shield",
          isActive: true,
          order: 2
        },
        {
          name: "Calendar",
          url: "https://calendar.tecknet.ca",
          description: "Company-wide calendar and scheduling",
          icon: "calendar",
          isActive: true,
          order: 3
        },
        {
          name: "Documentation",
          url: "https://docs.tecknet.ca",
          description: "Product and internal documentation",
          icon: "file-text",
          isActive: true,
          order: 4
        }
      ];
      
      for (const link of links) {
        await this.createApplicationLink(link);
      }
    }
    
    return this.getAllApplicationLinks();
  }
}

// Export a single instance of the storage
export const storage = new DatabaseStorage();
