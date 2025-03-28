import { Request, Response } from "express";
import { storage } from "../storage";
import { employeeLoginSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Mock AD authentication (in a real app, this would use node-ad-tools or similar)
export async function authenticateWithAD(username: string, password: string): Promise<{
  success: boolean;
  user?: {
    username: string;
    email?: string;
    fullName?: string;
  };
  error?: string;
}> {
  // In a real app, this would validate credentials against AD
  // For this example, we'll simulate successful authentication for specific credentials
  
  // This is just for demo purposes - in a real app you would integrate with Windows Server AD
  if (username === "john.doe" && password === "password123") {
    return {
      success: true,
      user: {
        username: "john.doe",
        email: "john.doe@tecknet.ca",
        fullName: "John Doe"
      }
    };
  } else if (username === "jane.smith" && password === "password123") {
    return {
      success: true,
      user: {
        username: "jane.smith",
        email: "jane.smith@tecknet.ca",
        fullName: "Jane Smith"
      }
    };
  } else if (username === "admin" && password === "admin123") {
    return {
      success: true,
      user: {
        username: "admin",
        email: "admin@tecknet.ca",
        fullName: "Admin User"
      }
    };
  }
  
  return {
    success: false,
    error: "Invalid AD credentials"
  };
}

// Login with AD credentials
export async function loginWithAD(req: Request, res: Response) {
  try {
    // Validate request data
    const { username, password } = employeeLoginSchema.parse(req.body);
    
    // Authenticate with AD
    const adResult = await authenticateWithAD(username, password);
    
    if (!adResult.success || !adResult.user) {
      return res.status(401).json({ message: adResult.error || "Authentication failed" });
    }
    
    // Check if AD user exists in our database
    let adUser = await storage.getADUserByUsername(adResult.user.username);
    
    // If user doesn't exist in our database, create them
    if (!adUser) {
      adUser = await storage.createADUser({
        username: adResult.user.username,
        email: adResult.user.email,
        fullName: adResult.user.fullName,
        role: username === "admin" ? 'admin' : 'employee',
        lastLogin: new Date(),
      });
    } else {
      // Update last login time
      adUser = await storage.updateADUser(adUser.id, { 
        lastLogin: new Date(),
        email: adResult.user.email || adUser.email,
        fullName: adResult.user.fullName || adUser.fullName
      }) || adUser;
    }
    
    // Set user in session
    if (req.session) {
      req.session.adUser = adUser;
      req.session.isAuthenticated = true;
    }
    
    // Return user data
    return res.status(200).json({ user: adUser });
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    console.error('AD Login error:', error);
    return res.status(500).json({ message: "Server error during AD login" });
  }
}

// Check if user is authenticated with AD
export function isADAuthenticated(req: Request, res: Response, next: Function) {
  if (req.session && req.session.isAuthenticated && req.session.adUser) {
    return next();
  }
  return res.status(401).json({ message: "Not authenticated with AD" });
}

// Check if user is an admin
export function isADAdmin(req: Request, res: Response, next: Function) {
  if (req.session && req.session.adUser && req.session.adUser.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: "Not authorized" });
}
