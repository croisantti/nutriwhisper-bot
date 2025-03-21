
import { Message } from './types';

// In a production app, this would be handled via backend
// For demo purposes, we'll implement it in the frontend
export async function fetchNutritionResponse(messages: Message[]): Promise<string> {
  try {
    // Format messages for OpenAI API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system message if one doesn't exist at the beginning
    if (formattedMessages.length === 0 || formattedMessages[0].role !== 'system') {
      formattedMessages.unshift({
        role: 'system',
        content: `You are NutriWhisper, an expert AI nutritionist with a calm, supportive approach.
        - You provide science-based nutrition advice, healthy eating tips, and dietary recommendations.
        - Keep responses concise and helpful, focusing on evidence-based information.
        - When appropriate, suggest healthy alternatives or recipes.
        - Be empathetic but professional, avoiding medical diagnoses.
        - If you don't know something, admit it clearly rather than guessing.
        - Don't provide specific medical advice - suggest consulting with a healthcare provider when appropriate.`
      });
    }

    // Simulate API call
    // In a real app, you would call the OpenAI API here
    console.log("Sending to OpenAI API:", formattedMessages);
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock responses based on user input patterns
    const userMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (userMessage.includes("hello") || userMessage.includes("hi")) {
      return "Hello! I'm NutriWhisper, your AI nutrition assistant. How can I help with your nutrition questions today?";
    } 
    else if (userMessage.includes("protein")) {
      return "Protein is essential for muscle repair and growth. Good sources include lean meats, fish, eggs, dairy, legumes, tofu, and tempeh. For plant-based diets, combining different plant proteins helps ensure you get all essential amino acids. The recommended daily intake is generally 0.8g per kg of body weight, but this varies based on activity level and goals.";
    }
    else if (userMessage.includes("carb") || userMessage.includes("carbohydrate")) {
      return "Carbohydrates are your body's primary energy source. Focus on complex carbs like whole grains, fruits, vegetables, and legumes that provide sustained energy and fiber. Limit simple carbs like added sugars and refined grains, which can cause energy spikes and crashes. Personalized carb needs depend on your activity level, goals, and individual metabolism.";
    }
    else if (userMessage.includes("fat") || userMessage.includes("oils")) {
      return "Healthy fats are essential for hormone production, brain health, and nutrient absorption. Focus on sources of unsaturated fats like avocados, nuts, seeds, and olive oil. Limit saturated fats from animal products and avoid trans fats found in processed foods. About 20-35% of your daily calories should come from healthy fat sources.";
    }
    else if (userMessage.includes("diet") || userMessage.includes("weight loss")) {
      return "Sustainable weight management comes from a balanced approach to nutrition rather than restrictive diets. Focus on whole foods, appropriate portion sizes, and mindful eating habits. Create a small calorie deficit through a combination of nutrient-dense foods and regular physical activity. Remember that healthy, sustainable weight change is typically 0.5-1kg per week.";
    }
    else if (userMessage.includes("recipe") || userMessage.includes("meal")) {
      return "A balanced meal combines protein, complex carbs, healthy fats, and plenty of vegetables. For a quick nutritious meal, try a Buddha bowl: quinoa base, roasted vegetables (sweet potatoes, broccoli), a protein source (chickpeas, tofu, or grilled chicken), avocado slices, and a tahini-lemon dressing. It's customizable, nutrient-dense, and can be prepared in advance for convenient healthy eating.";
    }
    else {
      return "That's an interesting nutrition question. A balanced diet should include a variety of whole foods—fruits, vegetables, whole grains, lean proteins, and healthy fats. This provides the nutrients your body needs while supporting overall health. Would you like more specific information about any particular aspect of nutrition?";
    }
    
  } catch (error) {
    console.error("Error fetching nutrition response:", error);
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
}
