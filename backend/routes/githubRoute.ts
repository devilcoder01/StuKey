import express, { NextFunction, Request, Response, Router } from "express";
import { githubCallback, initiateGithubAuth } from "../controllers/gitAuthControler";
import { scanGithubRepositories } from "../services/githubService";
import User from "../model/user";

const githubRouter: Router = express.Router();

// GitHub OAuth routes
githubRouter.get("/auth/github", initiateGithubAuth);
githubRouter.get("/auth/github/callback", async(req: Request, res: Response) => {
    await githubCallback(req, res);
});

// GitHub disconnection route
githubRouter.post("/auth/github/disconnect", async (req: Request, res: Response) => {
    try {
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                message: 'Wallet address is required'
            });
        }

        // Find user by wallet address
        const user = await User.findOne({
            walletAddress: walletAddress.toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Clear GitHub-related fields
        user.githubUsername = undefined;
        user.githubId = undefined;
        user.githubAccessToken = undefined;
        user.githubTokenExpiry = undefined;
        user.githubLastScanned = undefined;
        user.githubMetrics = undefined;

        // Recalculate engagement score without GitHub
        // This is a simplified approach - you might want to adjust based on your scoring logic
        user.engagementScore = Math.max(0, user.engagementScore - 20); // Subtract GitHub points

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'GitHub account disconnected successfully'
        });
    } catch (error) {
        console.error("Error disconnecting GitHub account:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

// GitHub scanning and metrics routes
githubRouter.post("/github/scan", async (req: Request, res: Response) => {
    try {
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({
                success: false,
                message: 'Wallet address is required'
            });
        }

        const result = await scanGithubRepositories(walletAddress);

        if (result.success) {
            return res.status(200).json({
                success: true,
                score: result.score,
                metrics: result.metrics
            });
        } else {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        console.error("Error scanning GitHub repositories:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

// Get GitHub metrics for a user
githubRouter.get("/github/metrics", async (req: Request, res: Response) => {
    try {
        const { walletAddress } = req.query;

        if (!walletAddress || typeof walletAddress !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Wallet address is required'
            });
        }

        // Find user with GitHub metrics
        const user = await User.findOne({
            walletAddress: walletAddress.toLowerCase()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.githubUsername) {
            return res.status(400).json({
                success: false,
                message: 'GitHub account not connected'
            });
        }

        // Return GitHub metrics and score
        return res.status(200).json({
            success: true,
            githubUsername: user.githubUsername,
            lastScanned: user.githubLastScanned,
            metrics: user.githubMetrics || {},
            score: user.engagementScore
        });
    } catch (error) {
        console.error("Error getting GitHub metrics:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

export default githubRouter;
