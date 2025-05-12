import { Request, Response } from 'express';
import app from '../../server';

// This handler forwards all authentication-related requests to the Express app
// Handles: /api/v1/auth/github, /api/v1/auth/github/callback, /api/v1/auth/github/disconnect
export default function handler(req: Request, res: Response) {
  // Forward the request to the Express app
  return app(req, res);
}
