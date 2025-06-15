// /api/agent-console.ts
const { OpenAI } = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, agent, context } = req.body;
  if (!prompt || !agent) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: `You are ${agent}. ${context || ""}` },
        { role: "user", content: prompt },
      ],
    });

    const message = response.choices?.[0]?.message?.content || "No response";
    res.status(200).json({ response: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
