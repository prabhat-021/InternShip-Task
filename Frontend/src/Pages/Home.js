import { useState, useEffect } from "react";
import CodeEditor from "../components/Editor";
import axios from "axios";
import "./Home.css";
import ReactMarkdown from 'react-markdown';
import Loading from "../components/Loading.js"

function Home() {
  const backendUrl = "http://localhost:5000";
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [pluginHistory, setPluginHistory] = useState([]);
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState({
    generate: false,
  });
  const [currentPluginId, setCurrentPluginId] = useState(null);
  const [edit, setEdit] = useState(false);

  const getCSRFToken = async () => {
    const res = await axios.get(`${backendUrl}/csrf-token`, { withCredentials: true });
    return res.data.csrfToken;
  };

  useEffect(() => {
    axios.get(`${backendUrl}/plugins/plugin-history`, {
      headers: { 'csrf-token': getCSRFToken() }, withCredentials: true
    }).then((res) => {
      setPluginHistory(res.data.reverse());
    });
  }, [isGenerated, loading]);

  const handleDelete = async (id) => {
    try {
      const csrfToken = await getCSRFToken();
      setLoading(prev => ({ ...prev, [id]: true }));
      await axios.delete(`${backendUrl}/plugins/${id}`, {
        headers: {
          'csrf-token': csrfToken,
        },
        withCredentials: true
      });

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
      const csrfToken = await getCSRFToken();
      setLoading(prev => ({ ...prev, [id]: true }));
      await axios.put(`${backendUrl}/plugins/${id}/rename`, { newPrompt },
        {
          headers: {
            'csrf-token': csrfToken,
          },
          withCredentials: true
        }
      );
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

      setCurrentPluginId(null);

      const csrfToken = await getCSRFToken();

      setLoading(prev => ({ ...prev, generate: true }));
      const response = await axios.post(`${backendUrl}/plugins/generate`, { prompt },
        {
          headers: {
            'csrf-token': csrfToken,
          },
          withCredentials: true
        }
      );
      setLoading(prev => ({ ...prev, generate: false }));

      setCode(response.data.pluginCode);
      setIsGenerated(true);

    } catch (err) {
      alert("Failed to generate plugin.");
      console.error(err);
    }
  };

  const handleEditGenerate = async () => {
    try {
      if (!prompt.trim()) {
        alert("Please enter a valid prompt.");
        return;
      }

      const csrfToken = await getCSRFToken();

      setLoading(prev => ({ ...prev, generate: true }));
      const response = await axios.post(`${backendUrl}/plugins/edit-generate`, { prompt , code },
        {
          headers: {
            'csrf-token': csrfToken,
          },
          withCredentials: true
        }
      );

      setLoading(prev => ({ ...prev, generate: false }));

      setCode(response.data.pluginCode);

    } catch (err) {
      alert("Failed to generate plugin.");
      console.error(err);
    }
  };

  const handleSaveAndDownload = async () => {
    try {
      const csrfToken = await getCSRFToken();
      await axios.post(`${backendUrl}/plugins/save`,
        { prompt, code },
        {
          headers: { 'csrf-token': csrfToken },
          withCredentials: true
        },
      );

      setIsGenerated(false);
      setCode("");
      setCurrentPluginId(null);
      alert("Plugin saved successfully! You can download it now.");

    } catch (err) {
      alert("Failed to save/download plugin.");
      console.error(err);
    }
  };

  const handleAnalyze = async (code, index) => {
    try {
      const csrfToken = await getCSRFToken();
      setLoading(prev => ({ ...prev, [index]: true }));

      const res = await axios.post(`${backendUrl}/plugins/analyze`, { pluginCode: code },
        {
          headers: { 'csrf-token': csrfToken },
          withCredentials: true
        }
      );

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

  const handleEdit = async () => {
    try {
      if (!code.trim()) {
        alert("No code to update.");
        return;
      }

      if (!currentPluginId) {
        alert("Cannot update: No plugin selected from history.");
        return;
      }

      const csrfToken = await getCSRFToken();
      setLoading(prev => ({ ...prev, edit: true }));

      await axios.put(`${backendUrl}/plugins/update/${currentPluginId}`,
        { code, prompt },
        {
          headers: { 'csrf-token': csrfToken },
          withCredentials: true
        },
      );

      setLoading(prev => ({ ...prev, edit: false }));
      alert("Plugin updated successfully!");

    } catch (err) {
      alert("Failed to update plugin.");
      console.error(err);
    }
  }

  const handleLoadPlugin = (plugin) => {
    setCode(plugin.code);
    setPrompt(plugin.prompt);
    setCurrentPluginId(plugin._id);
    setIsGenerated(false);
    setEdit(true);
  };

  const handleCloseEditor = () => {
    setCode(null);
    setEdit(false);
    setPrompt("");
    setCurrentPluginId(null);
  };

  return (
    <div className="Home">
      <input
        type="text"
        placeholder="Enter plugin request"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      {edit ?
        <button onClick={handleEditGenerate}>
          Update Plugin Code
        </button> :
        <button onClick={handleGenerate}>
          Generate Plugin
        </button>}
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
          <button className="download-button" onClick={handleCloseEditor}>
            Close Editor
          </button>
          <button className="download-button" onClick={handleEdit}>
            Update Code
          </button>
        </>
      )}

      <h2>🕘 Plugin History</h2>
      <ul>
        {pluginHistory.map((plugin, idx) => (
          <li key={idx} className="plugin_item">
            <p><strong>Prompt:</strong> {plugin.prompt}</p>
            <p><strong>Date:</strong> {new Date(plugin.createdAt).toLocaleString()}</p>
            <button onClick={() => handleLoadPlugin(plugin)}>Load in Editor</button>
            {analysis[idx] ? <button onClick={() => setAnalysis(analysis[idx] = "")} className="analyze_btn_close">
              Close Analyze Plugin
            </button> : <button onClick={() => handleAnalyze(plugin.code, idx)} className="analyze_btn">
              Analyze Plugin
            </button>}
            <button onClick={() => handleDownload(plugin.code)} className="download_btn">
              Download Plugin
            </button>
            <button onClick={() => handleDelete(plugin._id)} className="delete_btn">Delete</button>
            <button onClick={() => handleRename(plugin._id, plugin.prompt)} className="rename_btn">Rename</button>
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

export default Home;
