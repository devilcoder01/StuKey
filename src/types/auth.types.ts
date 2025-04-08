export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: {
    address: string | null;
    signature?: string | null;
  } | null;
}

export interface AuthContextType extends AuthState {
  login: (address: string, signature: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
