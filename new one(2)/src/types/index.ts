export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  status: 'sending' | 'sent' | 'error';
  file?: {
    name: string;
    type: string;
    url: string;
  };
}

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
  isStarred?: boolean;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  chats: Chat[];
}
