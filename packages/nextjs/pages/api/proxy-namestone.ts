import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.NEXT_PUBLIC_NAMESTONE_API_KEY; // Ensure this matches the API key used in your curl

  if (!apiKey) {
    console.error("API key is missing");
    return res.status(401).json({ error: "API key is missing" });
  }

  const { domain, address, text_records } = req.body;

  if (!domain || !address || !text_records) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await fetch("https://namestone.xyz/api/public_v1/set-domain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey, // Pass the raw API key
      },
      body: JSON.stringify({ domain, address, text_records }),
    });

    const rawResponse = await response.text(); // Read the raw response

    if (!response.ok) {
      console.error("Error response from NameStone API:", rawResponse);
      return res.status(response.status).json({ error: rawResponse });
    }

    const data = JSON.parse(rawResponse); // Parse as JSON
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
