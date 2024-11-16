"use client";

import React, { useState } from "react";
import { privateKeyToAccount } from "viem/accounts";
import { createNexusClient, createBicoPaymasterClient } from "@biconomy/sdk";
import { baseSepolia } from "viem/chains";
import { http, parseEther } from "viem";

export const SmartAccount: React.FC = () => {
  const [smartAccountAddress, setSmartAccountAddress] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateSmartAccount = async () => {
    try {
      const privateKey = process.env.NEXT_PUBLIC_DEV_PK;
      if (!privateKey) {
        throw new Error("Private key is not defined in environment variables");
      }

      const account = privateKeyToAccount(`0x${privateKey}`);

      const bundlerUrl = "https://bundler.biconomy.io/api/v3/84532/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44";
      const paymasterUrl = "https://paymaster.biconomy.io/api/v2/84532/9OeR7Ez_4.72cf31bd-2634-45a2-b896-d752968f8add";

      const nexusClient = await createNexusClient({
        signer: account,
        chain: baseSepolia,
        transport: http(),
        paymaster: createBicoPaymasterClient({ paymasterUrl }),
        bundlerTransport: http(bundlerUrl),
      });

      const smartAccountAddress = await nexusClient.account.address;
      setSmartAccountAddress(smartAccountAddress);
      console.log("Smart Account Address:", smartAccountAddress);

      const hash = await nexusClient.sendTransaction({
        calls: [
          {
            to: "0xf5715961C550FC497832063a98eA34673ad7C816", // Replace with target address
            value: parseEther("0"),
          },
        ],
      });

      setTransactionHash(hash);
      console.log("Transaction Hash:", hash);

      // Receipt handling removed as it's not required

      setError(null);
    } catch (err: unknown) {
      console.error("Error occurred:", err);
      setError((err as Error).message);
      setSmartAccountAddress(null);
      setTransactionHash(null);
    }
  };

  return (
    <div>
      <button
        onClick={handleCreateSmartAccount}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Create Smart Account
      </button>
      {smartAccountAddress && (
        <p>Smart Account Address: {smartAccountAddress}</p>
      )}
      {transactionHash && (
        <p>
          Transaction Hash: <a href={`https://sepolia.basescan.org/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">View on Sepolia Explorer</a>
        </p>
      )}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};
