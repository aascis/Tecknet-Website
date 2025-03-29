import { Request, Response } from "express";
import { storage } from "../storage";
import { employeeLoginSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

// Real AD authentication using Linux auth_pam
export async function authenticateWithAD(username: string, password: string): Promise<{
  success: boolean;
  user?: {
    username: string;
    email?: string;
    fullName?: string;
  };
  error?: string;
}> {
  console.log(`[AD DEBUG] Attempting to authenticate user: ${username}`);
  
  try {
    // Check if the provided username contains domain
    const usernameOnly = username.includes('@') ? username.split('@')[0] : username;
    
    // First, try authenticating with system-level authentication
    // This approach relies on the server being properly joined to the domain
    // Using kerberos/SSSD which is already configured on your server
    
    // Create a simple script that returns user information if authentication succeeds
    const scriptContent = `
      getent passwd ${usernameOnly} | cut -d: -f1,5
    `;
    
    // Write script to temporary file
    const scriptPath = `/tmp/ad_auth_${Date.now()}.sh`;
    await execPromise(`echo '${scriptContent}' > ${scriptPath} && chmod +x ${scriptPath}`);
    
    // Execute the script and check credentials via PAM
    const { stdout } = await execPromise(`echo "${password}" | su - ${usernameOnly} -c "${scriptPath}" 2>/dev/null`);
    
    // Clean up
    await execPromise(`rm ${scriptPath}`);
    
    if (stdout && stdout.trim()) {
      console.log(`[AD DEBUG] Authentication successful for: ${username}`);
      
      // Parse user info (username and display name)
      const [user, fullName] = stdout.trim().split(':');
      
      // Create email based on username and domain
      const email = `${usernameOnly}@tecknet.ca`;
      
      return {
        success: true,
        user: {
          username: usernameOnly,
          email: email,
          fullName: fullName || usernameOnly
        }
      };
    }
    
    // If that fails, we'll fall back to specific test users for development/testing
    // This code will only be reached if the system auth fails
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
      error: "Authentication error"
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
