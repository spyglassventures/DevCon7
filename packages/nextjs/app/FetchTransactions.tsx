import React, { useState } from "react";

export const FetchTransactions = ({
  onTransactionsFetched,
}: {
  onTransactionsFetched: (prompt: string, ethNames: string[]) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const debugAddress = "0x0bac814ad046619d4d9783cc7d1f669d1feb4a39";

  const extractEthNames = (text: string) => {
    const regex = /\b[a-zA-Z0-9-]+\.eth\b/g;
    const matches = text.match(regex);
    return matches ? Array.from(new Set(matches)) : [];
  };

  const fetchEtherscanResponse = async () => {
    try {
      const res = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${debugAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );
      const data = await res.json();
      if (data.status === "1" && Array.isArray(data.result)) {
        const reducedData = data.result.slice(0, 50).map((tx) => ({
          timeStamp: tx.timeStamp,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          contractAddress: tx.contractAddress,
        }));
        const output = JSON.stringify(reducedData, null, 2);
        setPrompt(output);
      } else {
        setPrompt("No transactions found or invalid response from Etherscan.");
      }
    } catch (error) {
      setPrompt(`Error fetching transactions: ${error.message}`);
    }
  };

  const handleAnalyze = () => {
    const ethNames = extractEthNames(prompt);
    onTransactionsFetched(prompt, ethNames);
  };

  return (
    <div className="w-full max-w-xl">
      <button
        onClick={fetchEtherscanResponse}
        className="mb-4 w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold uppercase font-mono"
      >
        1. Step: let us see your prior Transactions (click here)
      </button>
      <p className="text-s first-letter: mb-6 text-center">
        You will not see much human-readable text here, but it helps estimate your prior blockchain experience.
      </p>
      <textarea
        className="w-full p-4 border border-green-400 bg-gray-800 text-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
        rows={8}
        placeholder="> Transactions will be displayed here..."
        value={prompt}
        readOnly
      />
      {prompt && (
        <button
          onClick={handleAnalyze}
          className="mt-4 w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold uppercase font-mono"
        >
          Analyze Transactions
        </button>
      )}
    </div>
  );
};
