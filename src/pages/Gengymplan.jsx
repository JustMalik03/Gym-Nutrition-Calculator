import Header from "../components/components.jsx";
import { useForm } from "react-hook-form";
import "../css/GymPlan.css";
import { Link } from "react-router-dom";

function GymPlan(){
    const {
        register, handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm({
        defaultValues: {
            weightUnit: "lbs",
            focusAreas: [],
        },

});

const onSubmit = (data) => {
    console.log("Form submitted with data:", data);
//See data being sent
};


    return(
        <>
        <Header />
        <main className="home-content gymplan-page">
        <h1> GYM PLAN</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="gymplan-form">
        <label htmlFor="currentWeight">Set your current weight:</label>
        <input id="currentWeight" type="number" {...register("currentWeight", 
            { required: "Current weight is required", valueAsNumber: true, min: { value: 50, message: "Weight must be a realistic number" },
            max: { value: 1000, message: "Weight must be a realistic number" } })} />
            {errors.currentWeight && <span className="error-message">{errors.currentWeight.message}</span>}

        <label htmlFor="goalWeight">Enter your goal: </label>
        <input id="goalWeight" type="number" {...register("goalWeight",
            { required: "Goal weight is required", valueAsNumber: true, min: { value: 50, message: "Weight must be a realistic number" },
            max: { value: 1000, message: "Weight must be a realistic number" } })} />
            {errors.goalWeight && <span className="error-message">{errors.goalWeight.message}</span>}
        
        <label htmlFor="weightUnit">Select your weight unit:</label>
        <select id="weightUnit" {...register("weightUnit", { required: "Weight unit is required" })}>
            <option value="lbs">Pounds (lbs)</option>
            <option value="kg">Kilograms (kg)</option>
        </select>
        {errors.weightUnit && <span className="error-message">{errors.weightUnit.message}</span>}

        <label htmlFor="goal">Main goal</label>
        <select id="goal" {...register("goal", { required: "Pick a goal" })}>
            <option value="">Select...</option>
            <option value="lose_fat">Lose fat</option>
            <option value="build_muscle">Build muscle</option>
            <option value="get_stronger">Get stronger</option>
            <option value="maintain">Maintain</option>
            <option value="general_fitness">General fitness</option>
        </select>
        {errors.goal && <span className="error-message">{errors.goal.message}</span>}

        <label htmlFor="experience">Experience level:</label>
        <select id="experience" {...register("experience", {required: "Pick an experience level"})}>
            <option value="">Select...</option>
            <option value="beginner">Beginner (less than 6 months)</option>
            <option value="intermediate">Intermediate (6 months - 2 years)</option>
            <option value="advanced">Advanced (2+ years)</option>
        </select>
        {errors.experience && <span className="error-message">{errors.experience.message}</span>}

        <label htmlFor="equipment">Available equipment:</label>
        <select id="equipment" {...register("equipment", {required: "Pick an equipment option"})}>
            <option value="">Select...</option>
            <option value="full_gym">Full gym</option>
            <option value="home_dumbbells">Home (dumbbells)</option>
            <option value="bodyweight">Bodyweight only</option>
        </select>
        {errors.equipment && <span className="error-message">{errors.equipment.message}</span>}

        <label htmlFor="daysPerWeek">Days per week:</label>
        <select id="daysPerWeek" {...register("daysPerWeek", {required: "Pick a number of days per week", valueAsNumber: true})}>
            <option value="">Select...</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
        </select>
        {errors.daysPerWeek && <span className="error-message">{errors.daysPerWeek.message}</span>}
        
        <label htmlFor="sessionMinutes">Session length (minutes):</label>
        <select id="sessionMinutes" {...register("sessionMinutes", {required: "Pick a session length", valueAsNumber: true})}>
            <option value="">Select...</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
            <option value="90">90</option>
            <option value="120">120</option>
            <option value="150">150</option>
            <option value="180">180</option>
        </select>
        {errors.sessionMinutes && <span className="error-message">{errors.sessionMinutes.message}</span>}

        <p>Which areas do you want to focus on?</p>
        <label><input type="checkbox" value="chest" {...register("focusAreas", { required: "Pick at least one area" })} /> Chest</label>
        <label><input type="checkbox" value="back" {...register("focusAreas")} /> Back</label>
        <label><input type="checkbox" value="shoulders" {...register("focusAreas")} /> Shoulders</label>
        <label><input type="checkbox" value="arms" {...register("focusAreas")} /> Arms</label>
        <label><input type="checkbox" value="legs" {...register("focusAreas")} /> Legs</label>
        <label><input type="checkbox" value="glutes" {...register("focusAreas")} /> Glutes</label>
        <label><input type="checkbox" value="core" {...register("focusAreas")} /> Core</label>
        <label><input type="checkbox" value="full_body" {...register("focusAreas")} /> Full body</label>
        {errors.focusAreas && <span className="error-message">{errors.focusAreas.message}</span>}


        <button type="submit" disabled={isSubmitting}>Submit</button>
        </form>
        <p id="go-home">Want to go home page? <Link to="/">Home</Link></p>
        </main>
        </>
    );}

export default GymPlan;