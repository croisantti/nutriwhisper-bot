
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  nutritionGoals: z.string().min(1, { message: "Please share your nutrition goals" }),
  dietaryPreferences: z.array(z.string()).min(1, { message: "Please select at least one dietary preference" }),
  coachingType: z.string({ required_error: "Please select a coaching type" }),
});

type OnboardingProps = {
  onComplete: () => void;
};

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nutritionGoals: "",
      dietaryPreferences: [],
      coachingType: "",
    },
  });

  const dietaryOptions = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "gluten-free", label: "Gluten-free" },
    { id: "dairy-free", label: "Dairy-free" },
    { id: "keto", label: "Keto" },
    { id: "paleo", label: "Paleo" },
    { id: "no-restrictions", label: "No dietary restrictions" },
  ];

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      const { error } = await supabase.from("user_preferences").insert({
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

      onComplete();
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to NutriWhisper!</h1>
          <p className="text-muted-foreground mt-2">
            Let's personalize your experience with a few quick questions
          </p>
        </div>

        <div className="bg-card p-6 shadow-md rounded-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Complete Setup"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
