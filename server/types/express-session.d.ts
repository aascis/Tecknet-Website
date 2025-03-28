import { User, ADUser } from '@shared/schema';
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isAuthenticated: boolean;
    user?: User;
    adUser?: ADUser;
  }
}