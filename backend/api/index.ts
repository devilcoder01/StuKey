import { Request, Response } from 'express';
import app from '../server';

// Handle requests directly for Vercel
export default function handler(req: Request, res: Response) {
  // Forward the request to the Express app
  return app(req, res);
}
