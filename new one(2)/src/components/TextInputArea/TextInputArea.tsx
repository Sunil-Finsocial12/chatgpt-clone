"use client"

import React, { useRef, useEffect } from "react";
import { handleTextAreaResize } from "./TextInputUtils";
import { GlobeIcon } from "lucide-react";
import { LanguageSelector } from "../LanguageSelector";
import ModelSelector from "../ModelSelector";
import FileUploadModal from "../FileUploadModal";
import "./TextInputArea.css";

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

const TextInputArea: React.FC<TextInputAreaProps> = ({
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
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
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
    </div>
  );
};

export default TextInputArea;
