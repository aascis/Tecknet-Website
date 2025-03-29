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

// AD authentication using LDAP
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
    
    // Format username for LDAP authentication
    const ldapUsername = usernameOnly.includes('@') ? usernameOnly : `${usernameOnly}@tecknet.ca`;
    console.log(`[AD DEBUG] LDAP authentication for ${ldapUsername}`);
    
    // PRODUCTION: Use actual LDAP authentication
    try {
      // Use the ldapsearch command to validate credentials against the AD server
      const ldapCommand = `ldapsearch -x -H ldap://${LDAP_SERVER}:${LDAP_PORT} -D "${ldapUsername}" -w "${password}" -b "dc=tecknet,dc=ca" -s sub "(sAMAccountName=${usernameOnly})" displayName mail`;
      
      console.log(`[AD DEBUG] Executing LDAP authentication command`);
      const { stdout, stderr } = await execPromise(ldapCommand);
      
      if (stderr && stderr.includes('Invalid credentials')) {
        console.log(`[AD DEBUG] LDAP authentication failed: Invalid credentials`);
        return {
          success: false,
          error: "Invalid AD credentials"
        };
      }
      
      // Parse the LDAP results to extract user information
      console.log(`[AD DEBUG] LDAP authentication successful for: ${usernameOnly}`);
      
      // Extract user details from LDAP response
      let email = `${usernameOnly}@tecknet.ca`; // Default
      let fullName = usernameOnly;
      
      // Extract email from LDAP results
      const mailMatch = stdout.match(/mail: (.+)$/m);
      if (mailMatch && mailMatch[1]) {
        email = mailMatch[1].trim();
      }
      
      // Extract display name from LDAP results
      const displayNameMatch = stdout.match(/displayName: (.+)$/m);
      if (displayNameMatch && displayNameMatch[1]) {
        fullName = displayNameMatch[1].trim();
      }
      
      return {
        success: true,
        user: {
          username: usernameOnly,
          email: email,
          fullName: fullName
        }
      };
    } catch (ldapError) {
      console.error(`[AD DEBUG] LDAP authentication error:`, ldapError);
      
      // DEVELOPMENT MODE ONLY: For testing in development environment without AD
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[AD DEBUG] Using development fallback authentication`);
        
        // Development-only test case
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
          
          console.log(`[AD DEBUG] Development authentication successful for: ${usernameOnly}`);
          return {
            success: true,
            user: {
              username: usernameOnly,
              email: `${usernameOnly}@tecknet.ca`,
              fullName: fullName
            }
          };
        }
      }
      
      return {
        success: false,
        error: "LDAP Authentication failed",
        networkError: true
      };
    }
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
