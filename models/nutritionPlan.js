import mongoose from "mongoose";

const nutritionPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    answers: {
      currentWeight: { type: Number, required: true, min: 80, max: 400 },
      weightUnit: { type: String, required: true, enum: ["lbs", "kg"] },
      goal: {
        type: String,
        required: true,
        enum: ["lose_fat", "maintain", "general_fitness", "build_muscle"],
      },
      ingredients: { type: String, required: true, enum: ["none", "sporadic", 
        "regular", "broad"] },
      diet: { type: String, required: true, enum: ["omnivore", "carnivore", 
        "herbivore", "pescivore", "vegan", "kosher"] },
      allergies: { type: String, required: true},
      nonmeals: {
        type: [{ type: String, enum: ["breakfast", "lunch", "dinner"] }],
        validate: {
          validator: (list) => list.length < 3,
          message: "Cannot exclude every meal",
        },
      },
    },

    plan: { type: Object, default: null },
  },
  { timestamps: true }
);

const NutritionPlan = mongoose.model("NutritionPlan", nutritionPlanSchema);
export default NutritionPlan;
