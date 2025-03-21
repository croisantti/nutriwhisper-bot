
import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, serializeMessages, deserializeMessages } from "@/lib/types";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { fetchNutritionResponse } from "@/lib/openai";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Default prompt - this should match the one in openai.ts
const DEFAULT_SYSTEM_PROMPT = `You are NutriWhisper, an expert AI nutritionist with a calm, supportive approach.
- You provide science-based nutrition advice, healthy eating tips, and dietary recommendations.
- Keep responses concise and helpful, focusing on evidence-based information.
- When appropriate, suggest healthy alternatives or recipes.
- Be empathetic but professional, avoiding medical diagnoses.
- If you don't know something, admit it clearly rather than guessing.
- Don't provide specific medical advice - suggest consulting with a healthcare provider when appropriate.`;

const ChatContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: "Hello! I'm NutriWhisper, your AI nutrition assistant. How can I help with your nutrition questions today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history from Supabase
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;
      
      setIsFetchingHistory(true);
      try {
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 means no rows returned, which is fine for new users
          console.error("Error fetching chat history:", error);
          toast({
            title: "Error",
            description: "Failed to load chat history",
            variant: "destructive",
          });
        } else if (data && data.messages) {
          // Convert from Supabase JSON to Message[] type
          const savedMessages = deserializeMessages(data.messages as any[]);
          if (savedMessages.length > 0) {
            setMessages(savedMessages);
          }
        }
      } catch (error) {
        console.error("Error in fetchChatHistory:", error);
      } finally {
        setIsFetchingHistory(false);
      }
    };

    fetchChatHistory();
  }, [user, toast]);

  // Save messages to Supabase
  const saveChatHistory = async (updatedMessages: Message[]) => {
    if (!user) return;

    try {
      // Convert Message[] to format suitable for Supabase JSON
      const serializedMessages = serializeMessages(updatedMessages);

      const { data, error } = await supabase
        .from('chat_history')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error checking chat history:", error);
        return;
      }

      if (data) {
        // Update existing chat history
        await supabase
          .from('chat_history')
          .update({ 
            messages: serializedMessages, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', data.id);
      } else {
        // Create new chat history
        await supabase
          .from('chat_history')
          .insert({ 
            user_id: user.id, 
            messages: serializedMessages,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Get AI response
      const response = await fetchNutritionResponse(updatedMessages, systemPrompt);

      // Add AI response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
      // Save to Supabase
      if (user) {
        saveChatHistory(finalMessages);
      }
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: "Unable to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrompt = (newPrompt: string) => {
    setSystemPrompt(newPrompt);
    toast({
      title: "Prompt Updated",
      description: "Your custom AI prompt has been saved.",
    });
  };

  if (isFetchingHistory) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="loading-dots">Loading your chat history</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pb-4 pt-4">
        <div className="mx-auto max-w-3xl space-y-4 px-4">
          <div className="flex justify-end mb-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Edit AI Prompt
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Custom AI Prompt</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Customize how the AI assistant responds by editing the system prompt below.
                  </p>
                  <Textarea 
                    id="prompt" 
                    defaultValue={systemPrompt}
                    className="h-[300px] font-mono text-sm"
                    placeholder="Enter system prompt for the AI"
                    ref={(textarea) => {
                      if (textarea) {
                        textarea.value = systemPrompt;
                      }
                    }}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={() => {
                      const textarea = document.getElementById('prompt') as HTMLTextAreaElement;
                      handleSavePrompt(textarea.value);
                    }}>
                      Save Changes
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
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

      <div className="border-t bg-background/80 backdrop-blur-sm px-4 py-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatContainer;
