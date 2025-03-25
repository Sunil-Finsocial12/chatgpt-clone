import React, { useState } from 'react';

interface ModelSelectorProps {
  models: Array<{
    id: string;
    name: string;
    icon: React.ReactNode;
    isDisabled?: boolean;
  }>;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModel, setSelectedModel }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedModelObj = models.find(model => model.id === selectedModel) || models[0];
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800 text-gray-200"
      >
        {selectedModelObj?.icon}
        <span>{selectedModelObj?.name}</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 z-10 min-w-[180px]">
          {models.map(model => (
            <button
              key={model.id}
              disabled={model.isDisabled}
              className={`flex items-center w-full text-left px-3 py-2 gap-2 ${
                model.isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => {
                if (!model.isDisabled) {
                  setSelectedModel(model.id);
                  setIsOpen(false);
                }
              }}
            >
              {model.icon}
              <span>{model.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
