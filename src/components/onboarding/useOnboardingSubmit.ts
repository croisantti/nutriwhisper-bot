
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { OnboardingFormValues } from "./schema";

export function useOnboardingSubmit(onComplete: () => void) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: OnboardingFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to complete onboarding",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('user_preferences').insert({
        user_id: user.id,
        nutrition_goals: values.nutritionGoals,
        dietary_preferences: values.dietaryPreferences,
        coaching_type: values.coachingType,
      });

      if (error) throw error;

      toast({
        title: "Onboarding Complete",
        description: "Your preferences have been saved successfully!",
      });

      setTimeout(() => {
        onComplete();
      }, 500);
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
