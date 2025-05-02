import { Request, Response } from 'express';
import axios from 'axios';
import User from '../model/user';
import dotenv from 'dotenv';
import { scanGithubRepositories } from '../services/githubService';
dotenv.config();

// GitHub OAuth initialization
export const initiateGithubAuth = (req: Request, res: Response) => {
    // Expect walletAddress to be passed as a query parameter from the frontend
    const { walletAddress } = req.query;

    if (!walletAddress || typeof walletAddress !== 'string') {
        // Redirect back to frontend with an error if walletAddress is missing
        // Consider adding a more specific error page or query parameter
        return res.redirect(`${process.env.FRONTEND_URL}/home?error=missing_wallet`);
    }

    // Encode the walletAddress to ensure it's safe for URL transport
    const state = encodeURIComponent(walletAddress);

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=user&state=${state}`;
    res.redirect(githubAuthUrl);
};

// GitHub OAuth callback
export const githubCallback = async (req: Request, res: Response) => {
    const { code, state } = req.query;

    if (!code || typeof code !== 'string') {
        return res.redirect(`${process.env.FRONTEND_URL}/home?github_connected=false&error=missing_code`);
    }

    if (!state || typeof state !== 'string') {
        return res.redirect(`${process.env.FRONTEND_URL}/home?github_connected=false&error=missing_state`);
    }

    // Decode the walletAddress from the state parameter
    const walletAddress = decodeURIComponent(state);

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: process.env.GITHUB_CALLBACK_URL
            },
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        const accessToken = tokenResponse.data.access_token;
        const tokenType = tokenResponse.data.token_type || 'bearer';
        const expiresIn = tokenResponse.data.expires_in; // GitHub tokens typically don't expire, but handle it anyway

        if (!accessToken) {
            console.error("GitHub token exchange failed:", tokenResponse.data);
            return res.redirect(`${process.env.FRONTEND_URL}/mint?github_connected=false&error=token_exchange_failed`);
        }

        // Get user info from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `${tokenType} ${accessToken}`,
                Accept: 'application/vnd.github.v3+json' // Recommended header
            }
        });

        const { login: githubUsername, id: githubId } = userResponse.data;

        if (!githubUsername || !githubId) {
            console.error("Failed to get GitHub user info:", userResponse.data);
            return res.redirect(`${process.env.FRONTEND_URL}/mint?github_connected=false&error=github_user_fetch_failed`);
        }

        // Find user by the walletAddress received in the state parameter
        const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() }); // Ensure consistent casing
        if (!user) {
            // Handle case where user is not found - maybe they disconnected wallet?
            console.error(`User not found for wallet address: ${walletAddress}`);
            return res.redirect(`${process.env.FRONTEND_URL}/mint?github_connected=false&error=user_not_found`);
        }

        // Calculate token expiry date (if provided)
        let tokenExpiry = null;
        if (expiresIn) {
            tokenExpiry = new Date(Date.now() + expiresIn * 1000); // Convert seconds to milliseconds
        } else {
            // Default to 60 days if no expiry provided (GitHub tokens don't expire by default)
            tokenExpiry = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
        }

        // Update user with GitHub username, ID, and token information
        user.githubUsername = githubUsername;
        user.githubId = githubId.toString(); // Ensure ID is stored as string
        user.githubAccessToken = accessToken;
        user.githubTokenExpiry = tokenExpiry;
        await user.save();

        // Trigger an initial scan of GitHub repositories in the background
        // We don't await this to avoid making the user wait for the scan to complete
        scanGithubRepositories(walletAddress)
            .then(result => {
                if (result.success) {
                    console.log(`Initial GitHub scan completed for ${githubUsername}, score: ${result.score}`);
                } else {
                    console.error(`Initial GitHub scan failed for ${githubUsername}:`, result.message);
                }
            })
            .catch(error => {
                console.error(`Error during initial GitHub scan for ${githubUsername}:`, error);
            });

        // Redirect to frontend indicating success
        res.redirect(`${process.env.FRONTEND_URL}/mint?github_connected=true`);
    } catch (error) {
        console.error("GitHub authentication error:", error);
        res.redirect(`${process.env.FRONTEND_URL}/mint?github_connected=false&error=true`);
    }
};
