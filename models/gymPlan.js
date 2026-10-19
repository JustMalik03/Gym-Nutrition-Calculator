import mongoose from "mongoose";

const gymPlanSchema = new mongoose.Schema(
  {
    // Which user this plan belongs to for unique identification and retrieval
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // The answers from the form
    answers: {
      currentWeight: { type: Number, required: true, min: 50, max: 1000 },
      goalWeight: { type: Number, required: true, min: 50, max: 1000 },
      weightUnit: { type: String, required: true, enum: ["lbs", "kg"] },
      goal: {
        type: String,
        required: true,
        enum: ["lose_fat", "build_muscle", "get_stronger", "maintain", "general_fitness"],
      },

      experience: { type: String, required: true, enum: ["beginner", "intermediate", 
        "advanced"] },

      equipment: { type: String, required: true, enum: ["full_gym", "home_dumbbells", 
        "bodyweight"] },

      daysPerWeek: { type: Number, required: true, min: 1, max: 7 },
      sessionMinutes: { type: Number, required: true, min: 30, max: 180 },
      focusAreas: {
        type: [{ type: String, enum: ["chest", "back", "shoulders", 
            "arms", "legs", "glutes", "core", "full_body"] }],
        validate: {
          validator: (list) => list.length > 0,
          message: "Pick at least one focus area",
        },
      },
    },

    plan: { type: Object, default: null },
  },
  { timestamps: true }
);

const GymPlan = mongoose.model("GymPlan", gymPlanSchema);
export default GymPlan;
