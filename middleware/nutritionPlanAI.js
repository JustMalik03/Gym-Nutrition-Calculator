import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import "dotenv/config.js";

const openai = new OpenAI();

const MealSchema = z.object({
  timeofday: z.string(),
  name: z.string(),
  calories: z.number(),
  nutrition: z.string(),
  ingredients: z.string(),
  notes: z.string(),
});

const DaySchema = z.object({
  day: z.string(),
  totalcalories: z.number(),
  meals: z.array(MealSchema),
});

const PlanSchema = z.object({
  summary: z.string(),
  days: z.array(DaySchema),
  tips: z.array(z.string()),
});

const SYSTEM_PROMPT = `You are an experienced, nutrition-conscious personal trainer.
Create a weekly meal plan that fits the person's goal, available ingredients,
dietary preferences, and schedule.
- Create three meals per day for each day of the week, unless the person is skipping a certain meal(s).
- Avoid meals that conflict with the person's allergies.
- Assume basic cooking machines/utensils. Cutlery, plates, bowls, oven/microwave, toaster, etc.
- Only create meals possible with their ingredient availability. Store bought is better for those without ingredients, etc..
- Match the meal's nutrition to their choice of diet. Vegetarians cannot eat meat, etc..
- Match the meal's nutrition to their goal. Losing fat requires a caloric deficit, etc..`;

function describeAnswers(answers) {
  return `Please create my weekly nutrition plan.
- Current Weight: ${answers.currentWeight} ${answers.weightUnit}
- Goal: ${answers.goal}
- Ingredient Availability: ${answers.ingredients}
- Diet: ${answers.diet}
- Allergies: ${answers.allergies}
- Meals Skipped: ${answers.nonmeals.join(", ")}`;
}

async function generateNutritionPlan(answers) {
  const response = await openai.responses.parse({
    model: "gpt-5.6-luna",
    max_output_tokens: 120000,
    reasoning: { effort: "medium" },      
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: describeAnswers(answers) },
    ],
    text: {
      format: zodTextFormat(PlanSchema, "nutrition_plan"),
    },
  });

  if (!response.output_parsed) {
    throw new Error("The AI could not create a plan");
  }

  return response.output_parsed;
}

export {generateNutritionPlan};