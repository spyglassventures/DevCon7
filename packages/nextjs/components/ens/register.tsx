import React, { useEffect, useState } from "react";

interface NameStoneComponentProps {
  selectedEthName: string | null; // Selected .docdialog.eth name
  connectedAddress: string | undefined; // Connected wallet address
}

const NameStoneComponent: React.FC<NameStoneComponentProps> = ({
  selectedEthName,
  connectedAddress,
}) => {
  const [domain, setDomainInput] = useState(""); // ENS domain input
  const [address, setAddressInput] = useState(""); // Blockchain address input
  const [message, setMessage] = useState(""); // Feedback message to the user

  // Load the API key from environment variables
  const apiKey = process.env.NEXT_PUBLIC_NAMESTONE_API_KEY;

  if (!apiKey) {
    console.error("API key is missing. Please set NEXT_PUBLIC_NAMESTONE_API_KEY in .env.local");
    return <p>API key is missing.</p>;
  }

  // Update domain and address when props change
  useEffect(() => {
    if (selectedEthName) {
      setDomainInput(selectedEthName);
    }
    if (connectedAddress) {
      setAddressInput(connectedAddress);
    }
  }, [selectedEthName, connectedAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!domain || !address) {
      setMessage("Domain and address are required.");
      return;
    }

    try {
      const response = await fetch("/api/proxy-namestone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain,
          address,
          text_records: {
            "com.twitter": "namestonehq",
            "com.github": "spyglassventures.ch",
            "com.discord": "superslobo",
            "url": "https://www.namestone.xyz",
            "location": "📍 nyc",
            "description": "APIs are cool",
            "avatar": "https://raw.githubusercontent.com/aslobodnik/profile/main/pic.jpeg",
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error response:", error);
        setMessage(`Error: ${error.error || "An error occurred"}`);
        return;
      }

      const data = await response.json();
      setMessage(`Domain set successfully: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error("Unexpected error:", error);
      setMessage(`An unexpected error occurred: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Set ENS Domain</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Domain:
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="Enter ENS Domain (e.g., testbrand.eth)"
              style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
            />
          </label>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>
            Address:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter Blockchain Address"
              style={{ marginLeft: "10px", padding: "5px", width: "300px" }}
            />
          </label>
        </div>
       <div className="mt-5">
        <button
          type="submit"
          className="w-full py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-bold font-mono"
        >
          Set Domain
        </button>
      </div>
      </form>
      {message && (
        <div style={{ marginTop: "20px", color: message.includes("successfully") ? "green" : "red" }}>
          <strong>{message}</strong>
        </div>
      )}
    </div>
  );
};

export default NameStoneComponent;

