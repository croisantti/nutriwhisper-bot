
import React, { useState } from "react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Leaf, User, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface ChatMessageProps {
  message: Message;
  onSpeakingChange: (speaking: boolean) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSpeakingChange }) => {
  const isUser = message.role === "user";
  const { speak, stop, isLoading, isPlaying } = useTextToSpeech();

  const handleToggleAudio = () => {
    if (isPlaying) {
      stop();
      onSpeakingChange(false);
    } else {
      speak(message.content, 'alloy'); // 'alloy' is a default voice
      onSpeakingChange(true);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-4 p-4 transition-all",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
          <Leaf className="h-5 w-5" />
        </div>
      )}
      <div
        className={cn(
          "flex max-w-[80%] flex-col space-y-2 overflow-hidden rounded-2xl px-4 py-3 animate-slide-up relative",
          isUser
            ? "bg-primary text-primary-foreground"
            : "glass-effect"
        )}
      >
        <div className="prose prose-sm dark:prose-invert">
          <p className="m-0 leading-relaxed text-balance">{message.content}</p>
        </div>
        
        {/* Only show speak button for assistant messages */}
        {!isUser && (
          <button 
            onClick={handleToggleAudio}
            className={cn(
              "absolute top-2 right-2 p-1 rounded-full transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100",
              isPlaying ? "bg-red-500 text-white" : "bg-primary/10 hover:bg-primary/20"
            )}
            aria-label={isPlaying ? "Stop speaking" : "Speak message"}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isPlaying ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </button>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <User className="h-5 w-5" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
