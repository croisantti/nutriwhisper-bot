
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormValues, coachingOptions } from "./schema";

interface CoachingTypeFieldProps {
  form: UseFormReturn<OnboardingFormValues>;
}

export function CoachingTypeField({ form }: CoachingTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="coachingType"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">What type of coaching are you looking for?</FormLabel>
            <FormDescription>
              Select all areas you'd like guidance with.
            </FormDescription>
          </div>
          
          {coachingOptions.map((option) => (
            <FormField
              key={option.id}
              control={form.control}
              name="coachingType"
              render={({ field }) => {
                return (
                  <FormItem
                    key={option.id}
                    className="flex flex-row items-start space-x-3 space-y-0 py-1"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== option.id
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
