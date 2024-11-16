import React, { useState } from "react";
import DisplayEthImage from "./display_eth_image";

export const ProfileManagement = ({
  ethNames,
  selectedEthName,
  onEthNameSelected,
}: {
  ethNames: string[];
  selectedEthName: string | null;
  onEthNameSelected: (name: string) => void;
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [profileSetup, setProfileSetup] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setProfileSetup(true);
    }
  };

  return (
    <div className="mt-6 w-full max-w-xl">
      <h3 className="text-lg font-bold mb-4">Great. Now let's choose Your free .eth Name</h3>
      <div className="flex flex-wrap gap-2">
        {ethNames.map((name, index) => (
          <button
            key={index}
            onClick={() => onEthNameSelected(name)}
            className={`px-4 py-2 ${
              selectedEthName === name ? "bg-green-500 text-gray-900" : "bg-gray-800 text-green-400"
            } rounded-lg hover:bg-green-500 hover:text-gray-900 font-mono`}
          >
            {name}
          </button>
        ))}
      </div>

      {selectedEthName && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-4">Please enter Your Recovery Email</h3>
          <form className="w-full" onSubmit={handleEmailSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border border-green-400 bg-gray-800 text-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-mono mb-4"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold font-mono"
            >
              Assign .eth Domain and Create Smart Contract Account
            </button>
          </form>

          <div className={`mt-6 ${profileSetup ? "" : "opacity-50 pointer-events-none"}`}>
            <h3 className="text-lg font-bold mb-4">Step 3: Set Your Profile Picture</h3>
            <button
              onClick={() => alert("Image generation initiated.")}
              className="w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold font-mono"
              disabled={!profileSetup}
            >
              Generate Profile Picture
            </button>
            {profileSetup && <DisplayEthImage ethName={selectedEthName!} />}
          </div>
        </div>
      )}
    </div>
  );
};
