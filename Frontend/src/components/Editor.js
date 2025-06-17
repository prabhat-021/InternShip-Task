import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, onChange }) => {
  return (
    <div style={{ height: "500px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <Editor
        height="100%"
        language="php"
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{ fontSize: 14 }}
      />
    </div>
  );
};

export default CodeEditor;
