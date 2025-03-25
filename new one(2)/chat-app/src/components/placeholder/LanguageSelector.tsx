import React, { useState } from "react";

interface LanguageSelectorProps {
  selectedLanguage: { code: string; name: string; nativeName: string };
  onLanguageChange: (language: { code: string; name: string; nativeName: string }) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "eng_Latn", name: "English", nativeName: "English" },
    { code: "spa_Latn", name: "Spanish", nativeName: "Español" },
    { code: "fra_Latn", name: "French", nativeName: "Français" },
    { code: "deu_Latn", name: "German", nativeName: "Deutsch" },
    { code: "hin_Deva", name: "Hindi", nativeName: "हिन्दी" },
    { code: "cmn_Hans", name: "Chinese", nativeName: "中文" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-sm rounded-md px-2 py-1 hover:bg-gray-700"
      >
        {selectedLanguage?.nativeName || "English"}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 min-w-[150px] max-h-[200px] overflow-y-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
              onClick={() => {
                onLanguageChange(lang);
                setIsOpen(false);
              }}
            >
              {lang.nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
