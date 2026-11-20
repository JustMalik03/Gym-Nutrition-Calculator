import Header from "../components/components.jsx";
import { useForm } from "react-hook-form";
import "../css/NutritionPlan.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";


function NutritionPlan(){
    const {
        register, handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm({
        defaultValues: {
            weightUnit: "lbs",
            nonmeals: [],
        },

});

const { authFetch } = useAuth();
const navigate = useNavigate();
const [serverError, setServerError] = useState("");


const onSubmit = async (data) => { 
    setServerError(null); // Reset server error before submission
    try{
        const res = await authFetch("/api/nutrition-plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();

        if (res.ok) {
            navigate(`/ainutritionplan/${result.id}`);
        } else {
            setServerError(result.message || "An error occurred while creating the nutrition plan.");
        }
    } catch (error) {
        setServerError("An error occurred while creating the nutrition plan.");
    }
};
    
    
    return(
        <>
        <Header />
        <main className="home-content nutritionplan-page">
        <h1>NUTRITION PLAN</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="nutritionplan-form">
            <label htmlFor="currentWeight">Current Weight:</label>
            <input id="currentWeight" type="number" {...register("currentWeight", {
                required: "Current weight is required",
                valueAsNumber: true,
                min: { value: 80, message: "Weight must be a realistic number" },
                max: { value: 400, message: "Weight must be a realistic number" }
            })} />
            {errors.currentWeight && <span className="error-message">{errors.currentWeight.message}</span>}
            
            <label htmlFor="weightUnit">Select your weight unit:</label>
            <select id="weightUnit" {...register("weightUnit", { required: "Weight unit is required" })}>
                <option value="lbs">Pounds (lbs)</option>
                <option value="kg">Kilograms (kg)</option>
            </select>
            {errors.weightUnit && <span className="error-message">{errors.weightUnit.message}</span>}

            <label htmlFor="goal">Main Goal</label>
            <select id="goal" {...register("goal", { required: "Pick a goal" })}>
                <option value="">Select...</option>
                <option value="lose_fat">Lose fat</option>
                <option value="maintain">Maintain</option>
                <option value="general_fitness">General fitness</option>
                <option value="build_muscle">Build muscle</option>
            </select>
            {errors.goal && <span className="error-message">{errors.goal.message}</span>}

            <label htmlFor="ingredients">Ingredient Availability:</label>
            <select id="ingredients" {...register("ingredients", { required: "Pick an ingredient availability option" })}>
                <option value="">Select...</option>
                <option value="none">Little to no access to basic ingredients</option>
                <option value="sporadic">Sporadic ability to visit supermarkets</option>
                <option value="regular">Able to purchase from regular grocery stores</option>
                <option value="broad">Wide range of sourcable fresh ingredients</option>
            </select>
            {errors.ingredients && <span className="error-message">{errors.ingredients.message}</span>}

            <label htmlFor="diet">Dietary Restriction:</label>
            <select id="diet" {...register("diet", {required: "Pick an dietary option"})}>
                <option value="">Select...</option>
                <option value="omnivore">Anything Goes</option>
                <option value="carnivore">Meats Only</option>
                <option value="herbivore">Vegetarian</option>
                <option value="pescivore">Pescitarian</option>
                <option value="vegan">Vegan</option>
                <option value="kosher">Kosher</option>
            </select>
            {errors.diet && <span className="error-message">{errors.diet.message}</span>}
            
            <label htmlFor="allergies">Allergy Restriction(s):</label>
            <input id="allergies" defaultValue="N/A" {...register("allergies")}/>

            <p>What Meals Should Be Excluded From The Plan?</p>
            <label><input type="checkbox" value="breakfast" {...register("nonmeals", {
                validate: (values = []) => values.length < 3 || "You cannot exclude every meal.",
            })} />Breakfast</label>
            <label><input type="checkbox" value="lunch" {...register("nonmeals")} />Lunch</label>
            <label><input type="checkbox" value="dinner" {...register("nonmeals")} />Dinner</label>
            {errors.nonmeals && <span className="error-message">{errors.nonmeals.message}</span>}

            {serverError && <span className="error-message">{serverError}</span>}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Generating your plan... (this can take up to a minute)" : "Submit"}
            </button>
        </form>
        <p id="go-home">Want to go home page? <Link to="/">Home</Link></p>
        </main>
        </>
    );
}

export default NutritionPlan;
