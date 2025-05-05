import { Request, Response } from 'express';
import app from '../../server';

// This handler forwards all user-related requests to the Express app
export default function handler(req: Request, res: Response) {
  // Forward the request to the Express app
  return app(req, res);
}
