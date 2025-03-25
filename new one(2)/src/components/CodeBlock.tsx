import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);

interface CodeBlockProps {
  code: string;
  language: string;
  isDarkMode: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, isDarkMode }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = code.${language};
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`relative group rounded-lg overflow-hidden ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <span className={`text-sm font-mono ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {language}
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-600 text-gray-400 hover:text-blue-400' 
                : 'hover:bg-gray-200 text-gray-500 hover:text-blue-600'
            }`}
            title="Copy code"
          >
            {isCopied ? (
              <i className="fas fa-check text-green-500"></i>
            ) : (
              <i className="fas fa-copy"></i>
            )}
          </button>
          <button
            onClick={handleDownload}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-600 text-gray-400 hover:text-blue-400' 
                : 'hover:bg-gray-200 text-gray-500 hover:text-blue-600'
            }`}
            title="Download code"
          >
            <i className="fas fa-download"></i>
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={isDarkMode ? atomOneDark : githubGist}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;