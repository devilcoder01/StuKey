import { Request, Response } from 'express';
import app from '../../server';

// This handler forwards all user-related requests to the Express app
// Handles: /api/v1/user, /api/v1/update, /api/v1/newuser, /api/v1/message, /api/v1/verify
export default function handler(req: Request, res: Response) {
  // Forward the request to the Express app
  return app(req, res);
}
