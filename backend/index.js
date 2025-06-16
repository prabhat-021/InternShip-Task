const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const Plugin = require("./models/plugin.js");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

mongoose.connect(process.env.MONGO_URI).then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("MongoDB Error:", err));

// app.post("/generate", async (req, res) => {
//     const { prompt } = req.body;


//     if (!prompt || typeof prompt !== "string") {
//         return res.status(400).json({ error: "Invalid prompt provided." });
//     }

//     try {
//         const fullPrompt = `
// You are an expert WordPress/WooCommerce developer.
// Generate a clean, secure WooCommerce plugin in PHP as a single file.
// Respond ONLY with PHP code. 
// Task: "${prompt}"
//     `;

//         const result = await model.generateContent(fullPrompt);
//         const response = await result.response;
//         const pluginCode = response.text();

//         res.json({ pluginCode });
//     } catch (error) {
//         console.error("Gemini Error:", error);
//         res.status(500).json({ error: "Failed to generate plugin." });
//     }
// });

// app.post("/generateAndDownload", async (req, res) => {
//     const { prompt } = req.body;

//     try {
//         const fullPrompt = `
// You are an expert WordPress/WooCommerce developer.
// Generate a clean, secure WooCommerce plugin in PHP as a single file.
// Respond ONLY with PHP code.
// Task: "${prompt}"
//     `;

//         const result = await model.generateContent(fullPrompt);
//         const response = await result.response;
//         const pluginCode = response.text();

//         const fileName = `woocommerce-custom-plugin-${Date.now()}.php`;
//         const filePath = path.join(__dirname, "plugins", fileName);

//         // Make sure /plugins directory exists
//         fs.mkdirSync(path.join(__dirname, "plugins"), { recursive: true });

//         // Write the plugin code to a .php file
//         fs.writeFileSync(filePath, pluginCode);

//         // Save to DB
//         await Plugin.create({ prompt, code: pluginCode });

//         res.download(filePath, fileName);

//         res.json({ pluginCode });
//     } catch (error) {
//         console.error("Download Error:", error);
//         res.status(500).json({ error: "Plugin generation failed." });
//     }
// });

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
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: "Generation failed." });
    }
});

// Save modified code and download
app.post("/save", async (req, res) => {
    const { prompt, code } = req.body;

    try {
        // const fileName = `woo-plugin-${Date.now()}.php`;
        // const filePath = path.join(__dirname, "plugins", fileName);

        // fs.mkdirSync(path.join(__dirname, "plugins"), { recursive: true });

        // fs.writeFileSync(filePath, code);
        await Plugin.create({ prompt, code });

        res.json({ suscess: true, message: "Plugin saved successfully." });
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ error: "Failed to save plugin." });
    }
});

app.post("/analyze", async (req, res) => {
    const { pluginCode } = req.body;
    try {
        const prompt = `
You are an expert WordPress plugin security reviewer and developer.

1. Explain what this plugin does.
2. Identify any possible security risks or bad practices.
3. Suggest any improvements in code quality or structure.
4. Provide the output in short Points of  5-10 points , structured format.

Plugin Code:
\`\`\`php
${pluginCode}
\`\`\`
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response.text();

        res.json({ analysis: response });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to analyze plugin." });
    }
});

app.get("/plugin-history", async (req, res) => {
    const plugins = await Plugin.find();
    console.log("Plugin History:", plugins);
    res.json(plugins);
});

app.delete("/plugin/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const plugin = await Plugin.findByIdAndDelete(id);
    if (!plugin) return res.status(404).json({ error: "Plugin not found" });
    res.json({ message: "Plugin deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete plugin" });
  }
});

app.put("/plugin/:id/rename", async (req, res) => {
  const { id } = req.params;
  const { newPrompt } = req.body;

  try {
    const plugin = await Plugin.findById(id);
    if (!plugin) return res.status(404).json({ error: "Plugin not found" });

    plugin.prompt = newPrompt;
    await plugin.save();

    res.json({ message: "Plugin renamed successfully", plugin });
  } catch (err) {
    console.error("Rename Error:", err);
    res.status(500).json({ error: "Failed to rename plugin" });
  }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
