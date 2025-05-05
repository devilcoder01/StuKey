import { Request, Response } from 'express';

// This is a standalone API route for Vercel
export default function handler(req: Request, res: Response) {
  res.status(200).json({ message: "API is running" });
}
