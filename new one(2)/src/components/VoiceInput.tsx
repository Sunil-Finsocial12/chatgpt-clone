import React, { useEffect, useState } from 'react';
import { SpeechRecognitionHandler } from '../services/speechRecognitionHandler';

interface VoiceInputProps {
  isActive: boolean;
  onTranscript: (text: string) => void;
  onStateChange: (isListening: boolean) => void;
  isDarkMode: boolean;
  onSubmit: () => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
  isActive,
  onTranscript,
  onStateChange,
  isDarkMode,
  onSubmit,
}) => {
  const [error, setError] = useState<string>('');
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [speechHandler, setSpeechHandler] = useState<SpeechRecognitionHandler | null>(null);
  useEffect(() => {
    if (speechHandler) {
      speechHandler.onSubmit((transcript) => {
        if (transcript.trim()) {
          onTranscript(transcript);
          onStateChange(false);
          setIsMicActive(false);
          setTimeout(() => onSubmit(), 500); // Ensure submission after slight delay
        }
      });
    }
  }, [speechHandler, onTranscript, onStateChange, onSubmit]);
  
  useEffect(() => {
    const handler = new SpeechRecognitionHandler();

    handler.onResult((transcript) => {
      onTranscript(transcript);
    });

    handler.onError((error) => {
      setError('Error occurred in recognition: ' + error);
      onStateChange(false);
      setIsMicActive(false);
    });

    handler.onSubmit((transcript) => {
      if (transcript.trim()) {
        onTranscript(transcript);
        onStateChange(false);
        setIsMicActive(false);
        onSubmit();
      }
    });

    setSpeechHandler(handler);

    return () => {
      if (handler) {
        handler.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && !isMicActive && speechHandler) {
      try {
        speechHandler.start();
        setError('');
      } catch (err) {
        console.error('Error starting recognition:', err);
        setError('Failed to start speech recognition');
        setIsMicActive(false);
        onStateChange(false);
      }
    }
  }, [isActive, isMicActive, speechHandler, onStateChange]);
  

  return (
    <div className="relative">
      {error && (
        <div className={`absolute bottom-full mb-2 left-0 p-2 rounded-lg text-sm ${
          isDarkMode 
            ? 'bg-red-900/80 text-red-200' 
            : 'bg-red-100 text-red-600'
        }`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
