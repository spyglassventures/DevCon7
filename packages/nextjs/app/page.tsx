"use client";

import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import DisplayEthImage from "./display_eth_image";

const Home: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [ethNames, setEthNames] = useState<string[]>([]);
  const [selectedEthName, setSelectedEthName] = useState<string | null>(null);

  // Hardcoded address for debugging
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
        const reducedData = data.result.slice(0, 50).map(tx => ({
          timeStamp: tx.timeStamp,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          contractAddress: tx.contractAddress
        }));
        const output = JSON.stringify(reducedData, null, 2);
        setPrompt(output);
        setEthNames(extractEthNames(output));
      } else {
        setPrompt("No transactions found or invalid response from Etherscan.");
        setEthNames([]);
      }
    } catch (error) {
      setPrompt(`Error fetching transactions: ${error.message}`);
      setEthNames([]);
    }
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (data.answer) {
        setResponse(data.answer);
        setEthNames(extractEthNames(data.answer));
      } else {
        setResponse("No response received from the API.");
        setEthNames([]);
      }
    } catch (error) {
      setResponse("An error occurred. Please try again later.");
      setEthNames([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Klong</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={debugAddress} />
          </div>
          <p className="text-center text-lg">
            Get started by entering your wallet below.
          </p>
        </div>

        <div className="flex flex-col items-center w-full mt-16 px-8 py-12 bg-gray-900 text-green-400">
          <div className="w-full max-w-xl">
            <button
              onClick={fetchEtherscanResponse}
              className="mb-4 w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold uppercase font-mono"
            >
              Load Transactions to Prompt
            </button>
            <textarea
              className="w-full p-4 border border-green-400 bg-gray-800 text-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
              rows={8}
              placeholder="> Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={handlePromptSubmit}
              className="mt-4 w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold uppercase font-mono"
              disabled={loading}
            >
              {loading ? "Accessing..." : "Deploy Prompt"}
            </button>
          </div>
          {response && (
            <div className="mt-6 w-full max-w-xl p-4 bg-gray-800 text-green-400 border border-green-500 rounded-lg font-mono max-h-96 overflow-y-auto">
              <h3 className="font-bold mb-2 text-green-300">[Response]</h3>
              <p>{response}</p>
            </div>
          )}

          {ethNames.length > 0 && (
            <div className="mt-6 w-full max-w-xl">
              <h3 className="text-lg font-bold mb-4">Get .eth Name and mint Klong</h3>
              <div className="flex flex-wrap gap-2">
                {ethNames.map((name, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEthName(name)}
                    className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-mono"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedEthName && (
            <div className="mt-8">
              <DisplayEthImage ethName={selectedEthName} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
