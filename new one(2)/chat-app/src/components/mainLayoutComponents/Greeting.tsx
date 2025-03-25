import React from 'react';

interface GreetingProps {
  userProfile: any | null;
}

const Greeting: React.FC<GreetingProps> = ({ userProfile }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = userProfile?.name ? `, ${userProfile.name}` : '';

  return (
    <div className="text-center p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{getGreeting()}{userName}</h1>
      <p className="text-lg mb-6">
        How can I assist you today? Ask me anything, and I'll do my best to help!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
        <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2">💡 Quick Ideas</h3>
          <ul className="text-sm space-y-1">
            <li>• Generate creative content</li>
            <li>• Explain complex concepts</li>
            <li>• Get coding assistance</li>
            <li>• Brainstorm project ideas</li>
          </ul>
        </div>
        <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-medium mb-2">🌟 Pro Tips</h3>
          <ul className="text-sm space-y-1">
            <li>• Be specific in your questions</li>
            <li>• Upload files for context</li>
            <li>• Star important conversations</li>
            <li>• Use projects to organize chats</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Greeting;
