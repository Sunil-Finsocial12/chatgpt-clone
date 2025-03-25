"use client";

import React, { useState, useRef } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import TypingAnimation from "./TypingAnimation";
import { parseMessageContent } from "./MessageFormatter";

interface AIReasoningDisplayProps {
  reasoning: string;
  isDarkMode: boolean;
}

const AIReasoningDisplay: React.FC<AIReasoningDisplayProps> = ({
  reasoning,
  isDarkMode,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const reasoningRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Format reasoning before rendering
  const formattedReasoning = parseMessageContent(reasoning)
    .map((part) => (part.isHtml ? part.content : part.content))
    .join("");

  return (
    <div
      className={`relative max-w-[100%] rounded-[20px] transition-all duration-300 ${
        isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
      }`}
      style={{
        borderLeft: isDarkMode ? "4px solid #1e40af" : "4px solid #93c5fd",
        height: isExpanded ? "auto" : "50px",
        overflow: "hidden",
      }}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Sparkles className="text-blue-500 mr-2" size={18} />
          <span className="text-sm font-semibold">AI Reasoning</span>
        </div>

        <button onClick={toggleExpand} className="focus:outline-none">
          <ChevronDown
            size={18}
            className={`transition-transform ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {/* Content - Only visible when expanded */}
      <div className={`transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 h-0"}`}>
        {/* Reasoning Text with Auto-Scroll */}
        <div
          ref={reasoningRef}
          className="text-sm whitespace-pre-wrap overflow-y-auto px-4 pb-4 max-h-[150px] smooth-scroll"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            overflowX: "hidden",
            wordBreak: "break-word",
            scrollBehavior: "smooth"
          }}
        >
          <style>{`
            .smooth-scroll {
              scroll-behavior: smooth;
            }
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <TypingAnimation
            text={formattedReasoning}
            speed={3}
            isDarkMode={isDarkMode}
            className="text-base leading-relaxed whitespace-pre-wrap"
            onComplete={() => {
              if (reasoningRef.current) {
                reasoningRef.current.scrollTo({
                  top: reasoningRef.current.scrollHeight,
                  behavior: "smooth"
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AIReasoningDisplay;
