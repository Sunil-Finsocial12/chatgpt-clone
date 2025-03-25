export const fetchChatHistory = async (username: string): Promise<any[]> => {
  try {
    const response = await fetch('http://saveai.tech/chat/all', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });
    const data = await response.json();
    if (data.chats) {
      return data.chats.map((chat: any) => ({
        id: chat.chat_id,
        title: chat.first_message || `Chat ${chat.chat_id}`,
        timestamp: new Date(chat.timestamp).toLocaleString(),
        isStarred: false,
        category: ""
      }));
    }
  } catch (error) {
    console.error("Error fetching chat history:", error);
  }
  return [];
};
