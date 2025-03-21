
import * as z from "zod";

export const onboardingFormSchema = z.object({
  nutritionGoals: z.string().min(1, { message: "Please share your nutrition goals" }),
  dietaryPreferences: z.array(z.string()).min(1, { message: "Please select at least one dietary preference" }),
  coachingType: z.string({ required_error: "Please select a coaching type" }),
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
