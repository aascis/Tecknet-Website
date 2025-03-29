import { Request, Response } from "express";
import { storage } from "../storage";
import { employeeLoginSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

// LDAP Configuration
const LDAP_SERVER = "Grp-4-AD.tecknet.ca";
const LDAP_PORT = 389;

// AD authentication using LDAP-like approach
export async function authenticateWithAD(username: string, password: string): Promise<{
  success: boolean;
  user?: {
    username: string;
    email?: string;
    fullName?: string;
  };
  error?: string;
  networkError?: boolean;
}> {
  console.log(`[AD DEBUG] Attempting to authenticate user: ${username}`);
  
  try {
    // Check if the provided username contains domain
    const usernameOnly = username.includes('@') ? username.split('@')[0] : username;
    
    // Special handling for ashish user
    if (usernameOnly === "ashish") {
      console.log(`[AD DEBUG] Special handling for ashish user`);
      if (password === "asdf123" || password === "Password1") {
        console.log(`[AD DEBUG] Authentication successful for ashish user`);
        return {
          success: true,
          user: {
            username: "ashish",
            email: "ashish@tecknet.ca",
            fullName: "Ashish Shrestha"
          }
        };
      }
    }
    
    // OPTION 1: Allow any username with asdf123 password (for testing)
    if (password === "asdf123") {
      let firstName, lastName, fullName;
      
      if (usernameOnly.includes('.')) {
        [firstName, lastName] = usernameOnly.split('.');
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
        fullName = `${capitalizedFirstName} ${capitalizedLastName}`;
      } else {
        firstName = usernameOnly;
        const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        fullName = capitalizedFirstName;
      }
      
      console.log(`[AD DEBUG] Authentication successful for test user: ${usernameOnly}`);
      return {
        success: true,
        user: {
          username: usernameOnly,
          email: `${usernameOnly}@tecknet.ca`,
          fullName: fullName
        }
      };
    }
    
    // Try to authenticate using LDAP via Python script
    try {
      // Format for LDAP authentication
      const ldapUsername = usernameOnly.includes('@') ? usernameOnly : `${usernameOnly}@tecknet.ca`;
      console.log(`[AD DEBUG] Testing LDAP authentication for ${ldapUsername}`);
      
      // Use actual LDAP authentication here
      // For now, falling back to test credentials
      
    } catch (ldapError) {
      console.error(`[AD DEBUG] LDAP authentication error:`, ldapError);
      // Continue with other authentication methods
    }
    
    // Fallback test users
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
    
    console.log(`[AD DEBUG] Authentication failed for: ${username}`);
    return {
      success: false,
      error: "Invalid AD credentials"
    };
  } catch (error) {
    console.error(`[AD DEBUG] Authentication error for ${username}:`, error);
    return {
      success: false,
      error: "Authentication error",
      networkError: true
    };
  }
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
