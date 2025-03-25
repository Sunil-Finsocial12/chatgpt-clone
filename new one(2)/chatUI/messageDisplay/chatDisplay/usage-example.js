/**
 * Example usage showing how to integrate with your API
 */

document.addEventListener('DOMContentLoaded', () => {
  // Get the chat container
  const chatContainer = document.getElementById('chat-container');
  
  // Example function to handle a new user message
  async function handleUserMessage(userText) {
    // Create and render user message
    const userMessage = new ChatMessage({
      container: chatContainer,
      type: 'user',
      content: userText
    }).render();
    
    // Create assistant message with typing indicator
    const assistantMessage = new ChatMessage({
      container: chatContainer,
      type: 'assistant'
    }).render().showTypingIndicator();
    
    // Call your API and stream the response
    try {
      // Replace this with your actual API call
      const stream = await fetchStreamingResponse(userText);
      
      // Remove typing indicator and start streaming
      assistantMessage.removeTypingIndicator();
      
      // Stream the response
      await assistantMessage.streamContent(async function* () {
        for await (const chunk of stream) {
          yield chunk;
        }
      });
    } catch (error) {
      console.error('Error fetching response:', error);
      assistantMessage.removeTypingIndicator();
      assistantMessage.contentElement.textContent = 'Sorry, there was an error processing your request.';
    }
  }
  
  // Example API function that returns a stream
  async function* fetchStreamingResponse(userInput) {
    // This would be your actual API connection
    // Here we're just simulating a response
    
    const responses = [
      "Thank you for your message! ",
      "I'm processing your request. ",
      "This is an example of streaming text, ",
      "similar to how Hugging Face Chat UI works. ",
      "The text appears character by character, ",
      "creating a natural typing effect. ",
      "\n\n",
      "This approach makes the AI response feel more dynamic and engaging."
    ];
    
    for (const chunk of responses) {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 300));
      yield chunk;
    }
  }
  
  // Add event listener to message input form
  const messageForm = document.getElementById('message-form');
  if (messageForm) {
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = messageForm.querySelector('input[type="text"]');
      const userText = input.value.trim();
      
      if (userText) {
        handleUserMessage(userText);
        input.value = '';
      }
    });
  }
});
