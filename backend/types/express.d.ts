import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

// Define and export the structure of your JWT payload
export interface UserPayload extends JwtPayload {
  walletAddress: string;
  // Add other properties from your JWT payload if needed, e.g., userId
}

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Add the user property, making it optional
    }
  }
}

// Export something to make it a module (even if empty)
export {};
