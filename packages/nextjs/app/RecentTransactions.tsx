"use client";

import React, { useState } from "react";

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
}

const Home: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (address: string) => {
    if (!address) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );
      const data = await res.json();
      if (data.status === "1" && Array.isArray(data.result)) {
        setTransactions(data.result.slice(0, 10)); // Get the most recent 10 transactions
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTransactions = () => {
    if (walletAddress.trim()) {
      fetchTransactions(walletAddress.trim());
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
        
        </div>

        <div className="flex flex-col items-center w-full mt-8 px-8 py-6 bg-gray-900 text-green-400">
         

          {transactions.length > 0 && (
            <div className="w-full max-w-xl mt-6 bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
              <ul>
                {transactions.map((tx, index) => (
                  <li key={index} className="mb-2">
                    <p><strong>Hash:</strong> {tx.hash}</p>
                    <p><strong>From:</strong> {tx.from}</p>
                    <p><strong>To:</strong> {tx.to}</p>
                    <p><strong>Value:</strong> {parseFloat(tx.value) / 1e18} ETH</p>
                    <p><strong>Date:</strong> {new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {transactions.length === 0 && !loading && walletAddress && (
            <p className="mt-6 text-center">No transactions found for this address.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
