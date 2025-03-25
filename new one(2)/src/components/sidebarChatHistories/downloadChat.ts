export const downloadChat = async (chat: any, username: string | null) => {
  try {
    const user = username || localStorage.getItem('userName');
    if (!user) return;
    const response = await fetch('http://saveai.tech/chat/detailed-history', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: user, chat_id: chat.id })
    });
    const data = await response.json();
    const fileData = JSON.stringify(data, null, 2);
    const blob = new Blob([fileData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chat.title || 'chat'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading chat details:", error);
  }
};
