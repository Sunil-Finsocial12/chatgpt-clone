import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ActionCapsulesProps {
  isDarkMode: boolean;
  onActionClick: (action: string, suggestion?: string) => void;
}

const ActionCapsules: React.FC<ActionCapsulesProps> = ({ isDarkMode, onActionClick }) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Handle outside clicks
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
      setActiveAction(null);
    }
  }, []);

  useEffect(() => {
    // Add event listener when a popup is open
    if (activeAction) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeAction, handleClickOutside]);

  const handleCapsuleClick = (e: React.MouseEvent, actionId: string) => {
    e.stopPropagation(); // Prevent immediate closure
    setActiveAction(activeAction === actionId ? null : actionId);
    onActionClick(actionId);
  };

  const actions = [
    { 
      id: 'explain',
      icon: 'fa-lightbulb',
      text: 'Explain this',
      suggestions: [
        'Explain in simple terms',
        'Explain with examples',
        'Explain step by step',
        'Explain with analogies'
      ]
    },
    { 
      id: 'summarize',
      icon: 'fa-file-alt',
      text: 'Summarize',
      suggestions: [
        'Key points summary',
        'Brief overview',
        'Detailed summary',
        'Executive summary'
      ]
    },
    { 
      id: 'translate',
      icon: 'fa-language',
      text: 'Translate',
      suggestions: [
        'Translate to Hindi',
        'Translate to Spanish',
        'Translate to French',
        'Translate to German'
      ]
    },
    { 
      id: 'improve',
      icon: 'fa-magic',
      text: 'Improve writing',
      suggestions: [
        'Make more professional',
        'Make more concise',
        'Fix grammar',
        'Enhance vocabulary'
      ]
    },
    { 
      id: 'code',
      icon: 'fa-code',
      text: 'Generate code',
      suggestions: [
        'Generate in Python',
        'Generate in JavaScript',
        'Generate in Java',
        'Create API endpoint'
      ]
    }
  ];

  return (
    <div className="space-y-2 mt-4" ref={actionsRef}>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {actions.map((action) => (
          <div key={action.id} className="relative">
            <button
              onClick={(e) => handleCapsuleClick(e, action.id)}
              className={`
                flex items-center px-4 py-2 rounded-full
                backdrop-blur-md transition-all duration-300
                hover:scale-105 active:scale-95
                ${isDarkMode 
                  ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-200' 
                  : 'bg-white/50 hover:bg-gray-50/50 text-gray-700 shadow-sm'
                }
                ${activeAction === action.id ? (isDarkMode ? 'ring-2 ring-blue-500' : 'ring-2 ring-indigo-500') : ''}
              `}
            >
              <i className={`fas ${action.icon} mr-2 text-sm ${
                isDarkMode ? 'text-blue-400' : 'text-blue-500'
              }`}></i>
              <span className="text-sm font-medium">{action.text}</span>
            </button>

            {/* Suggestions dropdown */}
            {activeAction === action.id && (
              <div 
                className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden z-50 ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside dropdown from closing it
              >
                {action.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onActionClick(action.id, suggestion);
                      setActiveAction(null);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionCapsules;
