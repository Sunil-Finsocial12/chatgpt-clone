import React, { useState } from 'react';

interface ImagePreviewProps {
  imageUrl: string;
  isDarkMode: boolean;
  fileName?: string;
  isGenerated?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  imageUrl, 
  isDarkMode, 
  fileName = 'image',
  isGenerated = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <>
      <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg relative group cursor-zoom-in`}>
        <img 
          src={imageUrl} 
          alt={isGenerated ? "AI Generated" : "Attached"}
          className="w-full h-auto object-cover transition-transform duration-200"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onClick={toggleZoom}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
          </div>
        )}
        <button
          onClick={handleDownload}
          className={`absolute top-2 right-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
            isDarkMode 
              ? 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-200' 
              : 'bg-white/80 hover:bg-gray-100/80 text-gray-700'
          } backdrop-blur-sm`}
        >
          <i className="fas fa-download"></i>
        </button>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out"
          onClick={toggleZoom}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img 
              src={imageUrl}
              alt="Zoomed view"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className={`absolute top-4 right-4 p-3 rounded-full ${
                isDarkMode 
                  ? 'bg-gray-800/80 hover:bg-gray-700 text-gray-200' 
                  : 'bg-white/80 hover:bg-gray-100 text-gray-700'
              } backdrop-blur-sm transition-colors`}
            >
              <i className="fas fa-download"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview;
