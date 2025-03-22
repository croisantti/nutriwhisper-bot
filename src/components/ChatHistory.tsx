
import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial scroll setup when component mounts
  useEffect(() => {
    // Short delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-280px)] w-full" ref={scrollAreaRef}>
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
        <div className="pt-16 pb-4">
          {/* Significantly increased top padding to ensure first message is fully visible */}
        </div>
        
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            onSpeakingChange={onSpeakingChange}
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
        <div ref={messagesEndRef} />
        
        {/* Add bottom padding for better spacing */}
        <div className="pb-4"></div>
      </div>
    </ScrollArea>
  );
};

export default ChatHistory;
