import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, UserRole } from "@shared/schema";
import axios from "axios";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Import ActiveDirectory module
import ActiveDirectory from 'activedirectory2';

// Function to authenticate directly against Windows AD
async function authenticateADUser(username: string, password: string): Promise<{success: boolean, userData?: any, error?: string, networkError?: boolean}> {
  try {
    // Enhanced debug information for troubleshooting
    console.log('AD Authentication attempt:');
    console.log('- Username:', username);
    console.log('- AD_URL:', process.env.AD_URL);
    console.log('- AD_BASE_DN:', process.env.AD_BASE_DN);
    console.log('- AD_USERNAME_SUFFIX:', process.env.AD_USERNAME_SUFFIX);
    console.log('- AD_EMAIL_SUFFIX:', process.env.AD_EMAIL_SUFFIX);
    
    // In production or when AD_URL is set, connect directly to AD
    if (process.env.AD_URL) {
      // Format the username for AD authentication
      // Method 1: username with @ suffix
      let adUsername = username;
      if (process.env.AD_USERNAME_SUFFIX && !username.includes('@')) {
        adUsername = `${username}${process.env.AD_USERNAME_SUFFIX}`;
      }
      console.log('- Formatted AD username (@ format):', adUsername);
      
      // Method 2: username with DOMAIN\username format
      const domainName = process.env.AD_USERNAME_SUFFIX ? 
        process.env.AD_USERNAME_SUFFIX.replace('@', '') : 'tecknet';
      const backslashUsername = `${domainName}\\${username}`;
      console.log('- Formatted AD username (backslash format):', backslashUsername);
      
      // Configure AD connection with improved settings
      const adConfig = {
        url: process.env.AD_URL,
        baseDN: process.env.AD_BASE_DN,
        // For binding to AD, use the full username
        username: adUsername,  // Will try with @ format first
        password: password,
        attributes: {
          user: ['dn', 'displayName', 'mail', 'sAMAccountName', 'cn', 'department', 'title', 'manager', 'userPrincipalName'],
          group: ['dn', 'cn', 'description']
        },
        // LDAP version explicitly set to 3
        ldapVersion: 3,
        // Increased timeout settings for slow networks
        timeout: 10000,           // 10 seconds for operations
        connectTimeout: 15000,    // 15 seconds for initial connection
        tlsOptions: {             // TLS options for potential SSL issues
          rejectUnauthorized: false
        }
      };
      
      return new Promise((resolve) => {
        try {
          console.log('- Creating ActiveDirectory instance with @ format username...');
          const ad = new ActiveDirectory(adConfig);
          
          // METHOD 1: Try authenticating with @ format username first
          console.log('- Attempting authentication with @ format:', adUsername);
          ad.authenticate(adUsername, password, (atErr: Error | null, atAuth: boolean) => {
            if (atErr) {
              console.error('- @ format authentication error:', atErr.message);
              
              // Check for common network errors
              const errorMessage = atErr.message.toLowerCase();
              if (errorMessage.includes('connection') || 
                  errorMessage.includes('timeout') || 
                  errorMessage.includes('network') ||
                  errorMessage.includes('econnrefused') ||
                  errorMessage.includes('etimedout')) {
                console.error('- Network connectivity error detected!');
                return resolve({ 
                  success: false, 
                  error: 'Cannot connect to authentication server. Please try again later or contact support.',
                  networkError: true
                });
              }
              
              // If not a network error, try the backslash format
              console.log('- @ format authentication failed, trying backslash format...');
            } else if (atAuth) {
              // @ format authentication succeeded
              console.log('- Authentication successful with @ format');
              
              // Get user details
              ad.findUser(adUsername, (findErr: Error | null, user: any) => {
                if (findErr || !user) {
                  console.warn('- User lookup warning after successful auth:', findErr?.message);
                  // Fallback to basic user data if lookup fails
                  const userData = {
                    username,
                    email: `${username}${process.env.AD_EMAIL_SUFFIX || '@tecknet.ca'}`,
                    fullName: username
                  };
                  console.log('- Using fallback user data:', userData);
                  return resolve({ success: true, userData });
                }
                
                console.log('- User found in AD:', user.dn);
                // Extract user data with fallbacks for each field
                const userData = {
                  username,
                  email: user.mail || user.userPrincipalName || `${username}${process.env.AD_EMAIL_SUFFIX || '@tecknet.ca'}`,
                  fullName: user.displayName || user.cn || user.sAMAccountName || username,
                  department: user.department || 'Not specified',
                  title: user.title || 'Not specified',
                  manager: user.manager || 'Not specified'
                };
                
                console.log('- User data extracted successfully');
                return resolve({ success: true, userData });
              });
              
              // Important: return here to prevent trying backslash format
              return;
            } else {
              // @ format auth failed without error
              console.log('- @ format authentication failed (invalid credentials)');
            }
            
            // METHOD 2: Try backslash format if @ format failed
            try {
              console.log('- Creating AD instance with backslash format...');
              // Create a new config with backslash username
              const backslashConfig = {
                ...adConfig,
                username: backslashUsername,
              };
              
              const adBackslash = new ActiveDirectory(backslashConfig);
              
              console.log('- Attempting authentication with backslash format:', backslashUsername);
              adBackslash.authenticate(backslashUsername, password, (bsErr: Error | null, bsAuth: boolean) => {
                if (bsErr) {
                  console.error('- Backslash format authentication error:', bsErr.message);
                  
                  // Check for network errors
                  const bsErrorMsg = bsErr.message.toLowerCase();
                  if (bsErrorMsg.includes('connection') || 
                      bsErrorMsg.includes('timeout') || 
                      bsErrorMsg.includes('network') ||
                      bsErrorMsg.includes('econnrefused') ||
                      bsErrorMsg.includes('etimedout')) {
                    console.error('- Network connectivity error with backslash format');
                    return resolve({ 
                      success: false, 
                      error: 'Cannot connect to authentication server. Please try again later.',
                      networkError: true
                    });
                  }
                  
                  // Both formats failed with errors
                  console.error('- Authentication failed with both username formats');
                  return resolve({ 
                    success: false, 
                    error: 'Invalid credentials or account is locked/disabled'
                  });
                }
                
                if (!bsAuth) {
                  // Both formats failed
                  console.error('- Authentication failed with both username formats (invalid credentials)');
                  return resolve({ success: false, error: 'Invalid username or password' });
                }
                
                // Backslash format succeeded
                console.log('- Authentication successful with backslash format');
                
                // Get user details (using the original AD instance for consistency)
                ad.findUser(username, (findErr: Error | null, user: any) => {
                  if (findErr || !user) {
                    console.warn('- User lookup warning after backslash auth success:', findErr?.message);
                    // Fallback data
                    const userData = {
                      username,
                      email: `${username}${process.env.AD_EMAIL_SUFFIX || '@tecknet.ca'}`,
                      fullName: username
                    };
                    console.log('- Using fallback user data (backslash auth):', userData);
                    return resolve({ success: true, userData });
                  }
                  
                  console.log('- User found in AD after backslash auth:', user.dn);
                  const userData = {
                    username,
                    email: user.mail || user.userPrincipalName || `${username}${process.env.AD_EMAIL_SUFFIX || '@tecknet.ca'}`,
                    fullName: user.displayName || user.cn || username,
                    department: user.department || 'Not specified',
                    title: user.title || 'Not specified',
                    manager: user.manager || 'Not specified'
                  };
                  
                  console.log('- User data extracted successfully (backslash auth)');
                  return resolve({ success: true, userData });
                });
              });
            } catch (backslashError: any) {
              console.error('- Error creating ActiveDirectory instance with backslash format:', backslashError.message);
              return resolve({ 
                success: false, 
                error: 'Failed to initialize authentication service with alternative format'
              });
            }
          });
        } catch (adInitError: any) {
          console.error('- Error creating ActiveDirectory instance:', adInitError.message);
          return resolve({ 
            success: false, 
            error: 'Failed to initialize authentication service', 
            networkError: true 
          });
        }
      });
    } else {
      // Development mode fallback - no AD_URL configured
      console.log('- No AD_URL configured, using development mode authentication');
      if (username === 'employee' && password === 'employee123') {
        console.log('- Development mode authentication successful');
        return { 
          success: true,
          userData: {
            username: 'employee',
            email: 'employee@company.com',
            fullName: 'Demo Employee'
          }
        };
      }
      console.log('- Development mode authentication failed');
      return { success: false, error: 'Invalid credentials in development mode' };
    }
  } catch (error: any) {
    console.error('AD authentication unexpected error:', error);
    return { 
      success: false, 
      error: 'An unexpected error occurred during authentication',
      networkError: true
    };
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'cloudservice-secret-key',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use('customer', new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user || user.role !== UserRole.CUSTOMER || !(await comparePasswords(password, user.password))) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  passport.use('employee', new LocalStrategy(async (username, password, done) => {
    try {
      console.log("Employee authentication attempt for username:", username);
      
      // First check if user exists in our database
      const user = await storage.getUserByUsername(username);
      console.log("User exists in database:", user ? "Yes" : "No");
      
      // If user exists, verify with AD authentication
      if (user && user.role === UserRole.EMPLOYEE) {
        console.log("Verifying existing employee with AD");
        const authResult = await authenticateADUser(username, password);
        console.log("AD authentication result for existing user:", authResult.success ? "Success" : "Failed", authResult.error || "");
        
        if (authResult.success) {
          // Optionally update user details with latest from AD
          // This would require a updateUser method in your storage interface
          console.log("Existing user authenticated successfully with AD");
          return done(null, user);
        }
      }
      // If user doesn't exist or authentication failed, try to authenticate with AD
      else {
        console.log("Attempting direct AD authentication for new employee");
        const authResult = await authenticateADUser(username, password);
        console.log("AD authentication result for new user:", authResult.success ? "Success" : "Failed", authResult.error || "");
        
        if (authResult.success && authResult.userData) {
          console.log("New user authenticated successfully with AD, creating local account");
          // Create a new user record if authentication successful
          const newUser = await storage.createUser({
            username,
            password: await hashPassword(password), // Store hashed password as backup
            role: UserRole.EMPLOYEE,
            email: authResult.userData.email || `${username}@company.com`,
            fullName: authResult.userData.fullName || username
          });
          console.log("New user created with ID:", newUser.id);
          return done(null, newUser);
        }
      }
      
      console.log("Authentication failed, invalid credentials");
      return done(null, false, { message: 'Invalid domain credentials' });
    } catch (error) {
      return done(error);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate role - only customers can register through the form
      if (req.body.role !== UserRole.CUSTOMER) {
        return res.status(400).json({ message: "Invalid role for registration" });
      }

      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    const { role, username, password } = req.body;
    console.log("Login attempt:", { role, username, passwordLength: password?.length || 0 });
    
    if (role === UserRole.CUSTOMER) {
      console.log("Using customer authentication strategy");
      passport.authenticate('customer', (err: any, user: Express.User | false, info: { message: string } | undefined) => {
        if (err) {
          console.error("Customer authentication error:", err);
          return next(err);
        }
        if (!user) {
          console.log("Customer authentication failed:", info?.message || "Invalid credentials");
          return res.status(401).json({ message: info?.message || "Invalid credentials" });
        }
        
        console.log("Customer authentication successful, logging in");
        req.login(user, (loginErr) => {
          if (loginErr) {
            console.error("Login session error:", loginErr);
            return next(loginErr);
          }
          console.log("Customer login complete");
          return res.status(200).json(user);
        });
      })(req, res, next);
    } else if (role === UserRole.EMPLOYEE) {
      console.log("Using employee authentication strategy");
      passport.authenticate('employee', (err: any, user: Express.User | false, info: { message: string } | undefined) => {
        if (err) {
          console.error("Employee authentication error:", err);
          return next(err);
        }
        if (!user) {
          console.log("Employee authentication failed:", info?.message || "Invalid credentials");
          return res.status(401).json({ message: info?.message || "Invalid credentials" });
        }
        
        console.log("Employee authentication successful, logging in");
        req.login(user, (loginErr) => {
          if (loginErr) {
            console.error("Login session error:", loginErr);
            return next(loginErr);
          }
          console.log("Employee login complete");
          return res.status(200).json(user);
        });
      })(req, res, next);
    } else {
      console.log("Invalid role specified:", role);
      return res.status(400).json({ message: "Invalid role specified" });
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Get all applications for employee dashboard
  app.get("/api/applications", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== UserRole.EMPLOYEE) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      next(error);
    }
  });

  // Get subscriptions for customer dashboard
  app.get("/api/subscriptions", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== UserRole.CUSTOMER) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const subscriptions = await storage.getSubscriptionsByUserId(req.user.id);
      res.json(subscriptions);
    } catch (error) {
      next(error);
    }
  });

  // Get tickets for customer dashboard
  app.get("/api/tickets", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== UserRole.CUSTOMER) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const tickets = await storage.getTicketsByUserId(req.user.id);
      res.json(tickets);
    } catch (error) {
      next(error);
    }
  });

  // Create a new ticket
  app.post("/api/tickets", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || req.user.role !== UserRole.CUSTOMER) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const ticketData = {
        ...req.body,
        userId: req.user.id,
        status: "Open",
        ticketNumber: `T-${Date.now().toString().slice(-6)}`
      };
      
      const ticket = await storage.createTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error) {
      next(error);
    }
  });
}
