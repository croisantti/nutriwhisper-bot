
export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  messages: Message[];
  isLoading: boolean;
}

// Helper function to convert between Supabase JSON format and our Message type
export const serializeMessage = (message: Message): Record<string, any> => ({
  id: message.id,
  role: message.role,
  content: message.content,
  timestamp: message.timestamp.toISOString()
});

export const deserializeMessage = (data: any): Message => ({
  id: data.id,
  role: data.role,
  content: data.content,
  timestamp: new Date(data.timestamp)
});

export const serializeMessages = (messages: Message[]): Record<string, any>[] => 
  messages.map(serializeMessage);

export const deserializeMessages = (data: any[]): Message[] => 
  data.map(deserializeMessage);
