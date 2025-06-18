const Loading = ({ message = "Loading" }) => {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center font-mono text-gray-700 dark:text-gray-200">
      <div className="text-xl flex items-center gap-2">
        <span className="animate-bounce">⚙️</span>
        <span>{message}</span>
        <span className="animate-ping text-blue-500">.</span>
        <span className="animate-pulse text-blue-500">.</span>
        <span className="animate-bounce text-blue-500">.</span>
      </div>
    </div>
  );
};
export default Loading;