import { Request, Response } from 'express';
import app from '../server';

/**
 * Main API handler for Vercel serverless functions
 * This handler forwards all requests to the Express app
 *
 * Note: This is one of the consolidated handlers to stay within
 * Vercel's Hobby plan limit of 12 serverless functions
 */
export default function handler(req: Request, res: Response) {
  // Log the incoming request for debugging
  console.log(`[API] ${req.method} ${req.url}`);

  // Forward the request to the Express app
  return app(req, res);
}
