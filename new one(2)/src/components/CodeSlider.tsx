import { useState, useEffect } from "react";
// Import the base package without any specific highlighter
import SyntaxHighlighter from "react-syntax-highlighter";

interface CodeSliderProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  language: string;
  isDarkMode: boolean;
  onEdit: (code: string) => void;
  onSendMessage?: (message: string) => void;
}

const CodeSlider: React.FC<CodeSliderProps> = ({
  isOpen,
  onClose,
  code,
  language,
  isDarkMode,
  onEdit,
  onSendMessage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCode, setEditableCode] = useState(code);

  useEffect(() => {
    setEditableCode(code);
  }, [code]);

  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 2000);
  };

  // Add language to file extension mapping
  const getFileExtension = (language: string): string => {
    const extensionMap: { [key: string]: string } = {
      python: 'py',
      javascript: 'js',
      typescript: 'ts',
      java: 'java',
      cpp: 'cpp',
      'c++': 'cpp',
      c: 'c',
      csharp: 'cs',
      'c#': 'cs',
      php: 'php',
      ruby: 'rb',
      swift: 'swift',
      kotlin: 'kt',
      go: 'go',
      rust: 'rs',
      scala: 'scala',
      dart: 'dart',
      html: 'html',
      css: 'css',
      scss: 'scss',
      sql: 'sql',
      r: 'r',
      perl: 'pl',
      shell: 'sh',
      bash: 'sh',
      powershell: 'ps1',
      lua: 'lua',
      matlab: 'm',
      groovy: 'groovy',
      dockerfile: 'dockerfile',
      yaml: 'yml',
      json: 'json',
      xml: 'xml',
      markdown: 'md',
      plaintext: 'txt'
    };

    const normalizedLang = language.toLowerCase();
    return extensionMap[normalizedLang] || 'txt';
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      showNotification('Copied to clipboard!');
    } catch (error) {
      showNotification('Failed to copy code', 'error');
    }
  };

  // Fix the template literal in handleDownload
  const handleDownload = () => {
    try {
      const fileExtension = getFileExtension(language);
      const blob = new Blob([code], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `code_${timestamp}.${fileExtension}`; // Fixed string template
      
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showNotification('File downloaded successfully!');
    } catch (error) {
      showNotification('Failed to download file', 'error');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onEdit) {
      onEdit(editableCode);
    }
    showNotification('Changes saved successfully!');
  };

  const [showChatInput, setShowChatInput] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const handleSendMessage = () => {
    if (chatMessage.trim() && onSendMessage) {
      onSendMessage(chatMessage);
      setChatMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Centered Notification - moved to top */}
      <div
        className={`fixed top-6 inset-x-0 pointer-events-none flex items-start justify-center z-[60] ${
          notification.show ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className={`transform transition-all duration-300 ${
          notification.show ? 'translate-y-0' : '-translate-y-4'
        }`}>
          <div className={`px-6 py-3 rounded-lg shadow-xl backdrop-blur-sm flex items-center space-x-2 ${
            notification.type === 'success'
              ? isDarkMode
                ? 'bg-green-500/90 text-white'
                : 'bg-green-100/95 text-green-800'
              : isDarkMode
                ? 'bg-red-500/90 text-white'
                : 'bg-red-100/95 text-red-800'
          }`}>
            <i className={`fas ${
              notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
            }`}></i>
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet overlay */}
      <div className="lg:hidden fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
        {/* Modified slider panel for better mobile responsiveness */}
        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-[calc(100%-2rem)] md:w-3/4 lg:w-2/3 
            transform transition-transform duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          } shadow-xl overflow-hidden flex flex-col`}
        >
          {/* Header - modified for mobile */}
          <div
            className={`flex items-center justify-between p-3 sm:p-4 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
              <div
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm truncate ${
                  isDarkMode
                    ? 'bg-gray-800 text-blue-400'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {language}
              </div>
              <h3 className={`font-medium text-sm sm:text-base truncate ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                Code Preview
              </h3>
            </div>

            {/* Action buttons - modified for mobile */}
            <div className="flex items-center">
              <button
                onClick={isEditing ? handleSave : handleEdit}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-blue-400'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                }`}
                aria-label="Edit code"
              >
                <i className={`fas ${isEditing ? 'fa-save' : 'fa-edit'}`}></i>
              </button>
              <button
                onClick={handleCopyCode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-blue-400'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                }`}
                aria-label="Copy code"
              >
                <i className="fas fa-copy text-sm sm:text-base"></i>
              </button>
              <button
                onClick={handleDownload}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-blue-400'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                }`}
                aria-label="Download code"
              >
                <i className="fas fa-download text-sm sm:text-base"></i>
              </button>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-800 text-gray-400 hover:text-blue-400'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                }`}
                aria-label="Close"
              >
                <i className="fas fa-times text-sm sm:text-base"></i>
              </button>
            </div>
          </div>

          {/* Code content - improved scrolling and responsiveness */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto overscroll-contain p-2 sm:p-4">
              {isEditing ? (
                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className={`w-full h-full p-4 font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-500 
                    ${isDarkMode 
                      ? 'bg-gray-800 text-gray-200 border-gray-700' 
                      : 'bg-gray-50 text-gray-800 border-gray-200'
                    } border resize-none`}
                  spellCheck="false"
                />
              ) : (
                <pre
                  className={`rounded-lg p-3 sm:p-4 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                  } overflow-x-auto`}
                >
                  <code
                    className={`language-${language.toLowerCase()} ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    } text-sm sm:text-base font-mono whitespace-pre-wrap break-all`}
                  >
                    {editableCode}
                  </code>
                </pre>
              )}
            </div>
          </div>

          {/* Mobile action bar - only shows on small screens */}
          <div className={`sm:hidden flex items-center justify-around p-3 border-t ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}>
            <button
              onClick={handleCopyCode}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 active:bg-gray-600'
                  : 'bg-white text-gray-700 active:bg-gray-100'
              } shadow-sm`}
            >
              <i className="fas fa-copy"></i>
              <span>Copy</span>
            </button>
            <button
              onClick={handleDownload}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 active:bg-gray-600'
                  : 'bg-white text-gray-700 active:bg-gray-100'
              } shadow-sm`}
            >
              <i className="fas fa-download"></i>
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-200 active:bg-gray-600'
                  : 'bg-white text-gray-700 active:bg-gray-100'
              } shadow-sm`}
            >
              <i className="fas fa-times"></i>
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop fixed panel - keeping original width w-[35%] */}
      <div className={`hidden lg:block fixed right-0 top-0 bottom-0 w-[60%] z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
        onMouseEnter={() => setShowChatInput(true)}
        onMouseLeave={() => setShowChatInput(false)}
      >
        {/* Semi-transparent backdrop */}
        <div className={`absolute inset-0 ${
          isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'
        } backdrop-blur-sm -z-10`} />
        
        <div className={`w-full h-full flex flex-col ${
          isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'
        } shadow-xl border-l ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            
            <button
              onClick={isEditing ? handleSave : handleEdit}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <i className={`fas ${isEditing ? 'fa-save' : 'fa-edit'}`}></i>
            </button>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                {language}
              </span>
              <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                Code Preview
              </h3>
            </div>
            
            <div className="flex items-center space-x-2">
              <button onClick={handleCopyCode} className={`p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <i className="fas fa-copy"></i>
              </button>
              <button onClick={handleDownload} className={`p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <i className="fas fa-download"></i>
              </button>
              <button onClick={onClose} className={`p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Code content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto p-4">
              {isEditing ? (
                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className={`w-full h-full p-4 font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-500 
                    ${isDarkMode 
                      ? 'bg-gray-800 text-gray-200 border-gray-700' 
                      : 'bg-gray-50 text-gray-800 border-gray-200'
                    } border resize-none`}
                  spellCheck="false"
                />
              ) : (
                <SyntaxHighlighter
                  language={language.toLowerCase()}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    fontSize: '14px',
                    backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                    color: isDarkMode ? '#e5e7eb' : '#374151'
                  }}
                >
                  {editableCode}
                </SyntaxHighlighter>
              )}
            </div>
          </div>

          {/* Chat input section */}
          {onSendMessage && showChatInput && (
            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-200 border-gray-700' 
                      : 'bg-white text-gray-800 border-gray-200'
                  } border`}
                  placeholder="Ask about the code..."
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CodeSlider;