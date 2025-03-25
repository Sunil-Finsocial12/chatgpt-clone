export interface Message {
  id: string;
  content: string;
  type: "user" | "assistant";
  timestamp: Date;
  status: "sending" | "sent" | "error";
  file?: FilePreview;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
  isStarred?: boolean;
  isEditing?: boolean;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  chats: Chat[];
  isEditing?: boolean;
}

export interface FilePreview {
  name: string;
  type: string;
  url: string;
}

export interface CodeBlock {
  content: string;
  language: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  avatar?: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}
