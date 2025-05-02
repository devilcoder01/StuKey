import axios from "axios";
import User from "../model/user";

/**
 * Create authenticated GitHub API client with user's access token
 * @param accessToken GitHub OAuth access token
 * @returns Axios instance configured with auth headers
 */
const createGithubClient = (accessToken: string) => {
    return axios.create({
        baseURL: 'https://api.github.com',
        headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });
};

/**
 * Check if a GitHub token is valid and not expired
 * @param accessToken GitHub OAuth access token
 * @returns Boolean indicating if token is valid
 */
export const isTokenValid = async (accessToken: string): Promise<boolean> => {
    try {
        const client = createGithubClient(accessToken);
        const response = await client.get('/user');
        return response.status === 200;
    } catch (error) {
        return false;
    }
};

/**
 * Scan GitHub repositories and calculate metrics for a user
 * @param walletAddress User's wallet address
 * @returns Object with scan results and updated score
 */
export const scanGithubRepositories = async (walletAddress: string): Promise<{
    success: boolean;
    score?: number;
    message?: string;
    metrics?: any;
}> => {
    try {
        // Find user and include the access token in the query
        const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() })
            .select('+githubAccessToken');

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (!user.githubUsername || !user.githubAccessToken) {
            return { success: false, message: 'GitHub account not connected' };
        }

        // Check if token is valid
        const isValid = await isTokenValid(user.githubAccessToken);
        if (!isValid) {
            return { success: false, message: 'GitHub token expired or invalid' };
        }

        // Create authenticated client
        const github = createGithubClient(user.githubAccessToken);

        // Get user profile with authenticated request
        const userResponse = await github.get(`/user`);
        const githubUser = userResponse.data;

        // Get user repositories (includes private repos with auth)
        const reposResponse = await github.get(`/user/repos?per_page=100`);
        const repos = reposResponse.data;

        // Initialize metrics
        let totalCommits = 0;
        let totalStars = 0;
        let totalForks = 0;
        let contributions = 0;

        // Calculate metrics from repositories
        for (const repo of repos) {
            // Only count non-forked repositories
            if (!repo.fork) {
                totalStars += repo.stargazers_count;
                totalForks += repo.forks_count;

                // Get commits for this repository
                try {
                    const commitsResponse = await github.get(
                        `/repos/${repo.full_name}/commits?author=${user.githubUsername}&per_page=100`
                    );
                    totalCommits += commitsResponse.data.length;

                    // Add to contributions count
                    contributions += commitsResponse.data.length;
                } catch (error) {
                    // Skip if we can't get commits for this repo
                    console.warn(`Could not get commits for ${repo.name}:`, error);
                }
            }
        }

        // Try to get contribution activity for the last year
        try {
            const contributionsResponse = await github.get(`/users/${user.githubUsername}/events`);
            // Count push events in the last year as additional contributions
            const pushEvents = contributionsResponse.data.filter((event: any) =>
                event.type === 'PushEvent' &&
                new Date(event.created_at) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
            );
            contributions += pushEvents.length;
        } catch (error) {
            console.warn('Could not get contribution events:', error);
        }

        // Store metrics in user record
        const metrics = {
            totalCommits,
            totalStars,
            totalForks,
            publicRepos: githubUser.public_repos,
            followers: githubUser.followers,
            contributions
        };

        // Calculate score based on various factors
        // This is a more comprehensive scoring algorithm
        const weights = {
            commits: 2.5,     // Weight for commits
            stars: 3,         // Weight for stars received
            forks: 4,         // Weight for forks received
            repos: 2,         // Weight for number of repositories
            followers: 1.5,   // Weight for followers
            contributions: 3  // Weight for recent contributions
        };

        // Calculate weighted score components
        const scoreComponents = {
            commits: Math.min(100, totalCommits) * weights.commits,
            stars: Math.min(50, totalStars) * weights.stars,
            forks: Math.min(20, totalForks) * weights.forks,
            repos: Math.min(20, githubUser.public_repos) * weights.repos,
            followers: Math.min(50, githubUser.followers) * weights.followers,
            contributions: Math.min(200, contributions) * weights.contributions
        };

        // Calculate total possible points
        const maxPossibleScore =
            100 * weights.commits +
            50 * weights.stars +
            20 * weights.forks +
            20 * weights.repos +
            50 * weights.followers +
            200 * weights.contributions;

        // Calculate raw score
        const rawScore =
            scoreComponents.commits +
            scoreComponents.stars +
            scoreComponents.forks +
            scoreComponents.repos +
            scoreComponents.followers +
            scoreComponents.contributions;

        // Normalize to 0-100 range
        const normalizedScore = Math.round((rawScore / maxPossibleScore) * 100);
        const finalScore = Math.min(100, Math.max(0, normalizedScore));

        // Update user with new metrics and score
        user.githubMetrics = metrics;
        user.engagementScore = finalScore;
        user.githubLastScanned = new Date();
        await user.save();

        return {
            success: true,
            score: finalScore,
            metrics
        };
    } catch (error) {
        console.error("Error scanning GitHub repositories:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
};

/**
 * Calculate a GitHub engagement score based on user activity
 * @param username GitHub username
 * @returns Engagement score (0-100)
 */
export const calculateGithubScore = async (username: string): Promise<number> => {
    try {
        // Get user profile
        const userResponse = await axios.get(`https://api.github.com/users/${username}`);
        const user = userResponse.data;

        // Get user repositories
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`);
        const repos = reposResponse.data;

        // Get user contributions (this is a simplified approach)
        // In a real implementation, you might want to use the GitHub GraphQL API
        // to get more detailed contribution data
        let totalCommits = 0;
        let totalStars = 0;
        let totalForks = 0;

        // Calculate metrics from repositories
        for (const repo of repos) {
            // Only count non-forked repositories
            if (!repo.fork) {
                totalStars += repo.stargazers_count;
                totalForks += repo.forks_count;

                // Get commits for this repository
                try {
                    const commitsResponse = await axios.get(
                        `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=100`
                    );
                    totalCommits += commitsResponse.data.length;
                } catch (error) {
                    // Skip if we can't get commits for this repo
                    console.warn(`Could not get commits for ${repo.name}:`, error);
                }
            }
        }

        // Calculate score based on various factors
        // This is a simplified scoring algorithm - you can adjust the weights
        // and factors based on your specific requirements
        const baseScore = Math.min(1,
            (totalCommits * 2) +
            (totalStars * 3) +
            (totalForks * 5) +
            (user.public_repos * 2) +
            (user.followers * 1)
        );

        // Normalize score to 0-100 range
        return Math.min(100, Math.max(0, Math.round(baseScore * 100)));
    } catch (error) {
        console.error("Error calculating GitHub score:", error);
        throw new Error("Failed to calculate GitHub score");
    }
};
