
import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Auto-focus when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Re-focus when user returns to the page
  useEffect(() => {
    const handleFocus = () => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        handleFocus();
      }
    });

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel relative mb-4 mx-auto max-w-3xl rounded-2xl p-2 shadow-sm transition-all duration-300 ease-in-out focus-within:shadow-md animate-slide-up"
    >
      <div className="flex items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about nutrition..."
          className="max-h-[120px] min-h-[40px] w-full resize-none border-0 bg-transparent p-2 pr-12 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm focus:outline-none"
          style={{ 
            borderColor: 'transparent',
            boxShadow: 'none'
          }}
          disabled={isLoading}
        />
        
        {/* Submit button with animations */}
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={cn(
            "absolute bottom-3 right-3 rounded-full p-1.5 transition-all duration-200",
            "hover:scale-110 hover:shadow-md",
            message.trim() && !isLoading
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-muted text-muted-foreground"
          )}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
