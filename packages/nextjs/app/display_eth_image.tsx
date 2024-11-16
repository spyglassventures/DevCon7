"use client";

import React, { useState } from "react";

const DisplayEthImage: React.FC<{ ethName: string }> = ({ ethName }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ethAddress: ethName }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } else {
        console.error("Failed to generate image.", await response.text());
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={generateImage}
        className="mt-4 px-4 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-green-500 hover:text-gray-900 font-mono"
        disabled={loading}
      >
        {loading ? "Generating Image..." : `Generate Image for ${ethName}`}
      </button>
      {imageUrl && (
        <div className="mt-6">
          <img src={imageUrl} alt={`${ethName} representation`} className="w-full max-w-md rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default DisplayEthImage;
