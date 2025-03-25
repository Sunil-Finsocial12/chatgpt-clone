import React from "react";

interface LoadingDotsProps {
  isDarkMode: boolean;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ isDarkMode }) => {
  return (
    <div className="flex items-center justify-center space-x-1">
      <style>
        {`
          @keyframes dotFade {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
          }
        `}
      </style>

      <span
        className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-white" : "bg-gray-800"}`}
        style={{ animation: "dotFade 1.5s infinite", animationDelay: "0s" }}
      ></span>

      <span
        className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-white" : "bg-gray-800"}`}
        style={{ animation: "dotFade 1.5s infinite", animationDelay: "0.2s" }}
      ></span>

      <span
        className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-white" : "bg-gray-800"}`}
        style={{ animation: "dotFade 1.5s infinite", animationDelay: "0.4s" }}
      ></span>
    </div>
  );
};

export default LoadingDots;
