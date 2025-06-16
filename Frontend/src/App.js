import React, { useState } from "react";
import CodeEditor from "./components/Editor";
import axios from "axios";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("// Plugin code will appear here...");
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = async () => {
    try {
      const response = await axios.post("http://localhost:5000/generate", { prompt });
      setCode(response.data.pluginCode);
      setIsGenerated(true);
    } catch (err) {
      alert("Failed to generate plugin.");
      console.error(err);
    }
  };

  const handleSaveAndDownload = async () => {
    try {
      await axios.post("http://localhost:5000/save", {
        prompt,
        code,
      });

      window.location.reload();

    } catch (err) {
      alert("Failed to save/download plugin.");
      console.error(err);
    }
  };

  return (
    <div className="App">
      <h1>🧠 WooPlugin LLM Agent</h1>
      <input
        type="text"
        placeholder="Enter plugin request"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleGenerate}>
        Generate Plugin
      </button>

      {isGenerated && (
        <>
          <div className="generated-content">
            <CodeEditor code={code} onChange={setCode} />
          </div>
          <button className="download-button" onClick={handleSaveAndDownload}>
            Save & Download Edited Plugin
          </button>
        </>
      )}
    </div>
  );
}

export default App;
