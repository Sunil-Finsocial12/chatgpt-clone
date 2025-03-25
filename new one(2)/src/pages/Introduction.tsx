import React, { useState, useEffect } from 'react';

interface IntroductionProps {
  onComplete: (name: string) => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onComplete }) => {
  const [fullName, setFullName] = useState('');
  const [displayText1, setDisplayText1] = useState('');
  const [displayText2, setDisplayText2] = useState('');
  const [displayText3, setDisplayText3] = useState('');
  const [isGreeted, setIsGreeted] = useState(false);
  const [greetingName, setGreetingName] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const text1 = "Hello, I'm Hind AI.";
  const text2 = "I'm an intelligent AI assistant designed to enhance your work experience with precision and reliability.";
  const text3 = "Let's begin our journey together and discover how I can help you.";

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    const intervals: NodeJS.Timer[] = [];
    let isActive = true;

    const typeText = (text: string, setText: React.Dispatch<React.SetStateAction<string>>, delay: number = 50): Promise<void> => {
      return new Promise((resolve) => {
        let i = 0;
        setText('');
        
        const interval = setInterval(() => {
          if (!isActive) {
            clearInterval(interval);
            resolve();
            return;
          }
          
          if (i < text.length) {
            setText(prev => prev + text.charAt(i));
            i++;
          } else {
            clearInterval(interval);
            resolve();
          }
        }, delay);
        
        intervals.push(interval);
      });
    };

    const animateText = async () => {
      if (!isActive) return;

      try {
        // Reset all text states at the start
        setDisplayText1('');
        setDisplayText2('');
        setDisplayText3('');
        setIsTypingComplete(false);

        // Animate first text with faster typing
        await typeText(text1, setDisplayText1, 40);
        if (!isActive) return;

        await new Promise(resolve => {
          const timeout = setTimeout(resolve, 800);
          timeouts.push(timeout);
        });
        if (!isActive) return;

        // Animate second text
        await typeText(text2, setDisplayText2, 30);
        if (!isActive) return;

        await new Promise(resolve => {
          const timeout = setTimeout(resolve, 800);
          timeouts.push(timeout);
        });
        if (!isActive) return;

        // Animate third text
        await typeText(text3, setDisplayText3, 35);
        if (!isActive) return;

        // Small delay before showing the input
        await new Promise(resolve => {
          const timeout = setTimeout(() => {
            if (isActive) {
              setIsTypingComplete(true);
            }
            resolve();
          }, 500);
          timeouts.push(timeout);
        });
      } catch (error) {
        console.error('Error in text animation:', error);
      }
    };

    animateText();

    return () => {
      isActive = false;
      timeouts.forEach(timeout => clearTimeout(timeout));
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [text1, text2, text3]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {!isGreeted ? (
          <>
            <h1 className="text-4xl font-serif mb-6 min-h-[48px]">{displayText1}</h1>
            <p className="text-lg text-gray-700 mb-4 min-h-[56px] leading-relaxed">
              {displayText2}
            </p>
            <p className="text-lg text-gray-700 mb-8 min-h-[56px] leading-relaxed">
              {displayText3}
            </p>
            {isTypingComplete && (
              <div className="bg-white/90 rounded-xl shadow-lg p-6 mb-4 border border-white/20 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:bg-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <div className="relative mb-2">
                  <input
                    type="text"
                    className="w-full p-3 pr-24 border-none bg-white/80 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all duration-300 hover:bg-white"
                    placeholder="Nice to meet you, I'm..."
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm !rounded-button whitespace-nowrap hover:bg-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-md"
                    onClick={() => {
                      if (fullName.trim()) {
                        setIsGreeted(true);
                        setGreetingName(fullName.trim());
                      }
                    }}
                  >
                    Send <i className="fas fa-paper-plane ml-1"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-4xl font-serif mb-6">Lovely to meet you, {greetingName}.</h1>
            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
              A few things to know before we start working together:
            </p>
            <div className="space-y-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-4">
                <i className="fas fa-hand-peace text-blue-500 mt-1"></i>
                <p className="text-gray-700">
                  Hind AI's Acceptable Use Policy prohibits using Hind for harm, like producing violent, abusive, or deceptive content.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-4">
                <i className="fas fa-shield-alt text-blue-500 mt-1"></i>
                <p className="text-gray-700">
                  We regularly review conversations flagged by our automated abuse detection, and may use them to improve our safety systems.
                </p>
              </div>
            </div>
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium !rounded-button whitespace-nowrap hover:bg-blue-700 transition-all duration-300"
              onClick={() => onComplete(greetingName)}
            >
              Acknowledge & Continue
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Introduction;
