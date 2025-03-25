class SpeechRecognitionHandler {
    constructor() {
      this.isListening = false;
      this.recognition = null;
      this.onResultCallback = null;
      this.onErrorCallback = null;
      this.onSubmitCallback = null;
      this.silenceTimer = null;
      this.lastSpeechTime = null;
      this.silenceThreshold = 3000; // Changed from 5000 to 3000 for 3-second silence detection
      this.currentTranscript = '';
      this.initialize();
    }
  
    initialize() {
      if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.setupRecognition();
      } else {
        console.error('Speech recognition is not supported in this browser');
      }
    }
  
    setupRecognition() {
      if (!this.recognition) return;
  
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
  
      this.recognition.onresult = (event) => {
        this.currentTranscript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
  
        // Reset silence detection on new speech
        this.lastSpeechTime = new Date().getTime();
        this.resetSilenceTimer();
  
        if (this.onResultCallback) {
          this.onResultCallback(this.currentTranscript);
        }
      };
  
      this.recognition.onerror = (event) => {
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error);
        }
        console.error('Speech recognition error:', event.error);
      };
    }
  
    resetSilenceTimer() {
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
      }
      
      if (this.isListening && this.currentTranscript.trim()) {
        this.silenceTimer = setTimeout(() => {
          const currentTime = new Date().getTime();
          const timeSinceLastSpeech = currentTime - this.lastSpeechTime;
          
          if (timeSinceLastSpeech >= this.silenceThreshold) {
            this.submitTranscript();
          }
        }, this.silenceThreshold);
      }
    }
  
    start() {
      if (!this.recognition || this.isListening) return;
  
      this.recognition.start();
      this.isListening = true;
      this.lastSpeechTime = new Date().getTime();
      this.resetSilenceTimer();
    }
  
    stop() {
      if (!this.recognition || !this.isListening) return;
  
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
  
      this.recognition.stop();
      this.isListening = false;
    }
  
    onResult(callback) {
      this.onResultCallback = callback;
    }
  
    onError(callback) {
      this.onErrorCallback = callback;
    }
  
    onSubmit(callback) {
      this.onSubmitCallback = callback;
    }

    getCurrentTranscript() {
      return this.currentTranscript;
    }

    submitTranscript() {
      console.log('Attempting to submit transcript:', this.currentTranscript);
      if (this.currentTranscript.trim() && this.onSubmitCallback) {
        console.log('Submitting final transcript:', this.currentTranscript.trim());
        const finalTranscript = this.currentTranscript.trim();
        this.onSubmitCallback(finalTranscript);
        this.currentTranscript = '';
        console.log('Transcript submitted and cleared');
        this.stop();
      } else {
        console.log('Transcript submission skipped - hasTranscript:', Boolean(this.currentTranscript.trim()), 'hasCallback:', Boolean(this.onSubmitCallback));
      }
    }
  }
  
  export { SpeechRecognitionHandler };