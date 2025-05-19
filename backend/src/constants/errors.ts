// Error message constants for consistent error handling throughout the application
export const ERRORS = {
  INVALID_ADDRESS: 'Invalid Ethereum address',
  NO_BALANCES_FOUND: 'Could not retrieve any balances for this address',
  TOKEN_BALANCE_FETCH_ERROR: (symbol: string) => `Error fetching ${symbol} balance`,
  INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;

// HTTP status codes for consistent response status codes
export const STATUS_CODES = {
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500
} as const;