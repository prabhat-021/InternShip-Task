import { useState, useEffect } from "react";
import CodeEditor from "../components/Editor";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import Loading from "../components/Loading.js";

function Home() {
  const backendUrl = "https://internship-task-3ccn.onrender.com";
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [pluginHistory, setPluginHistory] = useState([]);
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState({
    generate: false,
  });
  const [currentPluginId, setCurrentPluginId] = useState(null);
  const [edit, setEdit] = useState(false); // Keep this state for tracking edit mode

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
    <div className="p-4 w-full mx-auto bg-white rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Enter plugin request"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      {edit ?
        <button 
          onClick={handleEditGenerate}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded mb-4"
        >
          Update Plugin Code
        </button> :
        <button 
          onClick={handleGenerate}
          className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded mb-4"
        >
          Generate Plugin
        </button>}
      {loading.generate && <Loading />}

      {isGenerated && (
        <>
          <div className="border border-gray-300 rounded p-2 mb-4">
            <CodeEditor code={code} onChange={setCode} />
          </div>
          <button 
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded mb-4" 
            onClick={handleSaveAndDownload}
          >
            Save Plugin
          </button>
        </>
      )}

      {!isGenerated && code && (
        <>
          <div className="border border-gray-300 rounded p-2 mb-4">
            <CodeEditor code={code} onChange={setCode} />
          </div>
          <button 
            className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded mr-2 mb-4" 
            onClick={handleCloseEditor}
          >
            Close Editor
          </button>
          <button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded mb-4" 
            onClick={handleEdit}
          >
            Update Code
          </button>
        </>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">🕘 Plugin History</h2>
      <ul className="space-y-4">
        {pluginHistory.map((plugin, idx) => (
          <li key={idx} className="border border-gray-200 rounded p-4 hover:shadow-md">
            <p className="mb-2"><strong>Prompt:</strong> {plugin.prompt}</p>
            <p className="mb-4"><strong>Date:</strong> {new Date(plugin.createdAt).toLocaleString()}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                onClick={() => handleLoadPlugin(plugin)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded text-m"
              >
                Load in Editor
              </button>
              {analysis[idx] ? 
                <button 
                  onClick={() => setAnalysis(prev => ({...prev, [idx]: ""}))} 
                  className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded text-sm"
                >
                  Close Analyze Plugin
                </button> : 
                <button 
                  onClick={() => handleAnalyze(plugin.code, idx)} 
                  className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded text-sm"
                >
                  Analyze Plugin
                </button>
              }
              <button 
                onClick={() => handleDownload(plugin.code)} 
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded text-sm"
              >
                Download Plugin
              </button>
              <button 
                onClick={() => handleDelete(plugin._id)} 
                className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded text-sm"
              >
                Delete
              </button>
              <button 
                onClick={() => handleRename(plugin._id, plugin.prompt)} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded text-sm"
              >
                Rename
              </button>
            </div>
            {loading[idx] && <Loading />}
            <div className="prose prose-sm mt-4">
              <ReactMarkdown>
                {`**Analysis:** ${analysis[idx] || "No analysis yet."}`}
              </ReactMarkdown>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
