/**
 * Message component for handling streaming responses similar to Hugging Face Chat UI
 */

class ChatMessage {
  constructor(options = {}) {
    this.container = options.container || document.body;
    this.messageType = options.type || 'assistant'; // 'user' or 'assistant'
    this.content = options.content || '';
    this.avatar = options.avatar || '';
    this.messageElement = null;
    this.contentElement = null;
    this.streamRenderer = null;
  }

  /**
   * Create and render the message in the UI
   */
  render() {
    // Create message element
    this.messageElement = document.createElement('div');
    this.messageElement.className = `message ${this.messageType}`;
    
    // Create message inner container
    const messageInner = document.createElement('div');
    messageInner.className = 'message-inner';
    
    // Create avatar
    const avatarElement = document.createElement('div');
    avatarElement.className = 'message-avatar';
    if (this.messageType === 'user') {
      avatarElement.innerHTML = 'U';
    } else {
      avatarElement.innerHTML = 'A';
    }
    
    // Create content area
    this.contentElement = document.createElement('div');
    this.contentElement.className = 'message-content';
    
    // Assemble message
    messageInner.appendChild(avatarElement);
    messageInner.appendChild(this.contentElement);
    this.messageElement.appendChild(messageInner);
    
    // Add to container
    this.container.appendChild(this.messageElement);
    
    // If it's a regular message (not streaming), display content immediately
    if (this.content && !this.streaming) {
      this.contentElement.textContent = this.content;
    }
    
    return this;
  }

  /**
   * Stream content into the message
   * @param {Function} streamFunction - Async generator that yields text chunks
   */
  async streamContent(streamFunction) {
    if (!this.messageElement) {
      this.render();
    }
    
    this.messageElement.classList.add('typing');
    
    // Create a new renderer
    this.streamRenderer = new StreamingTextRenderer(this.contentElement, {
      onComplete: () => {
        this.messageElement.classList.remove('typing');
        this.formatCompletedMessage();
      }
    });
    
    try {
      // Process the stream
      for await (const chunk of streamFunction()) {
        this.streamRenderer.appendChunk(chunk);
      }
    } catch (error) {
      console.error('Error streaming content:', error);
      this.streamRenderer.appendChunk('\n\n[Error streaming content]');
      this.streamRenderer.finishImmediately();
    }
  }
  
  /**
   * Format the message after streaming is complete
   */
  formatCompletedMessage() {
    // In the real implementation, you'd convert from markdown to formatted HTML here
    // For now, we'll just keep the plain text
  }
  
  /**
   * Add a typing indicator to the message
   */
  showTypingIndicator() {
    if (!this.messageElement) {
      this.render();
    }
    
    this.messageElement.classList.add('typing');
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      indicator.appendChild(dot);
    }
    
    this.contentElement.appendChild(indicator);
    return this;
  }
  
  /**
   * Remove the typing indicator
   */
  removeTypingIndicator() {
    if (this.messageElement) {
      this.messageElement.classList.remove('typing');
      const indicator = this.contentElement.querySelector('.typing-indicator');
      if (indicator) {
        indicator.remove();
      }
    }
    return this;
  }
}

// Example usage:
// const chatContainer = document.getElementById('chat-container');
// 
// // Create a user message
// const userMessage = new ChatMessage({
//   container: chatContainer,
//   type: 'user',
//   content: 'Hello, how are you?'
// }).render();
// 
// // Create an assistant message that streams its response
// const assistantMessage = new ChatMessage({
//   container: chatContainer,
//   type: 'assistant'
// }).render();
// 
// // Stream content into the assistant message
// assistantMessage.streamContent(async function* () {
//   const response = "I'm doing well, thank you for asking! How can I help you today?";
//   const chunks = response.split(' ');
//   
//   for (const word of chunks) {
//     yield word + ' ';
//     await new Promise(r => setTimeout(r, 100));
//   }
// });
