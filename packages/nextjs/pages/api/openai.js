import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is properly set in the .env.local file
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send({ message: "Only POST requests allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send({ message: "Prompt is required" });
  }

  const customMessage = "Characterize the user based on the transactions counterparts, value and recency of trades. Then come up with interesting, yet descriptive .eth address that suit the user and would catch his attention, making him interested in registering the .ens address. Show at  least 3 .eth addresses";

  const combinedPrompt = `${customMessage}\n\n${prompt}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "o1-mini", // Adjust the model as needed
      messages: [{ role: "user", content: combinedPrompt }],
    });

    res.status(200).json({ answer: completion.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    res.status(500).send({ message: "Error communicating with OpenAI API", error });
  }
}
