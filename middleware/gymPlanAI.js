import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import "dotenv/config.js";

const openai = new OpenAI();

// The shape the AI's plan will have
const ExerciseSchema = z.object({
  name: z.string(),        // "Barbell Bench Press"
  sets: z.number(),        // 4
  reps: z.string(),        // "8-10" or "30 seconds"
  restSeconds: z.number(), // 90
  notes: z.string(),       // short form tip
});

const DaySchema = z.object({
  day: z.string(),         // "Day 1"
  focus: z.string(),       // "Chest & Triceps"
  warmup: z.string(),
  exercises: z.array(ExerciseSchema),
});

const PlanSchema = z.object({
  summary: z.string(),     // a short overview of the plan
  days: z.array(DaySchema),
  tips: z.array(z.string()),
});

//Instructions for the AI
const SYSTEM_PROMPT = `You are an experienced, safety-conscious personal trainer.
Create a weekly workout plan that fits the person's goal, experience level,
available equipment, schedule, and focus areas.
- Create exactly one workout day for each training day per week they asked for.
- Each workout must fit within their time per session, including the warm-up.
- Only use exercises possible with their equipment.
- Match the difficulty to their experience level. Beginners need simpler movements.`;

// Turns the form answers into a message for the AI
function describeAnswers(answers) {
  return `Please create my weekly gym plan.
- Current weight: ${answers.currentWeight} ${answers.weightUnit}
- Goal weight: ${answers.goalWeight} ${answers.weightUnit}
- Main goal: ${answers.goal}
- Experience level: ${answers.experience}
- Equipment: ${answers.equipment}
- Training days per week: ${answers.daysPerWeek}
- Time per session: ${answers.sessionMinutes} minutes
- Focus areas: ${answers.focusAreas.join(", ")}`;
}

// Sends the answers to GPT-5.6 Luna and returns the plan in the plan schema
//AI generated
async function generateGymPlan(answers) {
  const response = await openai.responses.parse({
    model: "gpt-5.6-luna",
    max_output_tokens: 120000,
    reasoning: { effort: "medium" },      
    input: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: describeAnswers(answers) },
    ],
    text: {
      format: zodTextFormat(PlanSchema, "gym_plan"), // forces the answer into PlanSchema's shape
    },
  });

  // The AI declined, ran out of room, or the answer didn't match the shape
  if (!response.output_parsed) {
    throw new Error("The AI could not create a plan");
  }

  return response.output_parsed;
//End of Ai generation
}

export { generateGymPlan };
