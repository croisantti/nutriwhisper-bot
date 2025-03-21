
import React from "react";
import ChatInput from "./ChatInput";
import ChatHistory from "./ChatHistory";
import AIPromptEditor from "./AIPromptEditor";
import { useChatSession } from "@/hooks/useChatSession";

const ChatContainer: React.FC = () => {
  const {
    messages,
    isLoading,
    isFetchingHistory,
    systemPrompt,
    handleSendMessage,
    updateSystemPrompt
  } = useChatSession();

  if (isFetchingHistory) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="loading-dots">Loading your chat history</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-end mb-2 px-4 pt-4">
        <AIPromptEditor 
          systemPrompt={systemPrompt}
          onUpdatePrompt={updateSystemPrompt}
        />
      </div>

      <ChatHistory 
        messages={messages}
        isLoading={isLoading}
      />

      <div className="border-t bg-background/80 backdrop-blur-sm px-4 py-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatContainer;
