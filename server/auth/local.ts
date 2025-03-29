import { Request, Response, NextFunction } from "express";
import { compareSync, hashSync } from "bcrypt";
import { storage } from "../storage";
import { customerLoginSchema, customerRegistrationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Salt rounds for password hashing
const SALT_ROUNDS = 10;

// Hash a password
export function hashPassword(password: string): string {
  return hashSync(password, SALT_ROUNDS);
}

// Compare a password with a hash
export function comparePassword(password: string, hash: string): boolean {
  return compareSync(password, hash);
}

// Register a new customer account
export async function registerCustomer(req: Request, res: Response) {
  try {
    // Validate request data
    const validatedData = customerRegistrationSchema.parse(req.body);
    
    // Check if user with email already exists
    const existingUser = await storage.getUserByEmail(validatedData.email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    // Create username from email (before @ symbol)
    const username = validatedData.email.split('@')[0];
    
    // Check if username exists
    const existingUsername = await storage.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    // Create new user with pending status
    const hashedPassword = hashPassword(validatedData.password);
    const newUser = await storage.createUser({
      username,
      email: validatedData.email,
      password: hashedPassword,
      fullName: validatedData.fullName,
      companyName: validatedData.companyName,
      phone: validatedData.phone,
      role: 'customer',
      status: 'pending'
    });
    
    // Return success without user data
    return res.status(201).json({ 
      message: "Registration successful. Your account is pending admin approval." 
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error('Registration error:', error);
    return res.status(500).json({ message: "Server error during registration" });
  }
}

// Login a customer
export async function loginCustomer(req: Request, res: Response) {
  try {
    // Validate request data
    const { email, password } = customerLoginSchema.parse(req.body);
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Check if user is approved
    if (user.status === 'pending') {
      return res.status(403).json({ message: "Your account is pending approval" });
    }
    
    if (user.status === 'inactive') {
      return res.status(403).json({ message: "Your account has been deactivated" });
    }
    
    // Verify password
    if (!comparePassword(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Set user in session (exclude password)
    const { password: _, ...userWithoutPassword } = user;
    if (req.session) {
      req.session.user = userWithoutPassword;
      req.session.isAuthenticated = true;
    }
    
    // Return user data without password
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error('Login error:', error);
    return res.status(500).json({ message: "Server error during login" });
  }
}

// Approve a pending customer
export async function approveCustomer(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const id = parseInt(userId);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    // Find user
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if user is pending
    if (user.status !== 'pending') {
      return res.status(400).json({ message: "User is not pending approval" });
    }
    
    // Update user status to active
    const updatedUser = await storage.updateUser(id, { status: 'active' });
    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user status" });
    }
    
    // Return updated user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Approval error:', error);
    return res.status(500).json({ message: "Server error during user approval" });
  }
}

// Get pending customer registrations
export async function getPendingCustomers(req: Request, res: Response) {
  try {
    // Get all pending users
    const pendingUsers = await storage.getAllPendingUsers();
    
    // Remove passwords from response
    const usersWithoutPasswords = pendingUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return res.status(200).json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error('Get pending users error:', error);
    return res.status(500).json({ message: "Server error retrieving pending users" });
  }
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAuthenticated) {
    // Make sure we have either a local user or an AD user
    if (req.session.user || req.session.adUser) {
      return next();
    }
  }
  return res.status(401).json({ message: "Not authenticated" });
}

// Middleware to check if user is admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session) {
    // Check if local user is admin
    if (req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    
    // Check if AD user is admin
    if (req.session.adUser && req.session.adUser.role === 'admin') {
      return next();
    }
  }
  
  return res.status(403).json({ message: "Not authorized" });
}

// Logout
export function logout(req: Request, res: Response) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      return res.status(200).json({ message: "Logged out successfully" });
    });
  } else {
    return res.status(200).json({ message: "Logged out successfully" });
  }
}
