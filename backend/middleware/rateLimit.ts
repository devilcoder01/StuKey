import { Request, Response, NextFunction } from 'express';
import {createLogger} from './logger';

const logger = createLogger('rateLimit');

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

// In-memory store for rate limiting
// In production, use Redis or another distributed store
const store: RateLimitStore = {};

export const rateLimit = (options: {
    windowMs?: number;
    max?: number;
    message?: string;
    statusCode?: number;
    keyGenerator?: (req: Request) => string;
}) => {
    const {
        windowMs = 60 * 1000, // 1 minute by default
        max = 100, // 100 requests per windowMs by default
        message = 'Too many requests, please try again later.',
        statusCode = 429,
        keyGenerator = (req: Request) => req.ip || 'unknown'
    } = options;

    return (req: Request, res: Response, next: NextFunction) => {
        const key = keyGenerator(req);
        const now = Date.now();

        // Initialize or reset if window has expired
        if (!store[key] || now > store[key].resetTime) {
            store[key] = {
                count: 1,
                resetTime: now + windowMs
            };
            return next();
        }

        // Increment count
        store[key].count++;

        // Check if over limit
        if (store[key].count > max) {
            logger.warn(`Rate limit exceeded for ${key}`, {
                path: req.path,
                method: req.method,
                count: store[key].count
            });
            
            return res.status(statusCode).json({
                success: false,
                message
            });
        }

        next();
    };
};

// Cleanup function to prevent memory leaks
// Call this periodically (e.g., every hour)
export const cleanupRateLimitStore = () => {
    const now = Date.now();
    for (const key in store) {
        if (now > store[key].resetTime) {
            delete store[key];
        }
    }
};

// Set up a cleanup interval
setInterval(cleanupRateLimitStore, 60 * 60 * 1000); // Clean up every hour
