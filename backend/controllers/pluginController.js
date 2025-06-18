const Plugin = require('../models/plugin.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

exports.generatePlugin = async (req, res) => {
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
};

exports.savePlugin = async (req, res) => {
    const { prompt, code } = req.body;

    try {

        //         const fileName = `woocommerce-custom-plugin-${Date.now()}.php`;
        //         const filePath = path.join(__dirname, "plugins", fileName);

        //         fs.mkdirSync(path.join(__dirname, "plugins"), { recursive: true });

        //         fs.writeFileSync(filePath, pluginCode);

        //         res.download(filePath, fileName);
        
        await Plugin.create({ prompt, code });
        res.json({ success: true, message: "Plugin saved successfully." });
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ error: "Failed to save plugin." });
    }
};

exports.analyzePlugin = async (req, res) => {
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
};

exports.getPluginHistory = async (req, res) => {
    try {
        const plugins = await Plugin.find();
        res.json(plugins);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch plugins" });
    }
};

exports.deletePlugin = async (req, res) => {
    const { id } = req.params;
    try {
        const plugin = await Plugin.findByIdAndDelete(id);
        if (!plugin) return res.status(404).json({ error: "Plugin not found" });
        res.json({ message: "Plugin deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Failed to delete plugin" });
    }
};

exports.renamePlugin = async (req, res) => {
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
};

exports.updatePlugin = async (req, res) => {
    const { id } = req.params;
    const { code, prompt } = req.body;

    try {
        const plugin = await Plugin.findById(id);
        if (!plugin) return res.status(404).json({ error: "Plugin not found" });

        plugin.code = code;
        if (prompt) plugin.prompt = prompt;
        await plugin.save();

        res.json({ message: "Plugin updated successfully", plugin });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Failed to update plugin" });
    }
};

exports.generateEditPlugin = async (req, res) => {
    const { prompt, code } = req.body;

    try {
        const fullPrompt = `
You are an expert WordPress/WooCommerce developer.
Refactor the following WooCommerce plugin code to match the new requirements.
Respond ONLY with PHP code.
Current Code:
\`\`\`php
${code}
\`\`\`
New Requirements: "${prompt}"
    `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const pluginCode = response.text();

        res.json({ pluginCode });
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: "Generation failed." });
    }
};
