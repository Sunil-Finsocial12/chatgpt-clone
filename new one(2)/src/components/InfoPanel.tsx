import React from 'react';
// Import the base package without any specific highlighter
import SyntaxHighlighter from 'react-syntax-highlighter';
// No need to import styles for v5.8.0 as we'll use inline styling

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  code?: {
    content: string;
    language: string;
  };
}

const InfoPanel: React.FC<InfoPanelProps> = ({ isOpen, onClose, isDarkMode, code }) => {
  const handleCopy = async () => {
    if (code) {
      try {
        await navigator.clipboard.writeText(code.content);
        // Could add a temporary success message here
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    }
  };

  if (!isOpen || !code) return null;

  return (
    <div
      className={`fixed right-0 top-0 h-full w-[400px] transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } ${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} shadow-lg z-50`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Code Preview</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Copy code"
            >
              <i className="fas fa-copy"></i>
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4">
        <div className={`rounded-lg overflow-hidden`}>
          <SyntaxHighlighter
            language={code.language || 'plaintext'}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
              color: isDarkMode ? '#e5e7eb' : '#374151'
            }}
          >
            {code.content}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
