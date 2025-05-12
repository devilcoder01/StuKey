import { Request, Response } from 'express';
import app from '../../server';

// This is a catch-all handler for any API v1 routes not explicitly defined
export default function handler(req: Request, res: Response) {
  // Forward the request to the Express app
  return app(req, res);
}
