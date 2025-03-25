import { uploadFileToDropbox } from './dropboxService';

export const processFileUpload = async (file: File): Promise<{ url: string; name: string; type: string }> => {
  try {
    const publicUrl = await uploadFileToDropbox(file);
    
    // Ensure we're returning the URL
    return {
      url: publicUrl, // This was missing or empty before
      name: file.name,
      type: file.type
    };
  } catch (error) {
    console.error('Error processing file upload:', error);
    throw new Error('Failed to process file upload');
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
