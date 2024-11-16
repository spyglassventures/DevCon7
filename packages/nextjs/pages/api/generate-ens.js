// pages/api/proxy.js
export default async function handler(req, res) {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.status(200).end();
      return;
    }
  
    const response = await fetch("https://namestone.xyz/api/public_v1/set-name", {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...req.headers, // Forward all headers from the client
      },
      body: JSON.stringify(req.body),
    });
  
    const data = await response.json();
    res.status(response.status).json(data);
  }
  