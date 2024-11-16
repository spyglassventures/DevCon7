"use client";

import React from "react";
import { useHomeLogic } from "../components/logic/logic";

const Home: React.FC = () => {
  const {
    prompt,
    response,
    loading,
    ethNames,
    selectedEthName,
    setSelectedEthName,
    fetchEtherscanResponse,
    handlePromptSubmit,
  } = useHomeLogic();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5 text-center bg-gradient-to-r from-blue-500 to-green-400 text-white py-10 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Welcome to Klong</h1>
          <p className="text-lg mb-6">
            See past transactions and claim a free username (ENS address) and
            add your email to complete your profile.
          </p>
          <p className="text-m first-letter: mb-6">
            Why? In case you lose access to your wallet, you can still recover
            your username.
          </p>
        </div>

        <div className="flex flex-col items-center w-full mt-8 px-8 py-12 bg-gray-900 text-green-400">
          {/* Button and transaction area */}
          <div className="w-full max-w-xl">
            <button
              onClick={fetchEtherscanResponse}
              className="mb-4 w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold uppercase font-mono"
            >
              1. Step: See your prior Transactions
            </button>
            <p className="text-s mb-6 text-center">
              You will not be able to see much human-readable text in here, but
              it helps us to estimate your prior experience in using blockchain.
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
                {loading
                  ? "Analyzing..."
                  : "2. Step: Create Persona Ideas and find suitable .eth Names"}
              </button>
            )}
          </div>

          {/* Response area */}
          {response && (
            <div className="mt-6 w-full max-w-xl p-4 bg-gray-800 text-green-400 border border-green-500 rounded-lg font-mono max-h-96 overflow-y-auto">
              <h3 className="font-bold mb-2 text-green-300">[Response]</h3>
              <p>{response}</p>
            </div>
          )}

          {/* ETH names selection */}
          {ethNames.length > 0 && (
            <div className="mt-6 w-full max-w-xl">
              <h3 className="text-lg font-bold mb-4">
                Great. Now let’s choose your free .eth Name
              </h3>
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

          {/* Recovery email form (visible if an .eth name is selected) */}
          {selectedEthName && (
            <div className="mt-6 w-full max-w-xl">
              <h3 className="text-lg font-bold mb-4">
                Please enter your recovery email for {selectedEthName}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const emailInput = (
                    e.target as HTMLFormElement
                  ).elements.namedItem("email") as HTMLInputElement;
                  if (emailInput?.value) {
                    alert(`Email for ${selectedEthName}: ${emailInput.value}`);
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
                <button
                  type="submit"
                  className="w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold font-mono"
                >
                  Assign .eth Domain
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
