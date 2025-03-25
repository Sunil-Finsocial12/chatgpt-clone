import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

interface Model {
  id: string;
  name: string;
  icon: JSX.Element;
}

const ModelSelector = ({
  isDarkMode,
  onModelChange,
  models,
  currentModel
}: {
  isDarkMode: boolean;
  onModelChange: (model: Model) => void;
  models: Model[];
  currentModel: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModel = models.find(model => model.name === currentModel) || models[0];
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownHeight, setDropdownHeight] = useState(0);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.offsetHeight);
    }
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
          isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        {selectedModel.icon}
        <span>{selectedModel.name}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`absolute min-w-[180px] p-2 rounded-lg shadow-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-700"
            }`}
            style={{
              top: (buttonRef.current?.getBoundingClientRect().top ?? 0) - dropdownHeight - 8,
              left: buttonRef.current?.getBoundingClientRect().left ?? 0,
            }}
          >
            <div className="max-h-[140px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-4 py-3 text-left ${
                    selectedModel.id === model.id ? (isDarkMode ? "bg-gray-700" : "bg-gray-100") : ""
                  }`}
                >
                  {model.icon}
                  <span>{model.name}</span>
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default ModelSelector;