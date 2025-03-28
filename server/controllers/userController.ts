import { Request, Response } from 'express';
import { storage } from '../storage';
import { hashPassword } from '../auth/customer-auth';
import { insertUserSchema } from '@shared/schema';
import { ZodError } from 'zod';

export const userController = {
  // Get all users (admin only)
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await storage.listUsers();
      
      // Don't send passwords
      const sanitizedUsers = users.map(user => {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
      });
      
      res.json(sanitizedUsers);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ message: 'Failed to get users' });
    }
  },

  // Get pending user registrations (admin only)
  async getPendingUsers(req: Request, res: Response) {
    try {
      const pendingUsers = await storage.listPendingUsers();
      
      // Don't send passwords
      const sanitizedUsers = pendingUsers.map(user => {
        const { password, ...sanitizedUser } = user;
        return sanitizedUser;
      });
      
      res.json(sanitizedUsers);
    } catch (error) {
      console.error('Error getting pending users:', error);
      res.status(500).json({ message: 'Failed to get pending users' });
    }
  },

  // Approve a user registration (admin only)
  async approveUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.status !== 'pending') {
        return res.status(400).json({ message: 'User is not in pending status' });
      }

      const updatedUser = await storage.updateUser(userId, { status: 'active' });
      
      if (!updatedUser) {
        return res.status(500).json({ message: 'Failed to update user' });
      }

      // Don't send password
      const { password, ...sanitizedUser } = updatedUser;
      
      res.json(sanitizedUser);
    } catch (error) {
      console.error('Error approving user:', error);
      res.status(500).json({ message: 'Failed to approve user' });
    }
  },

  // Create a new user (admin only)
  async createUser(req: Request, res: Response) {
    try {
      let userData = req.body;
      
      // Hash the password if provided
      if (userData.password) {
        userData.password = hashPassword(userData.password);
      }

      const validData = insertUserSchema.parse(userData);
      
      const newUser = await storage.createUser(validData);
      
      // Don't send password
      const { password, ...sanitizedUser } = newUser;
      
      res.status(201).json(sanitizedUser);
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: error.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      
      res.status(500).json({ message: 'Failed to create user' });
    }
  },

  // Update a user
  async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }

      // Users can only update themselves, unless they're an admin
      if (req.session.user?.role !== 'admin' && req.session.user?.id !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let userData = req.body;
      
      // Hash the password if provided
      if (userData.password) {
        userData.password = hashPassword(userData.password);
      }

      // Regular users can only update certain fields
      if (req.session.user?.role !== 'admin') {
        const { firstName, lastName, phone, password } = req.body;
        userData = { firstName, lastName, phone };
        if (password) userData.password = hashPassword(password);
      }

      const updatedUser = await storage.updateUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(500).json({ message: 'Failed to update user' });
      }

      // Don't send password
      const { password, ...sanitizedUser } = updatedUser;
      
      // Update session user if the user is updating themselves
      if (req.session.user?.id === userId) {
        req.session.user = updatedUser;
      }
      
      res.json(sanitizedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user' });
    }
  },

  // Get current user profile
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const userId = req.session.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Don't send password
      const { password, ...sanitizedUser } = user;
      
      res.json(sanitizedUser);
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ message: 'Failed to get user profile' });
    }
  },

  // Get app links (for employees)
  async getAppLinks(req: Request, res: Response) {
    try {
      const appLinks = await storage.listAppLinks();
      res.json(appLinks);
    } catch (error) {
      console.error('Error getting app links:', error);
      res.status(500).json({ message: 'Failed to get application links' });
    }
  }
};
