import { User } from "@shared/schema";
import { storage } from "../storage";

interface ActiveDirectoryOptions {
  url: string;
  baseDN: string;
  username: string;
  password: string;
}

interface ADUser {
  cn: string;
  sAMAccountName: string;
  mail: string;
  givenName: string;
  sn: string;
  distinguishedName: string;
}

// In a real application, this would use a proper AD library like 'activedirectory2' or 'ldapjs'
// For the purpose of this project, we'll simulate AD authentication
export class ActiveDirectory {
  private options: ActiveDirectoryOptions;

  constructor(options: ActiveDirectoryOptions) {
    this.options = options;
  }

  // Authenticate a user against Active Directory
  async authenticate(username: string, password: string): Promise<ADUser | null> {
    // In a real implementation, this would connect to the AD server and validate credentials
    console.log(`Authenticating ${username} against AD server ${this.options.url}`);

    // For simulation, we'll accept any username that ends with @tecknet.local
    // and password that's at least 6 characters
    if (username.endsWith("@tecknet.local") && password && password.length >= 6) {
      const firstName = username.split("@")[0].split(".")[0];
      const lastName = username.split("@")[0].split(".")[1] || "";
      
      // Create a simulated AD user object
      return {
        cn: `${firstName} ${lastName}`,
        sAMAccountName: username.split("@")[0],
        mail: username.replace("@tecknet.local", "@tecknet.ca"),
        givenName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        sn: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        distinguishedName: `CN=${firstName} ${lastName},OU=Users,DC=tecknet,DC=local`
      };
    }
    
    return null;
  }

  // Find or create a user in our system based on AD authentication
  async findOrCreateUser(adUser: ADUser): Promise<User> {
    // Check if the user already exists in our system
    let user = await storage.getUserByUsername(adUser.sAMAccountName);
    
    if (!user) {
      // Create a new user in our system based on the AD user
      user = await storage.createUser({
        username: adUser.sAMAccountName,
        password: null, // AD users don't need passwords stored in our system
        email: adUser.mail,
        firstName: adUser.givenName,
        lastName: adUser.sn,
        role: 'employee',
        status: 'active',
        isAdUser: true
      });
      console.log(`Created new user from AD: ${user.username}`);
    }
    
    return user;
  }
}

// Create instance with default config
export const activeDirectory = new ActiveDirectory({
  url: process.env.AD_URL || 'ldap://tecknet.local',
  baseDN: process.env.AD_BASE_DN || 'DC=tecknet,DC=local',
  username: process.env.AD_USERNAME || 'serviceaccount',
  password: process.env.AD_PASSWORD || 'password'
});
