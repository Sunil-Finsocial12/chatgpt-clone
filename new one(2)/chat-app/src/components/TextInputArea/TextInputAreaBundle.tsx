"use client"

import React, { useRef, useEffect, useState } from "react";
import { GlobeIcon } from "lucide-react";
// Import these components or create stub versions
import { LanguageSelector } from "../placeholder/LanguageSelector";
import ModelSelector from "../placeholder/ModelSelector";
import FileUploadModal from "../placeholder/FileUploadModal";

/**
 * Text input area utilities
 */
export const resetTextAreaHeight = () => {
  const textarea = document.querySelector("textarea");
  if (textarea) {
    textarea.style.height = "56px";
  }
};

export const handleTextAreaResize = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
  setInputText: (text: string) => void
) => {
  const textarea = e.target;
  const value = textarea.value;

  if (!value.trim()) {
    textarea.style.height = "56px";
  } else {
    textarea.style.height = "inherit";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  setInputText(value);
};

/**
 * TextInputArea Component Props
 */
export interface TextInputAreaProps {
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  isDarkMode?: boolean;
  isSearchEnabled?: boolean;
  handleSearchToggle?: () => void;
  activeFilePreview?: any | null;
  setActiveFilePreview?: (preview: any | null) => void;
  selectedLanguage?: { code: string; name: string; nativeName: string };
  handleLanguageChange?: (language: { code: string; name: string; nativeName: string }) => void;
  setIsMicActive?: (isActive: boolean) => void;
  isMicActive?: boolean;
  models?: any[];
  selectedModel?: string;
  setSelectedModel?: (model: string) => void;
  isAuthenticated?: boolean;
  setIsLoginModalOpen?: (isOpen: boolean) => void;
  setIsLoginAnimated?: (isAnimated: boolean) => void;
  handleFiles?: (files: File[]) => Promise<void>;
  isGenerating?: boolean;
}

/**
 * TextInputArea Component
 */
export const TextInputArea: React.FC<TextInputAreaProps> = ({
  inputText,
  setInputText,
  handleSendMessage,
  isDarkMode = false,
  isSearchEnabled = false,
  handleSearchToggle,
  activeFilePreview = null,
  setActiveFilePreview,
  selectedLanguage = { code: "en", name: "English", nativeName: "English" },
  handleLanguageChange,
  setIsMicActive,
  isMicActive = false,
  models = [],
  selectedModel = "",
  setSelectedModel,
  isAuthenticated = false,
  setIsLoginModalOpen,
  setIsLoginAnimated,
  handleFiles,
  isGenerating = false,
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleTextAreaResizeInternal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleTextAreaResize(e, setInputText);
  };

  const handleFileUploadComplete = async (files: File[]) => {
    if (handleFiles) {
      try {
        await handleFiles(files);
        setIsUploadModalOpen(false);
      } catch (error) {
        console.error("Error uploading files:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isGenerating) {
        handleSendMessage();
      }
    }
  };

  return (
    <div className="text-input-container">
      <div className="input-options">
        {handleSearchToggle && (
          <button 
            onClick={handleSearchToggle}
            className={`search-toggle ${isSearchEnabled ? "active" : ""}`}
            aria-label={isSearchEnabled ? "Disable search" : "Enable search"}
          >
            {isSearchEnabled ? "Search Enabled" : "Search Disabled"}
          </button>
        )}
        
        {handleLanguageChange && (
          <div className="language-selector-wrapper">
            <GlobeIcon size={16} />
            <LanguageSelector 
              selectedLanguage={selectedLanguage} 
              onLanguageChange={handleLanguageChange}
            />
          </div>
        )}
        
        {models.length > 0 && setSelectedModel && (
          <ModelSelector 
            models={models} 
            selectedModel={selectedModel} 
            setSelectedModel={setSelectedModel}
          />
        )}
      </div>
      
      <div className="textarea-container">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={handleTextAreaResizeInternal}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          disabled={isGenerating}
          className={`text-input-area ${isDarkMode ? "dark" : "light"}`}
          rows={1}
        />
        
        {activeFilePreview && (
          <div className="file-preview">
            <span>{activeFilePreview.name}</span>
            <button 
              onClick={() => setActiveFilePreview && setActiveFilePreview(null)}
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      
      <div className="input-actions">
        {handleFiles && (
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="upload-button"
            aria-label="Upload files"
          >
            📎
          </button>
        )}
        
        {setIsMicActive && (
          <button 
            onClick={() => setIsMicActive(!isMicActive)}
            className={`mic-button ${isMicActive ? "active" : ""}`}
            aria-label={isMicActive ? "Stop recording" : "Start recording"}
          >
            🎤
          </button>
        )}
        
        <button 
          onClick={() => {
            if (!isAuthenticated && setIsLoginModalOpen && setIsLoginAnimated) {
              setIsLoginModalOpen(true);
              setIsLoginAnimated(true);
              return;
            }
            
            if (inputText.trim() && !isGenerating) {
              handleSendMessage();
            }
          }}
          disabled={!inputText.trim() || isGenerating}
          className="send-button"
          aria-label="Send message"
        >
          📤
        </button>
      </div>
      
      {handleFiles && isUploadModalOpen && (
        <FileUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleFileUploadComplete}
        />
      )}

      <style>{`
        .text-input-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 12px;
          background-color: var(--input-bg-color, #40414f);
          border-radius: 8px;
          border: 1px solid var(--input-border-color, #565869);
        }

        .input-options {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          gap: 12px;
        }

        .textarea-container {
          position: relative;
          width: 100%;
        }

        .text-input-area {
          width: 100%;
          min-height: 56px;
          max-height: 200px;
          padding: 12px;
          border-radius: 8px;
          border: none;
          outline: 1px solid var(--input-border-color, #565869);
          background-color: var(--input-bg-color, #40414f);
          color: var(--text-color, white);
          font-size: 16px;
          resize: none;
          overflow-y: auto;
          transition: height 0.2s ease;
        }

        .text-input-area:focus {
          outline: 2px solid var(--focus-color, #8e8ea0);
        }

        .text-input-area::placeholder {
          color: var(--placeholder-color, #8e8ea0);
        }

        .text-input-area.dark {
          --input-bg-color: #40414f;
          --input-border-color: #565869;
          --text-color: white;
          --placeholder-color: #8e8ea0;
          --focus-color: #8e8ea0;
        }

        .text-input-area.light {
          --input-bg-color: #f7f7f8;
          --input-border-color: #d9d9e3;
          --text-color: #343541;
          --placeholder-color: #8e8ea0;
          --focus-color: #5436da;
        }

        .input-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 8px;
          gap: 8px;
        }

        .send-button,
        .mic-button,
        .upload-button,
        .search-toggle {
          width: 36px;
          height: 36px;
          border-radius: 4px;
          border: none;
          background-color: transparent;
          color: var(--button-color, #8e8ea0);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s;
        }

        .send-button:hover,
        .mic-button:hover,
        .upload-button:hover,
        .search-toggle:hover {
          background-color: rgba(142, 142, 160, 0.1);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mic-button.active {
          color: #ff4a4a;
          background-color: rgba(255, 74, 74, 0.1);
        }

        .search-toggle.active {
          color: #10a37f;
          background-color: rgba(16, 163, 127, 0.1);
        }

        .file-preview {
          margin-top: 8px;
          padding: 6px 10px;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
        }

        .file-preview button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-color, white);
          margin-left: 8px;
        }

        .language-selector-wrapper {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      `}</style>
    </div>
  );
};

export default TextInputArea;
