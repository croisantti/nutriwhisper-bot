
import React from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormValues } from "./schema";

interface NutritionGoalsFieldProps {
  form: UseFormReturn<OnboardingFormValues>;
}

export function NutritionGoalsField({ form }: NutritionGoalsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="nutritionGoals"
      render={({ field }) => (
        <FormItem>
          <FormLabel>What are your nutrition goals?</FormLabel>
          <FormDescription>
            Tell us what you're looking to achieve with your diet.
          </FormDescription>
          <FormControl>
            <Textarea
              placeholder="e.g., Weight loss, building muscle, improving energy levels..."
              {...field}
              className="min-h-24"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
