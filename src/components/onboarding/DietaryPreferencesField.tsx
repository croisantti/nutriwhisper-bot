
import React from "react";
import { FormField, FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormValues, dietaryOptions } from "./schema";

interface DietaryPreferencesFieldProps {
  form: UseFormReturn<OnboardingFormValues>;
}

export function DietaryPreferencesField({ form }: DietaryPreferencesFieldProps) {
  return (
    <FormField
      control={form.control}
      name="dietaryPreferences"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">
              Do you have any dietary preferences or restrictions?
            </FormLabel>
            <FormDescription>
              Select all that apply to you.
            </FormDescription>
          </div>
          {dietaryOptions.map((option) => (
            <FormField
              key={option.id}
              control={form.control}
              name="dietaryPreferences"
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
