import React, { useState } from "react";
import CodeEditor from "./components/Editor";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("// Plugin code will appear here...");

  const handleGenerate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/generate", { prompt });
      setCode(response.data.pluginCode);
    } catch (err) {
      alert("Failed to generate plugin.");
      console.error(err);
    }
  };

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🧠 WooPlugin LLM Agent</h1>
      <input
        type="text"
        placeholder="Enter plugin request, e.g. 'Change button color to blue'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", padding: "0.5rem", fontSize: "16px", margin: "1rem 0" }}
      />
      <button onClick={handleGenerate} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Generate Plugin
      </button>
      <div style={{ marginTop: "2rem" }}>
        <CodeEditor code={code} onChange={(value) => setCode(value)} />
      </div>
    </div>
  );
}

export default App;
