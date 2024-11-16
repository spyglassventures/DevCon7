import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in the .env.local file
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { ethAddress } = req.body;

  if (!ethAddress) {
    return res.status(400).send({ message: "ETH address is required" });
  }

  try {
    const response = await openai.images.generate({
      prompt: `Create a visually captivating and cyberpunk-inspired artistic representation of the Ethereum address: ${ethAddress}. The design should feature bold, futuristic elements and vibrant neon colors to emphasize the .eth domain style.`,
      n: 1,
      size: "1024x1024",
    });

    const imageData = response.data[0].url;

    // Fetch the image data as a buffer
    const imageResponse = await fetch(imageData);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Set headers for in-memory image response
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `inline; filename="${ethAddress}.png"`);

    // Send the buffer as the response
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).send({ message: "Error generating image", error });
  }
}
