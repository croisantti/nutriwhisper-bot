import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/lib/types";
import { fetchNutritionResponse } from "@/lib/openai";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { fetchUserPreferences } from "@/services/userPreferences";
import { fetchChatHistory, saveChatHistory, clearChatHistory } from "@/services/chatHistory";
import { DEFAULT_SYSTEM_PROMPT, generatePersonalizedPrompt } from "@/constants/prompts";

export const useChatSession = () => {
  const initialMessage: Message = {
    id: uuidv4(),
    role: "assistant",
    content: "Hello! I'm Yummi, your AI nutrition assistant. How can I help with your nutrition questions today?",
    timestamp: new Date(),
  };
  
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) return;
      
      const preferences = await fetchUserPreferences(user.id);
      if (preferences) {
        setUserPreferences(preferences);
        const customizedPrompt = generatePersonalizedPrompt(DEFAULT_SYSTEM_PROMPT, preferences);
        setSystemPrompt(customizedPrompt);
      }
    };

    loadUserPreferences();
  }, [user]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user) {
        setIsFetchingHistory(false);
        return;
      }
      
      setIsFetchingHistory(true);
      try {
        const savedMessages = await fetchChatHistory(user.id);
        if (savedMessages.length > 0) {
          setMessages(savedMessages);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive",
        });
      } finally {
        setIsFetchingHistory(false);
      }
    };

    loadChatHistory();
  }, [user, toast]);

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
        saveChatHistory(user.id, finalMessages);
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

  const handleClearChat = async () => {
    try {
      if (user) {
        await clearChatHistory(user.id);
      }
      
      const welcomeMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Chat history cleared. I'm Yummi, your nutrition coach. How can I help with your nutrition questions today?",
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      
      toast({
        title: "Success",
        description: "Chat history has been cleared",
      });
    } catch (error) {
      console.error("Error clearing chat history:", error);
      toast({
        title: "Error",
        description: "Failed to clear chat history",
        variant: "destructive",
      });
    }
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
    handleClearChat
  };
};
