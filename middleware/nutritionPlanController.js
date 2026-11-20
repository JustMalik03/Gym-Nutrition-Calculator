import NutritionPlan from "../models/nutritionPlan.js";
import { generateNutritionPlan } from "./nutritionPlanAI.js";

const createNutritionPlan = async (req, res) => {
    try {
        const {currentWeight, weightUnit, goal,
            ingredients, diet, allergies, nonmeals} = req.body;

        const answers = {currentWeight, weightUnit, goal,
            ingredients, diet, allergies, nonmeals};

        const nutritionPlan = new NutritionPlan({ user: req.userId, answers });

        await nutritionPlan.validate();

        nutritionPlan.plan = await generateNutritionPlan(answers);

        await nutritionPlan.save();
        res.status(201).json({ id: nutritionPlan.id });


    } catch (err) { 
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        console.error("Nutrition plan creation failed:", err);
        res.status(500).json({ message: "Could not generate your plan. Please try again." });

    }
}

const getNutritionPlan = async (req, res) => {
    try {
        const nutritionPlan = await NutritionPlan.findOne({ _id: req.params.id, user: req.userId });
        if (!nutritionPlan) {
            return res.status(404).json({ message: "Nutrition plan not found" });
        }

        res.status(200).json(nutritionPlan);

    } catch (err){
        if (err.name === "CastError") {
            return res.status(404).json({ message: "Plan not found" });
        }
        return res.status(500).json({ message: err.message });
    }

}

const getMyNutritionPlans = async (req, res) => {
    try {
        const nutritionPlans = await NutritionPlan.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .select("answers.goal answers.diet plan.summary createdAt");

        res.status(200).json(nutritionPlans);
    } catch (err) {
        console.error("Error fetching nutrition plans:", err);
        return res.status(500).json({ message: "Could not fetch your nutrition plans. Please try again." });
    }
}

export { createNutritionPlan, getNutritionPlan, getMyNutritionPlans };