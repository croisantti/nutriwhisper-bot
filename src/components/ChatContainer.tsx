
import React, { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatHistory from "./ChatHistory";
import { useChatSession } from "@/hooks/useChatSession";
import { Badge } from "@/components/ui/badge";
import { Volume2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
    handleClearChat
  } = useChatSession();
  
  // After chat operations, ensure input is focused
  const focusInput = () => {
    setTimeout(() => {
      const chatInput = document.querySelector('textarea');
      if (chatInput instanceof HTMLTextAreaElement) {
        chatInput.focus();
      }
    }, 100);
  };

  // Enhanced send message handler that ensures focus is maintained
  const handleSend = (message: string) => {
    handleSendMessage(message);
    focusInput();
  };
  
  // Focus input on initial load
  useEffect(() => {
    if (!isFetchingHistory) {
      focusInput();
    }
  }, [isFetchingHistory]);

  if (isFetchingHistory) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="loading-dots">Loading your chat history</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 animate-pulse flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              Speaking
            </Badge>
          )}
          
          {userPreferences && (
            <div className="flex items-center gap-2">
              {userPreferences.dietary_preferences.map((pref: string) => (
                <Badge key={pref} variant="outline" className="bg-secondary/50">
                  {pref}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear Chat
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your entire conversation history. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  handleClearChat();
                  focusInput();
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Clear
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatHistory 
          messages={messages}
          isLoading={isLoading}
          onSpeakingChange={setIsSpeaking}
          systemPrompt={systemPrompt}
        />
      </div>

      <div className="border-t bg-background/80 backdrop-blur-sm p-4 mt-auto">
        <ChatInput onSendMessage={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatContainer;
