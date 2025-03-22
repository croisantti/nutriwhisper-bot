
import { Message } from './types';
import { supabase } from "@/integrations/supabase/client";

// Define the system prompt as a separate constant for easy editing
const DEFAULT_SYSTEM_PROMPT = `You are Yummi, an expert AI nutritionist with a warm, friendly, and supportive approach.
- You speak in a conversational, personal tone and occasionally use casual language to sound more human-like.
- You provide science-based nutrition advice, healthy eating tips, and dietary recommendations.
- Keep responses concise and helpful, focusing on evidence-based information.
- When appropriate, suggest healthy alternatives or recipes.
- Be empathetic and personable, avoiding medical diagnoses.
- If you don't know something, admit it clearly rather than guessing.
- Don't provide specific medical advice - suggest consulting with a healthcare provider when appropriate.
- Always identify yourself as "Yummi" in your responses to create a more personal connection.`;

export async function fetchNutritionResponse(
  messages: Message[], 
  customSystemPrompt?: string
): Promise<string> {
  try {
    // Format messages for OpenAI API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system message if one doesn't exist at the beginning
    if (formattedMessages.length === 0 || formattedMessages[0].role !== 'system') {
      formattedMessages.unshift({
        role: 'system',
        content: customSystemPrompt || DEFAULT_SYSTEM_PROMPT
      });
    }

    // Call our Supabase Edge Function instead of mocking
    const { data, error } = await supabase.functions.invoke('nutrition-ai', {
      body: {
        messages: formattedMessages
      }
    });

    if (error) {
      console.error("Edge function error:", error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("Invalid response from AI service");
    }

    // Check for quota exceeded error
    if (data.error === "API quota exceeded") {
      return "I'm sorry, but our AI service is currently unavailable due to exceeding the API quota. Please try again later.";
    }

    if (!data.content) {
      throw new Error("Invalid response from AI service");
    }

    return data.content;
    
  } catch (error) {
    console.error("Error fetching nutrition response:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}
