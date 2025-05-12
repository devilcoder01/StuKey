import { Request, Response } from 'express';
import app from '../../server';

// This handler forwards all GitHub-related requests to the Express app
// Handles: /api/v1/github/scan, /api/v1/github/metrics
export default function handler(req: Request, res: Response) {
  // Forward the request to the Express app
  return app(req, res);
}
