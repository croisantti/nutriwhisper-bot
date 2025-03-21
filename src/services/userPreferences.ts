
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch user preferences from Supabase
 */
export const fetchUserPreferences = async (userId: string) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Error fetching user preferences:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchUserPreferences:", error);
    return null;
  }
};
