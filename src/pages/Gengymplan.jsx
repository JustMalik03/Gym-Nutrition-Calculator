import Header from "../components/components.jsx";
import { useForm } from "react-hook-form";
import "../css/GymPlan.css";


const GOALS = [
    { value: "lose_fat", label: "Lose fat" },
    { value: "build_muscle", label: "Build muscle" },
    { value: "get_stronger", label: "Get stronger" },
    { value: "maintain", label: "Maintain" },
    { value: "general_fitness", label: "General fitness" },
];

const EXPERIENCE = [
    { value: "beginner", label: "Beginner (less than 6 months)" },
    { value: "intermediate", label: "Intermediate (6 months - 2 years)" },
    { value: "advanced", label: "Advanced (2+ years)" },
];

const EQUIPMENT = [
    { value: "full_gym", label: "Full gym" },
    { value: "home_dumbbells", label: "Home (dumbbells)" },
    { value: "bodyweight", label: "Bodyweight only" },
];

const SESSION_LENGTHS = [30, 45, 60, 90, 120, 150, 180];

const FOCUS_AREAS = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Glutes", "Core", "Full body"];


function GymPlan(){
    const {
        register, handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm({
        defaultValues: {
            weightUnit: "1bs",
            daysPerWeek: 3,
            sessionMinutes: 60,
            focusAreas: [],
        },

});


    return(
        <>
        <Header />
        <main className="home-content gymplan-page">
        <h1> GYM PLAN</h1>
        <label htmlFor="currentWeight">Set your current weight:</label>
        <input id="currentWeight" type="number" {...register("currentWeight", 
            { required: "Current weight is required", valueAsNumber: true, min: { value: 50, message: "Weight must be a realistic number" },
            max: { value: 1000, message: "Weight must be a realistic number" } })} />
            {errors.currentWeight && <span className="error-message">{errors.currentWeight.message}</span>}

        </main>

        </>
    );
}

export default GymPlan;