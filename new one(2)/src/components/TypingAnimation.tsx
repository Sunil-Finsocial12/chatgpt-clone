import React, { useState, useEffect, useRef } from "react";

interface TypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  isDarkMode?: boolean;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 30, // Faster typing speed for smoother animation
  onComplete,
  className = "",
  isDarkMode = false,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);

        // Always scroll to the bottom smoothly
        if (containerRef.current) {
          const container = containerRef.current;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth"
          });
        }
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete]);

  // Reset animation when text changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`${className} overflow-y-auto max-h-60 smooth-scroll`} // Added smooth-scroll class
    >
      <span className="whitespace-pre-wrap break-words">
        {displayedText}
        {currentIndex < text.length && (
          <span className={`animate-pulse ml-0.5 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
            ▋
          </span>
        )}
      </span>
    </div>
  );
};

export default TypingAnimation;
