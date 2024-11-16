"use client";

import React, { useState } from "react";
import { FetchTransactions } from "./FetchTransactions";
import { ProfileManagement } from "./ProfileManagement";

const HomePage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [ethNames, setEthNames] = useState<string[]>([]);
  const [selectedEthName, setSelectedEthName] = useState<string | null>(null);

  const handleTransactionsFetched = (fetchedPrompt: string, fetchedEthNames: string[]) => {
    setPrompt(fetchedPrompt);
    setEthNames(fetchedEthNames);
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <FetchTransactions onTransactionsFetched={handleTransactionsFetched} />
      {ethNames.length > 0 && (
        <ProfileManagement
          ethNames={ethNames}
          selectedEthName={selectedEthName}
          onEthNameSelected={setSelectedEthName}
        />
      )}
    </div>
  );
};

export default HomePage;
