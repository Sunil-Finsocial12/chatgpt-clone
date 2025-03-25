import React, { useState, useRef } from 'react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const handleUpload = () => {
    if (files.length > 0) {
      onUpload(files);
      setFiles([]);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload Files</h2>
        
        <div 
          className={`border-2 border-dashed ${dragActive ? 'border-blue-500' : 'border-gray-600'} 
            rounded-lg p-6 text-center mb-4 cursor-pointer`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <p>Drag & drop files here or click to select files</p>
          <input 
            type="file" 
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        {files.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-2">Selected Files:</p>
            <ul className="max-h-32 overflow-y-auto">
              {files.map((file, index) => (
                <li key={index} className="text-sm py-1">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            className={`px-4 py-2 rounded ${files.length > 0 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-400 cursor-not-allowed'}`}
            disabled={files.length === 0}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
