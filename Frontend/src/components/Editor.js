import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, onChange }) => {
  return (
    <Editor
      height="100%"
      language="php"
      theme="vs-dark"
      value={code}
      onChange={onChange}
      options={{ fontSize: 14 }}
    />
  );
};

export default CodeEditor;
