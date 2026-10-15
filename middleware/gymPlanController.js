import GymPlan from "../models/gymPlan.js";
import { generateGymPlan } from "./gymPlanAI.js";

// Post to save form answers for the loged in user
//now gymplan for user now saved
const createGymPlan = async (req, res) => {
    try {
               //collect the answers from the form
        const {currentWeight, goalWeight, weightUnit,
             goal, experience, equipment, daysPerWeek,
             sessionMinutes, focusAreas} = req.body;

        const answers = {currentWeight, goalWeight, weightUnit,
            goal, experience, equipment, daysPerWeek,
            sessionMinutes, focusAreas};

        const gymPlan = new GymPlan({ user: req.userId, answers });

        // Check the answers against the model's rules BEFORE paying for an AI call
        await gymPlan.validate();

        // Ask the AI for a plan (takes several seconds)
        gymPlan.plan = await generateGymPlan(answers);

        await gymPlan.save(); //database save
        res.status(201).json({ id: gymPlan.id });


    } catch (err) {
        //If a specific rule failed 
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
        }
        console.error("Gym plan creation failed:", err);
        res.status(500).json({ message: "Could not generate your plan. Please try again." });

    }
}

//Now we load the plan if it belongs to user
const getGymPlan = async (req, res) => {
    try {
        const gymPlan = await GymPlan.findOne({ _id: req.params.id, user: req.userId });
        if (!gymPlan) {
            return res.status(404).json({ message: "Gym plan not found" });
        }

        res.status(200).json(gymPlan);

    } catch (err){
        if (err.name === "CastError") {
            return res.status(404).json({ message: "Plan not found" });
        }
        return res.status(500).json({ message: err.message });
    }

}

export { createGymPlan, getGymPlan };
