
import React from "react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Leafy, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "group flex items-start gap-4 p-4 transition-all",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary/10 text-primary">
          <Leafy className="h-5 w-5" />
        </div>
      )}
      <div
        className={cn(
          "flex max-w-[80%] flex-col space-y-2 overflow-hidden rounded-2xl px-4 py-3 animate-slide-up",
          isUser
            ? "bg-primary text-primary-foreground"
            : "glass-effect"
        )}
      >
        <div className="prose prose-sm dark:prose-invert">
          <p className="m-0 leading-relaxed text-balance">{message.content}</p>
        </div>
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
