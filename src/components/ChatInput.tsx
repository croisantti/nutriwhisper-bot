
import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useToast } from "@/components/ui/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { 
    isRecording,
    isProcessing,
    startRecording,
    stopRecording
  } = useAudioRecorder();
  const { toast } = useToast();

  const isInputDisabled = isLoading || isProcessing;

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
    if (message.trim() && !isInputDisabled) {
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

  const handleVoiceRecording = async () => {
    if (isRecording) {
      try {
        const transcription = await stopRecording();
        setMessage(transcription);
        
        // Auto-submit if we got a valid transcription
        if (transcription.trim()) {
          onSendMessage(transcription);
          setMessage("");
        }
      } catch (error) {
        console.error("Error processing voice:", error);
        toast({
          title: "Error",
          description: "Failed to process your voice message",
          variant: "destructive",
        });
      }
    } else {
      startRecording();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel relative mb-4 mx-auto max-w-3xl rounded-2xl p-2 shadow-sm transition-all duration-300 ease-in-out focus-within:shadow-md"
    >
      <div className="flex items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about nutrition..."
          className="max-h-[120px] min-h-[40px] w-full resize-none border-0 bg-transparent p-2 pr-20 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm"
          disabled={isInputDisabled}
        />
        
        {/* Voice recording button */}
        <button
          type="button"
          onClick={handleVoiceRecording}
          disabled={isLoading}
          className={`absolute bottom-3 right-12 rounded-full p-1.5 transition-all duration-200 
          ${isRecording 
            ? "bg-red-500 text-white animate-pulse" 
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
        >
          {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={(!message.trim() && !isRecording) || isInputDisabled}
          className={`absolute bottom-3 right-3 rounded-full p-1.5 transition-all duration-200 
          ${
            message.trim() && !isInputDisabled
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isProcessing ? (
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
