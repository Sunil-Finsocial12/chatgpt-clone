/**
 * Enhanced typing implementation based on Hugging Face Chat UI approach
 */

class StreamingTextRenderer {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      typingSpeed: options.typingSpeed || 30,
      onComplete: options.onComplete || (() => {})
    };
    this.textBuffer = '';
    this.isTyping = false;
    this.queue = [];
    this.currentTimeout = null;
  }

  // Add text to the buffer (called when receiving streaming chunks)
  appendChunk(text) {
    this.textBuffer += text;
    
    // Start typing if not already typing
    if (!this.isTyping) {
      this.startTyping();
    }
  }

  // Start or resume typing animation
  startTyping() {
    this.isTyping = true;
    this.typeNextChar();
  }

  // Type the next character from the buffer
  typeNextChar() {
    if (this.textBuffer.length > 0) {
      const char = this.textBuffer[0];
      this.textBuffer = this.textBuffer.substring(1);
      
      // Append the character to the DOM
      this.element.textContent += char;
      
      // Schedule the next character
      const delay = this.calculateDelay(char);
      this.currentTimeout = setTimeout(() => this.typeNextChar(), delay);
    } else {
      this.isTyping = false;
      if (this.queue.length > 0) {
        const nextChunk = this.queue.shift();
        this.appendChunk(nextChunk);
      } else {
        // Finished typing
        this.options.onComplete();
      }
    }
  }

  // Calculate typing delay based on character (for natural typing rhythm)
  calculateDelay(char) {
    // Punctuation gets slightly longer pauses
    if ('.!?'.includes(char)) return this.options.typingSpeed * 3;
    if (',;:'.includes(char)) return this.options.typingSpeed * 2;
    if (char === '\n') return this.options.typingSpeed * 2;
    return this.options.typingSpeed;
  }

  // Complete the typing immediately
  finishImmediately() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }
    
    this.element.textContent += this.textBuffer;
    this.textBuffer = '';
    this.isTyping = false;
    this.options.onComplete();
  }

  // Reset the typer
  reset() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }
    this.element.textContent = '';
    this.textBuffer = '';
    this.isTyping = false;
    this.queue = [];
  }
}

/**
 * Main function to stream a response into the message content area
 * @param {HTMLElement} messageElement - The message element to update
 * @param {Function} streamFunction - A function that returns an async iterable of text chunks
 */
async function streamResponse(messageElement, streamFunction) {
  // Get or create the message content element
  const contentElement = messageElement.querySelector('.message-content') || 
    (() => {
      const el = document.createElement('div');
      el.className = 'message-content';
      messageElement.appendChild(el);
      return el;
    })();
  
  // Mark the message as typing
  messageElement.classList.add('typing');
  
  // Create the renderer
  const renderer = new StreamingTextRenderer(contentElement, {
    onComplete: () => {
      // When typing completes, remove the typing class and add any necessary formatting
      messageElement.classList.remove('typing');
      applyFormattingToCompletedMessage(contentElement);
    }
  });
  
  try {
    // Stream the response
    for await (const chunk of streamFunction()) {
      // Process each chunk (e.g., strip markdown during typing)
      const processedChunk = processDuringTyping(chunk);
      renderer.appendChunk(processedChunk);
    }
  } catch (error) {
    console.error('Error streaming response:', error);
    renderer.appendChunk('\n\n[Error receiving response]');
    renderer.finishImmediately();
  }
}

/**
 * Process text during typing to prevent markdown from showing
 */
function processDuringTyping(text) {
  // This is a simple implementation - you might need more sophisticated processing
  // depending on your specific requirements
  return text;
}

/**
 * Apply proper formatting to the message once typing is complete
 */
function applyFormattingToCompletedMessage(contentElement) {
  // Here you would convert any markdown to HTML
  // For now, we just keep the plain text
  const fullText = contentElement.textContent;
  
  // In a real implementation, you would parse markdown here
  // contentElement.innerHTML = markdownToHtml(fullText);
}

// Example usage:
// const messageElement = document.querySelector('.message.assistant');
// streamResponse(messageElement, async function* () {
//   // This would normally be your API connection
//   const chunks = ["Hello, ", "how ", "are ", "you ", "today?"];
//   for (const chunk of chunks) {
//     yield chunk;
//     await new Promise(r => setTimeout(r, 100)); // Simulate network delay
//   }
// });
