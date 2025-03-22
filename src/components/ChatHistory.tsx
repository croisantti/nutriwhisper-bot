
import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "@/lib/types";
import VoiceInterface from "./VoiceInterface";

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
  onSpeakingChange: (speaking: boolean) => void;
  systemPrompt?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  messages, 
  isLoading,
  onSpeakingChange,
  systemPrompt 
}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial scroll to bottom when component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto pb-4 pt-4 h-[calc(100vh-220px)]"
    >
      <div className="mx-auto max-w-3xl space-y-4 px-4">
        <div className="flex justify-center mb-4">
          <VoiceInterface 
            onSpeakingChange={onSpeakingChange} 
            systemPrompt={systemPrompt}
          />
        </div>
        
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
          />
        ))}

        {isLoading && (
          <div className="flex animate-pulse items-start gap-4 p-4">
            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="animate-pulse">●</span>
            </div>
            <div className="glass-effect rounded-2xl px-4 py-3">
              <p className="loading-dots">Thinking</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
