import { Request, Response, NextFunction } from 'express';
import { User } from '@shared/schema';

// Extend Request interface to include session user
declare module 'express-session' {
  interface SessionData {
    user?: User;
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

// Middleware to check if user has required role
export const hasRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userRole = req.session.user.role;
    
    if (allowedRoles.includes(userRole)) {
      return next();
    }
    
    res.status(403).json({ message: 'Access denied' });
  };
};

// Middleware to check if user is an employee
export const isEmployee = hasRole(['employee', 'admin']);

// Middleware to check if user is a customer
export const isCustomer = hasRole(['customer', 'admin']);

// Middleware to check if user is an admin
export const isAdmin = hasRole('admin');

// Add user to locals for use in responses
export const addUserToLocals = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
};
