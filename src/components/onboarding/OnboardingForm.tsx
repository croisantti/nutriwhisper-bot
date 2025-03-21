
import React from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingFormSchema, OnboardingFormValues } from "./schema";
import { NutritionGoalsField } from "./NutritionGoalsField";
import { DietaryPreferencesField } from "./DietaryPreferencesField";
import { CoachingTypeField } from "./CoachingTypeField";
import { useOnboardingSubmit } from "./useOnboardingSubmit";

interface OnboardingFormProps {
  onComplete: () => void;
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      nutritionGoals: "",
      dietaryPreferences: [],
      coachingType: "",
    },
  });

  const { handleSubmit, isSubmitting } = useOnboardingSubmit(onComplete);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <NutritionGoalsField form={form} />
        <DietaryPreferencesField form={form} />
        <CoachingTypeField form={form} />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Complete Setup"}
        </Button>
      </form>
    </Form>
  );
}
