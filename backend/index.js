const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const fullPrompt = `
You are an expert WordPress/WooCommerce developer.
Generate a clean, secure WooCommerce plugin in PHP as a single file.
Respond ONLY with PHP code.
Task: "${prompt}"
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const pluginCode = response.text();

    res.json({ pluginCode });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate plugin." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
