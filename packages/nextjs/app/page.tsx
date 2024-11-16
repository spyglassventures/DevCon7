"use client";

import React, { useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import DisplayEthImage from "./display_eth_image";
import { SmartAccount } from "../components/smartaccount/SmartAccount";

import NameStoneComponent from "../components/ens/register";


const Home: React.FC = () => {
  const { address: connectedAddress } = useAccount();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [ethNames, setEthNames] = useState<string[]>([]);
  const [selectedEthName, setSelectedEthName] = useState<string | null>(null);
  const smartAccountRef = useRef(null);

  // const handleButtonClick = () => {
  //   setIsContractCreated(true);
  //   if (smartAccountRef.current) {
  //     smartAccountRef.current.handleCreateSmartAccount();
  //   }
  // };

  // Hardcoded address for debugging
  const debugAddress = "0x0bac814ad046619d4d9783cc7d1f669d1feb4a39";
  const [isDomainAssigned, setIsDomainAssigned] = useState(false);
  const [isContractCreated, setIsContractCreated] = useState(false);

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
        <div className="px-5 text-center bg-gradient-to-r from-blue-500 to-green-400 text-white py-10 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Welcome to Klong</h1>
          <p className="text-lg mb-6">
            See past transactions and claim a free username  (ENS address) and add your email to complete your profile.
          </p>
          <p className="text-m first-letter: mb-6">
            Why? In case you loose access to your wallet, you can still recover your username
          </p>
        </div>

        <div>
          <NameStoneComponent />
        </div>

        
        

        <div className="flex flex-col items-center w-full mt-8 px-8 py-12 bg-gray-900 text-green-400">
          <div className="w-full max-w-xl">
            <button
              onClick={fetchEtherscanResponse}
              className="mb-4 w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold uppercase font-mono"
            >
              1. Step: let use see your prio Transactions (click here)
            </button>
            <p className="text-s first-letter: mb-6 text-center">
            You will not be able to see much human readable text in here, but it helps us to estimate your prior experience in using blockchain.
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
                onClick={handlePromptSubmit}
                className="mt-4 w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold uppercase font-mono"
                disabled={loading}
              >
                {loading ? "Analyzing..." : "2. Step: Create Persona Ideas and find suitable .eth Names"}
              </button>
            )}
          </div>

          {response && (
            <div className="mt-6 w-full max-w-xl p-4 bg-gray-800 text-green-400 border border-green-500 rounded-lg font-mono max-h-96 overflow-y-auto">
              <h3 className="font-bold mb-2 text-green-300">[Response]</h3>
              <p>{response}</p>
            </div>
          )}

{ethNames.length > 0 && (
            <div className="mt-6 w-full max-w-xl">
              <h3 className="text-lg font-bold mb-4">Great. Now lets choose your free .eth Name</h3>
              <p className="text-s first-letter: mb-6">
            Please select which username you like best.
          </p>
              <div className="flex flex-wrap gap-2">
                {ethNames.map((name, index) => (
                  <button
                    key={index}
                    onClick={() => 
                    {
                      setSelectedEthName(name);
                      setIsDomainAssigned(true);
                    }
                    } // and 
                    className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-mono"
                  >
                    {name}
                  </button>
                ))}
              </div>

              {selectedEthName && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold mb-4">Please enter Your Recovery Email</h3>
                  <form
                    className="w-full"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const emailInput = (e.target as HTMLFormElement).elements.namedItem("email") as HTMLInputElement;
                      if (emailInput?.value) {
                        setResponse(emailInput.value);
                      }
                    }}
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full p-2 border border-green-400 bg-gray-800 text-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono mb-4"
                      required
                    />
                    <div>
      <h1>Create recovery wallet (Registrar)</h1>
      <SmartAccount /> {/* The button from SmartAccount will be rendered here */}
    </div>
                   
                    
                  </form>


                  
                  <div className={`mt-6 ${isContractCreated ? "" : "opacity-50 pointer-events-none"}`}>
                    <h3 className="text-lg font-bold mb-4">Optional: Update your profile with a cool avatar image</h3>
                    <button
                      onClick={() => alert('Image generation initiated.')}
                      className="w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold font-mono"
                      disabled={!isContractCreated}
                    >
                      Generate Profile Picture
                    </button>
                    <div className="mt-4 flex justify-between">
                      <button
                        className="w-48 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold font-mono"
                        disabled={!isContractCreated}
                      >
                        Select as Profile Picture
                      </button>
                      <button
                        className="w-48 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold font-mono"
                        disabled={!isContractCreated}
                      >
                        Upload Own File
                      </button>
                    </div>
                  </div>

                  {isContractCreated && (
                    <div className="mt-6 p-4 bg-gray-800 text-green-400 border border-green-500 rounded-lg font-mono">
                      <h3 className="font-bold mb-2 text-green-300">Success!</h3>
                      <p>ENS Name: {selectedEthName}</p>
                      <p>Account Address: 0x123...456</p>
                      <p>Recovery Email: {selectedEthName}</p>
                      <p>Profile Picture: [Generated or Uploaded Image Here]</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}


        </div>
      </div>
    </>
  );
};

export default Home;
