import { useState, useEffect } from "react";
import CodeEditor from "./components/Editor";
import axios from "axios";
import "./App.css";
import ReactMarkdown from 'react-markdown';
import Loading from "./components/Loading.js"

function App() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [pluginHistory, setPluginHistory] = useState([]);
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState({
    generate: false,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/plugin-history").then((res) => {
      setPluginHistory(res.data.reverse());
    });
  }, [isGenerated, loading]);

  const handleDelete = async (id) => {
    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      await axios.delete(`http://localhost:5000/plugin/${id}`);
      setLoading(prev => ({ ...prev, [id]: false }));
      alert("Deleted successfully");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleRename = async (id, currentPrompt) => {
    const newPrompt = window.prompt("Enter new plugin prompt:", currentPrompt);
    if (!newPrompt) return;

    try {
      setLoading(prev => ({ ...prev, [id]: true }));
      await axios.put(`http://localhost:5000/plugin/${id}/rename`, { newPrompt });
      alert("Renamed successfully");
      setLoading(prev => ({ ...prev, [id]: false }));
    } catch (err) {
      alert("Rename failed");
    }
  };


  const handleGenerate = async () => {
    try {
      if (!prompt.trim()) {
        alert("Please enter a valid prompt.");
        return;
      }

      setLoading(prev => ({ ...prev, generate: true }));
      const response = await axios.post("http://localhost:5000/generate", { prompt });
      setLoading(prev => ({ ...prev, generate: false }));

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

      setIsGenerated(false);
      setCode("");
      alert("Plugin saved successfully! You can download it now.");

    } catch (err) {
      alert("Failed to save/download plugin.");
      console.error(err);
    }
  };

  const handleAnalyze = async (code, index) => {
    try {
      setLoading(prev => ({ ...prev, [index]: true }));
      const res = await axios.post("http://localhost:5000/analyze", { pluginCode: code });
      setLoading(prev => ({ ...prev, [index]: false }));
      setAnalysis((prev) => ({ ...prev, [index]: res.data.analysis }));
    } catch (err) {
      alert("Analysis failed.");
      console.error(err);
    }
  };

  const handleDownload = (pluginCode) => {
    const blob = new Blob([pluginCode], { type: 'text/php' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'woocommerce-plugin.php';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
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
      {loading.generate && <Loading />}

      {isGenerated && (
        <>
          <div className="generated-content">
            <CodeEditor code={code} onChange={setCode} />
          </div>
          <button className="download-button" onClick={handleSaveAndDownload}>
            Save Plugin
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
            <button onClick={() => handleDownload(plugin.code)} className="download_btn">
              Download Plugin
            </button>
            <button onClick={() => handleDelete(plugin._id)} className="delete_btn">Delete</button>
            <button onClick={() => handleRename(plugin._id,plugin.prompt)} className="rename_btn">Rename</button>
            {loading[idx] && <Loading />}
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
