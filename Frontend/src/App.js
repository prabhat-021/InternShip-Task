import { useState, useEffect } from "react";
import CodeEditor from "./components/Editor";
import axios from "axios";
import "./App.css";
import ReactMarkdown from 'react-markdown';

function App() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [pluginHistory, setPluginHistory] = useState([]);
  const [analysis, setAnalysis] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/plugin-history").then((res) => {
      setPluginHistory(res.data);
    });
  }, []);

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

  const handleAnalyze = async (code, index) => {
    try {
      const res = await axios.post("http://localhost:5000/analyze", { pluginCode: code });
      setAnalysis((prev) => ({ ...prev, [index]: res.data.analysis }));
    } catch (err) {
      alert("Analysis failed.");
      console.error(err);
    }
  };

  const handleDownlaod = (pluginCode) => {
    // const blob = new Blob([pluginCode], { type: "text/plain;charset=utf-8" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = `woo-plugin-${Date.now()}.php`;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  }

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

      {!isGenerated && code && (
        <>
          <div className="generated-content">
            <CodeEditor code={code} onChange={setCode} />
          </div>
          <button className="download-button" onClick={() => setCode(null)}>
            Close Editor
          </button>
        </>
      )}

      <h2>🕘 Plugin History</h2>
      <ul>
        {pluginHistory.map((plugin, idx) => (
          <li key={idx} className="plugin_item">
            <p><strong>Prompt:</strong> {plugin.prompt}</p>
            <p><strong>Date:</strong> {new Date(plugin.createdAt).toLocaleString()}</p>
            <button onClick={() => setCode(plugin.code)}>Load in Editor</button>
            {analysis[idx] ? <button onClick={() => setAnalysis(analysis[idx] = "")} className="analyze_btn_close">
              Close Analyze Plugin
            </button> : <button onClick={() => handleAnalyze(plugin.code, idx)} className="analyze_btn">
              Analyze Plugin
            </button>}
            <button onClick={() => handleDownlaod(plugin.pluginCode)} className="download_btn">
              Download Plugin
            </button>
            <ReactMarkdown>
              {`**Analysis:** ${analysis[idx] || "No analysis yet."}`}
            </ReactMarkdown>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
