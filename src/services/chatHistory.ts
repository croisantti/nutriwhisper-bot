
import { supabase } from "@/integrations/supabase/client";
import { Message, serializeMessages, deserializeMessages } from "@/lib/types";

/**
 * Fetch the most recent chat history for a user
 */
export const fetchChatHistory = async (userId: string) => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching chat history:", error);
      return [];
    }
    
    if (data && data.messages) {
      return deserializeMessages(data.messages as any[]);
    }
    
    return [];
  } catch (error) {
    console.error("Error in fetchChatHistory:", error);
    return [];
  }
};

/**
 * Save or update chat history for a user
 */
export const saveChatHistory = async (userId: string, messages: Message[]) => {
  if (!userId) return;

  try {
    const serializedMessages = serializeMessages(messages);

    const { data, error } = await supabase
      .from('chat_history')
      .select('id')
      .eq('user_id', userId)
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
          user_id: userId, 
          messages: serializedMessages,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};
