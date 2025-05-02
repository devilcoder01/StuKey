import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserPayload } from '../types/express'; // Import the payload type

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer "

  if (!token) {
    // Send 401 Unauthorized if no token is provided
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  try {
    // Verify the token and cast the decoded payload to our defined type
    // Assuming verifyToken returns the decoded payload matching UserPayload or throws on error
    const decoded = verifyToken(token) as UserPayload;

    // Attach the decoded payload (containing walletAddress, etc.) to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Send 403 Forbidden if the token is invalid or expired
    console.error("Token verification failed:", error); // Log the error for debugging
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};
