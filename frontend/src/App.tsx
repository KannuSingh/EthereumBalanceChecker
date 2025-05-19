import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner"
import type { BalanceResponse } from "./types";
import AddressForm from "./components/AddressForm";
import BalanceDisplay from "./components/BalanceDisplay";

const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:4000";

function App() {
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState<BalanceResponse | null>(null);

  useEffect(() => {
    // Only show in development environment
    if (import.meta.env.DEV && !import.meta.env.VITE_BACKEND_API_URL) {
      toast.warning(
        "Using default API URL. Set VITE_API_URL environment variable to customize.",
        { 
          duration: 5000,
          id: "api-url-warning"
        }
      );
    }
  }, []);

  const fetchBalances = async (address: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/balance?address=${address}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch balances");
      }
      
      const data: BalanceResponse = await response.json();
      setBalanceData(data);
      
      // Show notification for cached data
      if (data.cached) {
        toast.info("Showing cached balance data (less than 60 seconds old)", {
          id: "cached-data-info" // Use ID to prevent duplicate toasts
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unknown error occurred", {
        id: "fetch-error" // Use ID to prevent duplicate error toasts
      });
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