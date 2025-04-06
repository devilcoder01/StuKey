// EIP-6963 Wallet Provider Types
export interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any;
}

export interface EIP6963AnnounceProviderEvent extends CustomEvent {
  detail: EIP6963ProviderDetail;
}

// User Types
export interface User {
  walletAddress: string;
  githubUsername?: string;
  engagementScore?: number;
  nftTokenId?: number;
}

// Authentication Types
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// Student Types
export interface StudentProfile {
  walletAddress: string;
  githubUsername?: string;
  engagementScore: number;
  nftTokenId?: number;
}

export interface EngagementScoreResponse {
  success: boolean;
  message: string;
  score: number;
}

export interface MintNFTResponse {
  success: boolean;
  message: string;
  tokenId: number;
}

// Merchant Types
export interface Discount {
  name: string;
  percentage: number;
  minScore: number;
}

export interface Merchant {
  walletAddress: string;
  businessName: string;
  businessType: string;
  website?: string;
  discounts: Discount[];
}

export interface MerchantProfile {
  walletAddress: string;
  businessName: string;
  businessType: string;
  website?: string;
  discounts: Discount[];
}

export interface VerifyStudentResponse {
  success: boolean;
  verified: boolean;
  student?: {
    address: string;
    tokenId: number;
    score: number;
  };
  message?: string;
}
