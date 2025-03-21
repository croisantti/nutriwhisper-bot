import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, serializeMessages, deserializeMessages } from "@/lib/types";
import { fetchNutritionResponse } from "@/lib/openai";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export const DEFAULT_SYSTEM_PROMPT = `You are NutriWhisper, an expert AI nutritionist with a calm, supportive approach.
- You provide science-based nutrition advice, healthy eating tips, and dietary recommendations.
- Keep responses concise and helpful, focusing on evidence-based information.
- When appropriate, suggest healthy alternatives or recipes.
- Be empathetic but professional, avoiding medical diagnoses.
- If you don't know something, admit it clearly rather than guessing.
- Don't provide specific medical advice - suggest consulting with a healthcare provider when appropriate.`;

export const useChatSession = () => {
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
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user preferences:", error);
        } else if (data) {
          setUserPreferences(data);
          
          const customizedPrompt = `${DEFAULT_SYSTEM_PROMPT}
          
This user has shared the following nutrition information:
- Nutrition goals: ${data.nutrition_goals}
- Dietary preferences: ${data.dietary_preferences.join(', ')}
- Preferred coaching type: ${data.coaching_type}

Tailor your advice based on this information while remaining empathetic and helpful.`;
          
          setSystemPrompt(customizedPrompt);
        }
      } catch (error) {
        console.error("Error in fetchUserPreferences:", error);
      }
    };

    fetchUserPreferences();
  }, [user]);

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
          console.error("Error fetching chat history:", error);
          toast({
            title: "Error",
            description: "Failed to load chat history",
            variant: "destructive",
          });
        } else if (data && data.messages) {
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

  const saveChatHistory = async (updatedMessages: Message[]) => {
    if (!user) return;

    try {
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
        await supabase
          .from('chat_history')
          .update({ 
            messages: serializedMessages, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', data.id);
      } else {
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
      const response = await fetchNutritionResponse(updatedMessages, systemPrompt);

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      
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

  const updateSystemPrompt = (newPrompt: string) => {
    setSystemPrompt(newPrompt);
  };

  return {
    messages,
    isLoading,
    isFetchingHistory,
    systemPrompt,
    userPreferences,
    isSpeaking,
    setIsSpeaking,
    handleSendMessage,
    updateSystemPrompt
  };
};
