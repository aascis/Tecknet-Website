import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { customerLoginSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { zammadService } from "../services/zammad";

// Authenticate a customer using Zammad
export async function authenticateCustomerWithZammad(email: string, password: string): Promise<{
  success: boolean;
  userData?: any;
  error?: string;
}> {
  try {
    console.log(`[ZAMMAD DEBUG] Authenticating customer: ${email}`);
    
    // Call Zammad service to authenticate customer
    const result = await zammadService.authenticateCustomer(email, password);
    
    if (!result || !result.success) {
      console.log(`[ZAMMAD DEBUG] Authentication failed for ${email}`);
      return {
        success: false,
        error: result?.error || "Invalid credentials"
      };
    }
    
    console.log(`[ZAMMAD DEBUG] Authentication successful for ${email}`);
    return {
      success: true,
      userData: result.userData
    };
  } catch (error) {
    console.error(`[ZAMMAD DEBUG] Authentication error for ${email}:`, error);
    return {
      success: false,
      error: "Authentication error"
    };
  }
}

// Login a customer
export async function loginCustomer(req: Request, res: Response) {
  try {
    // Validate request data
    const { email, password } = customerLoginSchema.parse(req.body);
    
    console.log(`[ZAMMAD DEBUG] Login attempt for ${email}`);
    
    // Authenticate with Zammad
    const authResult = await authenticateCustomerWithZammad(email, password);
    
    if (!authResult.success) {
      return res.status(401).json({ message: authResult.error || "Authentication failed" });
    }
    
    // Check if customer exists in our local database
    let customer = await storage.getUserByEmail(email);
    
    // If customer doesn't exist locally but was authenticated in Zammad, create them
    if (!customer) {
      console.log(`[ZAMMAD DEBUG] Creating new customer in database: ${email}`);
      
      // Extract customer details from Zammad
      const zammadUser = authResult.userData;
      const fullName = zammadUser.firstname && zammadUser.lastname 
        ? `${zammadUser.firstname} ${zammadUser.lastname}`
        : zammadUser.email;
      
      // Create customer in local database
      // Note: We're using a placeholder password since auth is handled by Zammad
      customer = await storage.createUser({
        username: email,
        email: email,
        password: "ZAMMAD_AUTH", // Placeholder password - not used for login
        fullName: fullName,
        companyName: zammadUser.organization || null,
        phone: zammadUser.phone || null,
        role: 'customer',
        status: 'active' // Users authenticated via Zammad are automatically active
      });
    }
    
    // Set user in session
    if (req.session) {
      req.session.user = customer;
      req.session.isAuthenticated = true;
      console.log(`[ZAMMAD DEBUG] Session created for ${email}`);
    }
    
    // Return user data without password
    const { password: _password, ...customerData } = customer;
    return res.status(200).json({ user: customerData });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error('[ZAMMAD DEBUG] Customer login error:', error);
    return res.status(500).json({ message: "Server error during login" });
  }
}

// Check if customer is authenticated
export function isCustomerAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAuthenticated && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated" });
}