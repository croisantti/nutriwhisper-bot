
import * as z from "zod";

export const onboardingFormSchema = z.object({
  nutritionGoals: z.string().min(1, { message: "Please share your nutrition goals" }),
  dietaryPreferences: z.array(z.string()).min(1, { message: "Please select at least one dietary preference" }),
  customDietaryPreferences: z.string().optional(),
  coachingType: z.array(z.string()).min(1, { message: "Please select at least one coaching type" }),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-free" },
  { id: "dairy-free", label: "Dairy-free" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "no-restrictions", label: "No dietary restrictions" },
];

export const coachingOptions = [
  { id: "meal-planning", label: "Meal planning and recipes" },
  { id: "nutritional-advice", label: "Nutritional advice and education" },
  { id: "diet-optimization", label: "Diet optimization for specific goals" },
  { id: "health-management", label: "Managing health conditions through diet" },
  { id: "healthy-habits", label: "Building sustainable healthy habits" },
  { id: "specialty-diets", label: "Guidance for plant-based or specialty diets" },
  { id: "emotional-eating", label: "Support with emotional or stress-related eating" },
  { id: "family-nutrition", label: "Family or child-friendly nutrition coaching" },
];
