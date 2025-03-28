import { customerRegistrationSchema, customerLoginSchema, InsertUser, User } from '@shared/schema';
import { storage } from '../storage';
import crypto from 'crypto';
import { ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Hash password
export function hashPassword(password: string): string {
  // In a real app, use a proper password hashing library like bcrypt
  // This is a simple hash for demonstration purposes
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Verify password
export function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  const hashed = hashPassword(plainPassword);
  return hashed === hashedPassword;
}

// Register a new customer
export async function registerCustomer(userData: any): Promise<User> {
  try {
    // Validate the customer registration data
    const validData = customerRegistrationSchema.parse(userData);
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(validData.email);
    if (existingUser) {
      throw new Error('A user with this email already exists');
    }
    
    // Create the new user
    const newUser: InsertUser = {
      username: validData.email.split('@')[0], // Create username from email
      email: validData.email,
      password: hashPassword(validData.password),
      firstName: validData.firstName,
      lastName: validData.lastName,
      company: validData.company,
      phone: validData.phone,
      role: 'customer',
      status: 'pending', // New customers are pending until approved
      isAdUser: false
    };
    
    return await storage.createUser(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

// Login a customer
export async function loginCustomer(credentials: any): Promise<User> {
  try {
    // Validate the customer login data
    const validData = customerLoginSchema.parse(credentials);
    
    // Get the user
    const user = await storage.getUserByEmail(validData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check if user is active
    if (user.status !== 'active') {
      throw new Error('Your account is not active. Please contact support.');
    }
    
    // Check if the password is correct
    if (!verifyPassword(validData.password, user.password || '')) {
      throw new Error('Invalid email or password');
    }
    
    return user;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
}

// Middleware to check if user has a specific role
export function hasRole(role: string | string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userRole = req.session.user.role;
    const roles = Array.isArray(role) ? role : [role];
    
    if (roles.includes(userRole)) {
      return next();
    }
    
    res.status(403).json({ message: 'Access denied' });
  };
}
