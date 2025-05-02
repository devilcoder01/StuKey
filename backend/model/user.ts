import mongoose, { Document, Schema } from "mongoose";
import { stringify } from "querystring";

interface User extends Document {
    username: string;
    name: string;
    walletAddress: string;
    githubUsername?: string; // Make optional as it might not be set initially
    githubId?: string; // Add GitHub ID field
    githubAccessToken?: string; // GitHub OAuth access token
    githubTokenExpiry?: Date; // When the token expires
    githubLastScanned?: Date; // When GitHub data was last scanned
    githubMetrics?: {
        totalCommits: number;
        totalStars: number;
        totalForks: number;
        publicRepos: number;
        followers: number;
        contributions: number;
    };
    engagementScore: number;
    nftTokenId?: number;
    nonce: string;
    nonceExpires: Date;
    lastLogin?: Date;
}

const userSchema = new Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name : {
        type: String,
        require: false,
        unique: false,
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Add this to ensure consistent wallet addresses
    },
    githubUsername: {
        type: String,
        required: false,
        unique: false, // GitHub username might not be unique across all users if not linked
        trim: true,
    },
    githubId: {
        type: String,
        required: false,
        unique: true, // GitHub ID should be unique if set
        sparse: true, // Allows multiple nulls but ensures uniqueness when set
    },
    githubAccessToken: {
        type: String,
        required: false,
        select: false, // Don't include in query results by default for security
    },
    githubTokenExpiry: {
        type: Date,
        required: false,
    },
    githubLastScanned: {
        type: Date,
        required: false,
    },
    githubMetrics: {
        totalCommits: { type: Number, default: 0 },
        totalStars: { type: Number, default: 0 },
        totalForks: { type: Number, default: 0 },
        publicRepos: { type: Number, default: 0 },
        followers: { type: Number, default: 0 },
        contributions: { type: Number, default: 0 },
    },
    engagementScore: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    nftTokenId: {
        type: Number,
        required: false
    },
    nonce: {
        type: String,
        required: false,
        default: () => Math.floor(Math.random() * 1000000).toString()
    },
    nonceExpires: {
        type: Date,
        required: false,
        default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
    },
    lastLogin: {
        type: Date,
        required: false
    }
}, {
    timestamps: false // Add timestamps for better tracking
});

export default mongoose.model<User>('users', userSchema);


