const AIThoughtProcess = ({ 
  isGenerating, 
  reasoning, 
  isDarkMode 
}: { 
  isGenerating: boolean; 
  reasoning: string; 
  isDarkMode: boolean; 
}) => {
  if (isGenerating) {
    return (
      <div
        className={`flex items-center space-x-2 text-sm ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        <span className="font-medium">Thinking...</span>
      </div>
    );
  }

  if (reasoning) {
    return (
      <div
        className={`text-sm p-3 rounded-lg ${
          isDarkMode ? "text-gray-300 bg-gray-800" : "text-gray-700 bg-gray-100"
        }`}
      >
        <span className="font-medium text-blue-400">AI Reasoning:</span>
        <p className="mt-1">{reasoning}</p>
      </div>
    );
  }

  return null;
};

export default AIThoughtProcess;
