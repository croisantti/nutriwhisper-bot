
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormValues } from "./schema";

interface CoachingTypeFieldProps {
  form: UseFormReturn<OnboardingFormValues>;
}

export function CoachingTypeField({ form }: CoachingTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="coachingType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>What type of coaching are you looking for?</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="meal-planning" />
                </FormControl>
                <FormLabel className="font-normal">
                  Meal planning and recipes
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="nutritional-advice" />
                </FormControl>
                <FormLabel className="font-normal">
                  Nutritional advice and education
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="diet-optimization" />
                </FormControl>
                <FormLabel className="font-normal">
                  Diet optimization for specific goals
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="health-management" />
                </FormControl>
                <FormLabel className="font-normal">
                  Managing health conditions through diet
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
