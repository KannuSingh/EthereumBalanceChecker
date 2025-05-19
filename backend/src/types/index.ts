export interface TokenInfo {
  balance: string;         
  decimals: number;        
  formattedBalance: string;
}

export interface BalanceResponse {
  address: string;
  tokenInfo: Record<string, TokenInfo>;
  timestamp: number;
  cached?: boolean;
}

export interface ErrorResponse {
  error: string;
  details?: string;
  code?: number;
}