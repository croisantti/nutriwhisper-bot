
import React from "react";
import ChatInput from "./ChatInput";
import ChatHistory from "./ChatHistory";
import AIPromptEditor from "./AIPromptEditor";
import { useChatSession } from "@/hooks/useChatSession";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";

const ChatContainer: React.FC = () => {
  const {
    messages,
    isLoading,
    isFetchingHistory,
    systemPrompt,
    userPreferences,
    isSpeaking,
    setIsSpeaking,
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
      <div className="flex justify-between items-center mb-2 px-4 pt-4">
        <div className="flex items-center gap-2 text-sm">
          {isSpeaking && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 animate-pulse flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              Speaking
            </Badge>
          )}
          
          {userPreferences && (
            <>
              <span className="text-muted-foreground">Using your preferences:</span>
              {userPreferences.dietary_preferences.map((pref: string) => (
                <Badge key={pref} variant="outline" className="bg-secondary/50">
                  {pref}
                </Badge>
              ))}
            </>
          )}
        </div>
        <AIPromptEditor 
          systemPrompt={systemPrompt}
          onUpdatePrompt={updateSystemPrompt}
        />
      </div>

      <ChatHistory 
        messages={messages}
        isLoading={isLoading}
        onSpeakingChange={setIsSpeaking}
        systemPrompt={systemPrompt}
      />

      <div className="border-t bg-background/80 backdrop-blur-sm px-4 py-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatContainer;
