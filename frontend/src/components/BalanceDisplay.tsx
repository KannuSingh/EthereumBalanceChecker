import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { FormattedBalance, TokenInfo } from "../types";
import { formatDistanceToNow } from "date-fns";
import numeral from "numeral";

interface BalanceDisplayProps {
  address: string;
  tokenInfo: Record<string, TokenInfo>;
  timestamp: number;
  cached?: boolean;
}

// Token icons (hardcoded for simplicity)
const TOKEN_ICONS: Record<string, string> = {
  ETH: "🔷", // Ethereum diamond
  USDC: "💵", // Dollar
  LINK: "🔗", // Chain link
};

export default function BalanceDisplay({
  address,
  tokenInfo,
  timestamp,
  cached,
}: BalanceDisplayProps) {
  // Format balances according to requirements
  const formatBalance = (value: string): string => {
    const num = parseFloat(value);
    
    if (num === 0) return "0";
    
    if (num >= 1) {
      // 123456.789876 → 123,456.7897
      return numeral(num).format('0,0.0000');
    }
    
    // 0.0123456 → 0.01234 or 0.0000123456 → 0.00001234
    const str = num.toString();
    const decimalPart = str.split('.')[1];
    const firstNonZeroIndex = decimalPart.search(/[1-9]/);
    
    if (firstNonZeroIndex === -1) return "0";
    
    const significantDigits = 4; // Show 4 digits after first non-zero
    const formattedDecimal = decimalPart.substring(0, firstNonZeroIndex + significantDigits);
    
    return `0.${formattedDecimal}`;
  }

  // Process the balances for display
  const formattedBalances = useMemo(() => {
    return Object.entries(tokenInfo).map(([symbol, info]) => ({
      symbol,
      value: info.balance,
      formattedValue: formatBalance(info.formattedBalance),
      icon: TOKEN_ICONS[symbol] || "🪙", // Default icon for unknown tokens
    }));
  }, [tokenInfo]);

  // Format the timestamp
  const formattedTime = useMemo(() => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }, [timestamp]);

  // Truncate address for display
  const truncatedAddress = `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Wallet Balances
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {truncatedAddress}
          </span>
          {cached && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Cached
            </Badge>
          )}
          <span className="text-xs text-gray-400">
            Updated {formattedTime}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formattedBalances.map((token) => (
          <TokenCard key={token.symbol} token={token} />
        ))}
      </div>
    </div>
  );
}

// Individual token card component
function TokenCard({ token }: { token: FormattedBalance }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-4 px-5 bg-gray-50 dark:bg-gray-800 border-b">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <span className="text-xl">{token.icon}</span>
          {token.symbol}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {token.formattedValue}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}