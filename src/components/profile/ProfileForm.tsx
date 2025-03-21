
import React, { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingFormSchema, OnboardingFormValues } from "@/components/onboarding/schema";
import { NutritionGoalsField } from "@/components/onboarding/NutritionGoalsField";
import { DietaryPreferencesField } from "@/components/onboarding/DietaryPreferencesField";
import { CoachingTypeField } from "@/components/onboarding/CoachingTypeField";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const ProfileForm: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      nutritionGoals: "",
      dietaryPreferences: [],
      coachingType: "",
    },
  });

  // Fetch user preferences when component mounts
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user preferences:", error);
          toast({
            title: "Error",
            description: "Failed to load your preferences",
            variant: "destructive",
          });
        } else if (data) {
          // Set form values with user's saved preferences
          form.reset({
            nutritionGoals: data.nutrition_goals,
            dietaryPreferences: data.dietary_preferences,
            coachingType: data.coaching_type,
          });
        }
      } catch (error) {
        console.error("Error in fetchUserPreferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPreferences();
  }, [user, form, toast]);

  const handleSubmit = async (values: OnboardingFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to update your preferences",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update the user preferences in the database
      const { error } = await supabase
        .from('user_preferences')
        .update({
          nutrition_goals: values.nutritionGoals,
          dietary_preferences: values.dietaryPreferences,
          coaching_type: values.coachingType,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your preferences have been saved successfully!",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="loading-dots">Loading your preferences</div>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 shadow-md rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <NutritionGoalsField form={form} />
          <DietaryPreferencesField form={form} />
          <CoachingTypeField form={form} />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
