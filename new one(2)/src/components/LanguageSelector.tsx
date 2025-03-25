import type React from "react"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Languages, ChevronDown } from "lucide-react"

const API_URL = "http://saveai.tech/chat/initiate"

interface Language {
  code: string
  name: string
  nativeName: string | null
}

// ** Dictionary for Native Language Names **
const languageMap: Record<string, string> = {
  eng_Latn: "English",
  hin_Deva: "Hindi",
  ben_Beng: "Bengali",
  guj_Gujr: "Gujrati",
  kan_Knda: "Kannada",
  mal_Mlym: "Malyalam",
  mar_Deva: "Marathi",
  npi_Deva: "Nepali",
  ory_Orya: "Oriya",
  pan_Guru: "Punjabi",
  san_Deva: "Sanskrit",
  tam_Taml: "Tamil",
  tel_Telu: "Telugu",
  urd_Arab: "Urdu",
  asm_Beng: "Assamese",
  kas_Arab: "Kashmiri",
  mni_Mtei: "Manipuri",
  snd_Arab: "Sindhi",
}

interface LanguageSelectorProps {
  isDarkMode: boolean
  onLanguageChange: (language: Language) => void
  selectedLanguage: Language
  className?: string
  dropdownPosition?: string
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  isDarkMode,
  onLanguageChange,
  selectedLanguage,
  className = "",
  dropdownPosition = "absolute",
}) => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Create default languages from the languageMap
  useEffect(() => {
    const defaultLanguages = Object.entries(languageMap).map(([code, name]) => ({
      code,
      name,
      nativeName: name as string | null,
    }))
    setLanguages(defaultLanguages)
  }, []) // Remove selectedLanguage dependency

  // Position dropdown correctly - now ABOVE the button
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 300; // Maximum height of dropdown
      setPosition({
        top: rect.top + window.scrollY - dropdownHeight - 5, // Position above the button
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  // Handle language selection
  const handleLanguageSelect = (language: Language) => {
    console.log("Language selected:", language);

    // Make sure we're passing a properly formatted language object
    const selectedLang = {
      code: language.code,
      name: languageMap[language.code] || language.name,
      nativeName: language.nativeName || languageMap[language.code] || language.name,
     };

    // Call the parent component's handler
     onLanguageChange(selectedLang);
     setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Current selected language:", selectedLanguage);
          setIsOpen((prev) => !prev);
        }}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all ${
          isDarkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-100 text-gray-600"
        } ${className}`}
      >
        <Languages size={18} />
        <span className="hidden sm:inline">
          {selectedLanguage?.code ? languageMap[selectedLanguage.code] || selectedLanguage.name : "Select"}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`fixed w-40 border rounded-lg shadow-lg overflow-hidden z-[9999] ${
              isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-black"
            }`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              maxHeight: "300px",
              overflowY: "auto",
              zIndex: 9999
            }}
          >
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLanguageSelect(language);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedLanguage?.code === language.code
                      ? isDarkMode
                        ? "bg-gray-700"
                        : "bg-gray-100"
                      : ""
                  }`}
                >
                  {languageMap[language.code] || language.name}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}