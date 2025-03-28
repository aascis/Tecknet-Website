import { 
  User, InsertUser, users,
  Subscription, InsertSubscription, subscriptions,
  Ticket, InsertTicket, tickets,
  TicketComment, InsertTicketComment, ticketComments,
  AppLink, InsertAppLink, appLinks
} from "@shared/schema";

// Storage interface for all database operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  listPendingUsers(): Promise<User[]>;
  
  // Subscription operations
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionsByUserId(userId: number): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, subscription: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  
  // Ticket operations
  getTicket(id: number): Promise<Ticket | undefined>;
  getTicketsByUserId(userId: number): Promise<Ticket[]>;
  getTicketsByStatus(status: string): Promise<Ticket[]>;
  getOpenTickets(): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  
  // Ticket comment operations
  getTicketComments(ticketId: number): Promise<TicketComment[]>;
  createTicketComment(comment: InsertTicketComment): Promise<TicketComment>;
  
  // App link operations
  getAppLink(id: number): Promise<AppLink | undefined>;
  listAppLinks(): Promise<AppLink[]>;
  createAppLink(appLink: InsertAppLink): Promise<AppLink>;
  updateAppLink(id: number, appLink: Partial<InsertAppLink>): Promise<AppLink | undefined>;
  deleteAppLink(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private subscriptionsData: Map<number, Subscription>;
  private ticketsData: Map<number, Ticket>;
  private ticketCommentsData: Map<number, TicketComment>;
  private appLinksData: Map<number, AppLink>;
  
  private userId: number;
  private subscriptionId: number;
  private ticketId: number;
  private commentId: number;
  private appLinkId: number;

  constructor() {
    this.usersData = new Map();
    this.subscriptionsData = new Map();
    this.ticketsData = new Map();
    this.ticketCommentsData = new Map();
    this.appLinksData = new Map();
    
    this.userId = 1;
    this.subscriptionId = 1;
    this.ticketId = 1;
    this.commentId = 1;
    this.appLinkId = 1;
    
    // Add default admin user
    this.createUser({
      username: 'admin',
      password: 'admin123', // In a real app, this would be hashed
      email: 'admin@tecknet.ca',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active',
      isAdUser: false
    });
    
    // Add default app links
    this.createAppLink({
      name: 'Document Manager',
      url: 'https://docs.tecknet.ca',
      icon: 'file',
      description: 'Access and manage company documents'
    });
    
    this.createAppLink({
      name: 'Resource Scheduler',
      url: 'https://scheduler.tecknet.ca',
      icon: 'calendar',
      description: 'Schedule and manage resources'
    });
    
    this.createAppLink({
      name: 'Project Portal',
      url: 'https://projects.tecknet.ca',
      icon: 'project-diagram',
      description: 'Track and manage projects'
    });
    
    this.createAppLink({
      name: 'Task Manager',
      url: 'https://tasks.tecknet.ca',
      icon: 'tasks',
      description: 'Manage tasks and to-dos'
    });
    
    this.createAppLink({
      name: 'Knowledge Base',
      url: 'https://kb.tecknet.ca',
      icon: 'book',
      description: 'Access company knowledge base'
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    
    // Explicitly build the User object with defaults for all fields
    const newUser: User = {
      id,
      username: user.username,
      email: user.email,
      password: user.password ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      company: user.company ?? null,
      phone: user.phone ?? null,
      role: user.role ?? 'customer',
      status: user.status ?? 'pending',
      isAdUser: user.isAdUser ?? false,
      createdAt: new Date() 
    };
    
    this.usersData.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.usersData.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...userData
    };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }

  async listUsers(): Promise<User[]> {
    return Array.from(this.usersData.values());
  }

  async listPendingUsers(): Promise<User[]> {
    return Array.from(this.usersData.values()).filter(
      (user) => user.status === 'pending'
    );
  }

  // Subscription operations
  async getSubscription(id: number): Promise<Subscription | undefined> {
    return this.subscriptionsData.get(id);
  }

  async getSubscriptionsByUserId(userId: number): Promise<Subscription[]> {
    return Array.from(this.subscriptionsData.values()).filter(
      (subscription) => subscription.userId === userId
    );
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = this.subscriptionId++;
    
    // Explicitly build the Subscription object with defaults for all fields
    const newSubscription: Subscription = {
      id,
      name: subscription.name,
      status: subscription.status,
      userId: subscription.userId ?? null,
      description: subscription.description ?? null,
      renewalDate: subscription.renewalDate ?? null,
      createdAt: new Date()
    };
    
    this.subscriptionsData.set(id, newSubscription);
    return newSubscription;
  }

  async updateSubscription(id: number, subscriptionData: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptionsData.get(id);
    if (!subscription) return undefined;

    const updatedSubscription: Subscription = {
      ...subscription,
      ...subscriptionData
    };
    this.subscriptionsData.set(id, updatedSubscription);
    return updatedSubscription;
  }

  // Ticket operations
  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.ticketsData.get(id);
  }

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return Array.from(this.ticketsData.values()).filter(
      (ticket) => ticket.userId === userId
    );
  }

  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    return Array.from(this.ticketsData.values()).filter(
      (ticket) => ticket.status === status
    );
  }

  async getOpenTickets(): Promise<Ticket[]> {
    return Array.from(this.ticketsData.values()).filter(
      (ticket) => ticket.status !== 'closed'
    );
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const id = this.ticketId++;
    const now = new Date();
    
    // Explicitly build the Ticket object with defaults for all fields
    const newTicket: Ticket = {
      id,
      subject: ticket.subject,
      description: ticket.description,
      userId: ticket.userId,
      status: ticket.status ?? 'open',
      priority: ticket.priority ?? 'medium',
      assignedToId: ticket.assignedToId ?? null,
      createdAt: now,
      updatedAt: now
    };
    
    this.ticketsData.set(id, newTicket);
    return newTicket;
  }

  async updateTicket(id: number, ticketData: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const ticket = this.ticketsData.get(id);
    if (!ticket) return undefined;

    const updatedTicket: Ticket = {
      ...ticket,
      ...ticketData,
      updatedAt: new Date()
    };
    this.ticketsData.set(id, updatedTicket);
    return updatedTicket;
  }

  // Ticket comment operations
  async getTicketComments(ticketId: number): Promise<TicketComment[]> {
    return Array.from(this.ticketCommentsData.values()).filter(
      (comment) => comment.ticketId === ticketId
    );
  }

  async createTicketComment(comment: InsertTicketComment): Promise<TicketComment> {
    const id = this.commentId++;
    
    // Explicitly build the TicketComment object with defaults for all fields
    const newComment: TicketComment = {
      id,
      ticketId: comment.ticketId,
      userId: comment.userId,
      comment: comment.comment,
      createdAt: new Date()
    };
    
    this.ticketCommentsData.set(id, newComment);
    return newComment;
  }

  // App link operations
  async getAppLink(id: number): Promise<AppLink | undefined> {
    return this.appLinksData.get(id);
  }

  async listAppLinks(): Promise<AppLink[]> {
    return Array.from(this.appLinksData.values());
  }

  async createAppLink(appLink: InsertAppLink): Promise<AppLink> {
    const id = this.appLinkId++;
    
    // Explicitly build the AppLink object with defaults for all fields
    const newAppLink: AppLink = {
      id,
      name: appLink.name,
      url: appLink.url,
      icon: appLink.icon,
      description: appLink.description ?? null,
      createdAt: new Date()
    };
    
    this.appLinksData.set(id, newAppLink);
    return newAppLink;
  }

  async updateAppLink(id: number, appLinkData: Partial<InsertAppLink>): Promise<AppLink | undefined> {
    const appLink = this.appLinksData.get(id);
    if (!appLink) return undefined;

    const updatedAppLink: AppLink = {
      ...appLink,
      ...appLinkData
    };
    this.appLinksData.set(id, updatedAppLink);
    return updatedAppLink;
  }

  async deleteAppLink(id: number): Promise<boolean> {
    return this.appLinksData.delete(id);
  }
}

// Export a singleton instance of the storage
export const storage = new MemStorage();
