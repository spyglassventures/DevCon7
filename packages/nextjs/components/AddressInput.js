// components/AddressInput.js
import React, { useState } from "react";
import { Address } from "~~/components/scaffold-eth";

export const AddressInput = ({ connectedAddress }) => {
  const [walletAddress, setWalletAddress] = useState("");

  const handleAddressSubmit = async () => {
    if (!walletAddress.trim()) return;

    try {
      const res = await fetch(`/api/etherscan?address=${walletAddress}`);
      const data = await res.json();
      console.log("Transactions:", data);
      // Handle displaying transactions here
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full mt-8 px-8 py-6 bg-gray-100 rounded-lg">
      <p className="text-lg font-medium">Connected Address:</p>
      <Address address={connectedAddress} />

      <input
        type="text"
        placeholder="Enter a wallet address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="mt-4 p-2 border rounded-lg w-full max-w-md"
      />
      <button
        onClick={handleAddressSubmit}
        className="mt-4 py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Lookup Transactions
      </button>
    </div>
  );
};
