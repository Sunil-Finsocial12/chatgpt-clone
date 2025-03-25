export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
  status?: "sending" | "sent" | "error";
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  isStarred?: boolean;
  isEditing?: boolean;
  projectId?: string;
  lastModified?: Date;
}

export interface Project {
  id: string;
  name: string;
  chats: Chat[];
  isEditing?: boolean;
}

export interface FilePreview {
  name: string;
  type: string;
  size: number;
  content?: string;
}

export interface CodeBlock {
  content: string;
  language: string;
}
