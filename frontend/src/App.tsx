import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner"
import type { BalanceResponse } from "./types";
import AddressForm from "./components/AddressForm";
import BalanceDisplay from "./components/BalanceDisplay";


function App() {
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null);

  const fetchBalances = async (address: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/balance?address=${address}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch balances");
      }
      
      const data: BalanceResponse = await response.json();
      setBalanceData(data);
    } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unknown error occurred");
      setBalanceData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Ethereum Balance Checker
        </h1>
        
        <div className="max-w-md mx-auto">
          <AddressForm onSubmit={fetchBalances} loading={loading} />
          
          {balanceData && (
            <BalanceDisplay 
              address={balanceData.address} 
              tokenInfo={balanceData.tokenInfo} 
              timestamp={balanceData.timestamp}
              cached={balanceData.cached}
            />
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;