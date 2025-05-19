export interface TokenInfo {
  balance: string;         // Raw balance as string
  decimals: number;        
  formattedBalance: string; 
}

export interface BalanceResponse {
  address: string;
  tokenInfo: Record<string, TokenInfo>;
  timestamp: number;
  cached?: boolean;
}

export interface FormattedBalance {
  symbol: string;
  value: string;
  formattedValue: string;
  icon: string;
}