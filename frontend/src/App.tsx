import { useState } from "react";
import type { BalanceResponse } from "./types";
import AddressForm from "./components/AddressForm";


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
        </div>
      </div>
    </div>
  );
}

export default App;