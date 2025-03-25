import React from 'react';

interface ActionCapsulesProps {
  isDarkMode: boolean;
  onActionClick: (action: string, suggestion?: string) => void;
}

const ActionCapsules: React.FC<ActionCapsulesProps> = ({ isDarkMode, onActionClick }) => {
  const actionGroups = [
    {
      title: "Explain Concepts",
      action: "explain",
      examples: ["Explain machine learning", "Explain blockchain", "Explain quantum computing"]
    },
    {
      title: "Write Content",
      action: "improve",
      examples: ["Write a blog post", "Create a product description", "Draft an email"]
    },
    {
      title: "Generate Code",
      action: "code",
      examples: ["Generate React component", "Write a Python function", "Create a SQL query"]
    }
  ];

  return (
    <div className={`flex flex-col gap-6 mt-8 max-w-3xl mx-auto`}>
      {actionGroups.map((group, index) => (
        <div key={index} className="w-full">
          <h3 className={`mb-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {group.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.examples.map((example, i) => (
              <button
                key={i}
                onClick={() => onActionClick(group.action, example)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActionCapsules;
