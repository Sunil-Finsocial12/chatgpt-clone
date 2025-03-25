"use client"

import type React from "react"
import { useState } from "react"
import { GlobeIcon } from "lucide-react"
import { LanguageSelector } from "../LanguageSelector"
import ModelSelector from "../ModelSelector"
import FileUploadModal from "../FileUploadModal"

interface ChatInputProps {
  inputText: string
  setInputText: (text: string) => void
  handleTextAreaResize: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSendMessage: (message: string) => void
  isDarkMode: boolean
  isSearchEnabled: boolean
  handleSearchToggle: () => void
  activeFilePreview: any | null // Replace with proper FilePreview type
  setActiveFilePreview: (preview: any | null) => void
  selectedLanguage: { code: string; name: string; nativeName: string }
  handleLanguageChange: (language: { code: string; name: string; nativeName: string }) => void
  setIsMicActive: (isActive: boolean) => void
  isMicActive: boolean
  models: any[] // Replace with proper model type
  selectedModel: string
  setSelectedModel: (model: string) => void
  isAuthenticated: boolean
  setIsLoginModalOpen: (isOpen: boolean) => void
  setIsLoginAnimated: (isAnimated: boolean) => void
  handleFiles: (files: File[]) => Promise<void> // Change this from handleFileUpload to handleFiles
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputText,
  setInputText,
  handleTextAreaResize,
  handleSendMessage,
  isDarkMode,
  isSearchEnabled,
  handleSearchToggle,
  activeFilePreview,
  setActiveFilePreview,
  selectedLanguage,
  handleLanguageChange,
  models,
  selectedModel,
  setSelectedModel,
  isAuthenticated,
  setIsLoginModalOpen,
  setIsLoginAnimated,
  handleFiles, // Renamed from handleFileUpload
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleFileUploadComplete = async (files: File[]) => {
    try {
      await handleFiles(files) // Use the renamed prop
      setIsUploadModalOpen(false)
    } catch (error) {
      console.error("Error handling file:", error)
    }
  }

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName)
  }

  const handleSubmit = () => {
    if (!isAuthenticated) {
      setIsLoginAnimated(true)
      setIsLoginModalOpen(true)
      return
    }

    handleSendMessage(inputText)
    setActiveFilePreview(null) // Clear the file preview after sending
  }

  return (
    <>
      <div
        className={`relative rounded-[20px] shadow-lg chat-glow transition-colors ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {activeFilePreview && (
          <div className={`w-full px-4 py-3 ${isDarkMode ? "bg-gray-700/30" : "bg-gray-50/50"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <i
                  className={`fas ${
                    activeFilePreview.type.startsWith("image/")
                      ? "fa-image text-green-400"
                      : activeFilePreview.type === "application/pdf"
                        ? "fa-file-pdf text-red-400"
                        : "fa-file text-blue-400"
                  } text-lg`}
                >
                  {" "}
                </i>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-medium truncate max-w-[120px] sm:max-w-[200px]">
                    {activeFilePreview.name}
                  </span>
                  <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Ready to send</span>
                </div>
              </div>
              <button
                onClick={() => setActiveFilePreview(null)}
                className={`p-1.5 rounded-full transition-colors ${
                  isDarkMode ? "hover:bg-gray-600 text-gray-400" : "hover:bg-white/50 text-gray-500"
                }`}
              >
                <i className="fas fa-times"> </i>
              </button>
            </div>
          </div>
        )}

<div className={`relative flex flex-col ${isDarkMode ? "moving-border" : ""}`}>
  <div className="min-h-[56px] max-h-[200px] overflow-hidden w-full">
  <textarea
  className={`w-full max-w-[90%] sm:max-w-[600px] rounded-[20px] outline-none p-3 sm:p-4 h-auto min-h-[56px] max-h-[200px] text-sm sm:text-base transition-all resize-none overflow-hidden ${
    isDarkMode
      ? "bg-gray-800 text-gray-200 placeholder-gray-400"
      : "bg-white text-gray-800 placeholder-gray-500"
  }`}
  value={inputText}
  onChange={(e) => {
    const textarea = e.target;
    textarea.style.height = "56px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    setInputText(e.target.value);
  }}
  placeholder="Type here.."
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) {
        handleSubmit();
      }
    }
  }}
/>

  </div>

  {/* Bottom bar */}
  <div
    className={`flex flex-wrap md:flex-nowrap items-center justify-between p-2 sm:p-4 rounded-b-[20px] w-full ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    {/* Left Section - Model, Language, Search */}
    <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
      <ModelSelector
        isDarkMode={isDarkMode}
        onModelChange={handleModelSelect}
        models={models}
        currentModel={selectedModel}
      />

      <div className="relative inline-block">
        <LanguageSelector
          isDarkMode={isDarkMode}
          onLanguageChange={handleLanguageChange}
          selectedLanguage={selectedLanguage}
          className="z-[9999]"
          dropdownPosition="absolute"
        />
      </div>

      {/*<button
        className={`flex items-center space-x-1 sm:space-x-2 ${
          isSearchEnabled ? "text-blue-500" : "hover:text-gray-700"
        }`}
        title="Search the web"
        onClick={handleSearchToggle}
      >
        <GlobeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">{isSearchEnabled ? "Search" : "Search"}</span>
      </button>*/}
    </div>

    {/* Right Section - Upload, Send */}
    <div className="flex items-center space-x-1 sm:space-x-2 ml-auto mt-2 sm:mt-0">
      <button
        className={`p-1.5 sm:p-2 rounded-full transition-colors ${
          isDarkMode ? "text-gray-400 hover:text-blue-400" : "text-gray-400 hover:text-indigo-600"
        }`}
        onClick={() => setIsUploadModalOpen(true)}
      >
        <i className="fas fa-paperclip text-sm sm:text-base"></i>
      </button>

      <button
        className={`rounded-full p-2 sm:p-2.5 transition-colors ${
          isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-indigo-600 hover:bg-indigo-700"
        } text-white`}
        onClick={handleSubmit}
      >
        <i className="fas fa-paper-plane w-4 sm:w-5"></i>
      </button>
    </div>
  </div>
</div>

      </div>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileUpload={handleFileUploadComplete}
        isDarkMode={isDarkMode}
      />
    </>
  )
}

export default ChatInput

