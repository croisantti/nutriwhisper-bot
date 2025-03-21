
import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "@/lib/types";

interface ChatHistoryProps {
  messages: Message[];
  isLoading: boolean;
  onSpeakingChange: (speaking: boolean) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ 
  messages, 
  isLoading,
  onSpeakingChange 
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto pb-4 pt-4">
      <div className="mx-auto max-w-3xl space-y-4 px-4">
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

        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};

export default ChatHistory;
