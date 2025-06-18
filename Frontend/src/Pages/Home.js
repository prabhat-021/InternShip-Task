import { useState, useEffect } from "react";
import CodeEditor from "../components/Editor";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import Loading from "../components/Loading.js";

function Home() {
  const backendUrl = "https://llmagentbackend.vercel.app";
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
  const fetchPluginHistory = async () => {
    try {
      const csrfToken = await getCSRFToken();
      const res = await axios.get(`${backendUrl}/plugins/plugin-history`, {
        headers: { 'csrf-token': csrfToken },
        withCredentials: true,
      });
      setPluginHistory(res.data.reverse());
    } catch (err) {
      console.error("Failed to load plugin history:", err);
    }
  };

  fetchPluginHistory(); // ✅ Call it
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
      setEdit(false); // Reset edit mode when generating new code

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
      const response = await axios.post(`${backendUrl}/plugins/edit-generate`, { prompt, code },
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
      setEdit(false); // Reset edit mode after saving
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
      console.log(csrfToken);
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
    setPrompt("");
    setCurrentPluginId(null);
    setEdit(false);
  };

  return (
    <div className="flex h-screen font-sans">
      <aside className="w-1/4 bg-gray-100 border-r overflow-y-auto p-4">
        <h2 className="text-xl font-semibold mb-4">🕘 Plugin History</h2>
        <ul className="space-y-4">
          {pluginHistory.map((plugin, idx) => (
            <li key={idx} className="bg-white rounded shadow p-3 border">
              <p className="text-sm font-medium">🔖 {plugin.prompt}</p>
              <p className="text-xs text-gray-500 mb-2">{new Date(plugin.createdAt).toLocaleString()}</p>
              <div className="flex flex-wrap gap-1 text-xs">
                <button onClick={() => handleLoadPlugin(plugin)} className="text-blue-600 underline">Load</button>
                <button onClick={() => handleDownload(plugin.code)} className="text-green-600 underline">Download</button>
                <button onClick={() => handleDelete(plugin._id)} className="text-red-500 underline">Delete</button>
                <button onClick={() => handleRename(plugin._id, plugin.prompt)} className="text-yellow-600 underline">Rename</button>
                {analysis[idx] ? (
                  <button onClick={() => setAnalysis((prev) => ({ ...prev, [idx]: "" }))} className="text-gray-600 underline">Close</button>
                ) : (
                  <button onClick={() => handleAnalyze(plugin.code, idx)} className="text-purple-600 underline">Analyze</button>
                )}
              </div>
              {loading[idx] && <Loading message="🔍 Analyzing plugin for bugs and security issues..." />}
              {analysis[idx] && (
                <ReactMarkdown>{`**Analysis:**\n${analysis[idx]}`}</ReactMarkdown>
              )}
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter plugin request..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
          />
          {edit ? (
            <button onClick={handleEditGenerate} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Edit & Generate
            </button>
          ) : (
            <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Generate Plugin
            </button>
          )}
          {loading.generate && <Loading message="🧠 Processing prompt and writing plugin code..." />}
        </div>
        <div className="flex gap-4">
          {isGenerated && (
            <button onClick={handleSaveAndDownload} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Save & Download
            </button>
          )}
          {!isGenerated && code && (
            <>
              <button onClick={handleEdit} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                Update Plugin
              </button>
              <button onClick={handleCloseEditor} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Close Editor
              </button>
            </>
          )}
        </div>
        <div className="flex-1 border rounded overflow-hidden mb-4" >
          <CodeEditor code={code} onChange={setCode} />
        </div>


      </main>
    </div>
  );

}

export default Home;
