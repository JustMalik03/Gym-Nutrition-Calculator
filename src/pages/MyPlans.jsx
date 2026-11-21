import {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Header from "../components/components.jsx";
import {useAuth} from "../context/AuthContext";
import "../css/MyPlans.css";


const GOAL_LABELS = {
    lose_fat: "Lose fat",
    build_muscle: "Build muscle",
    get_stronger: "Get stronger",
    maintain: "Maintain",
    general_fitness: "General fitness",
};

function MyPlans(){
    const {authFetch} = useAuth();
    const [gymPlans, setGymPlans] = useState([]);
    const [gymLoading, setGymLoading] = useState(true);
    const [gymError, setGymError] = useState("");
    const [nutritionPlans, setNutritionPlans] = useState([]);
    const [nutritionLoading, setNutritionLoading] = useState(true);
    const [nutritionError, setNutritionError] = useState("");

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const [gymRes, nutritionRes] = await Promise.all([
                    authFetch("/api/gym-plan"),
                    authFetch("/api/nutrition-plan"),
                ]);
                const gymResult = await gymRes.json();
                const nutritionResult = await nutritionRes.json();
                
                if (gymRes.ok) {
                    setGymPlans(gymResult);
                } else {
                    setGymError(gymResult.message || "Failed to fetch gym plans");
                }

                if (nutritionRes.ok) {
                    setNutritionPlans(nutritionResult);
                } else {
                    setNutritionError(nutritionResult.message || "Failed to fetch nutrition plans");
                }

            } catch (error) {
                console.error("Error occurred while fetching plans:", error);
                setGymError("Could not connect.");
                setNutritionError("Could not connect.");
            } finally {
                setGymLoading(false);
                setNutritionLoading(false);
            }
        };

        loadPlans();
    }, [authFetch]);

    return (
        <div className="myplans-page">
            <Header />
            <main className="home-content">
                <div className="planscontainer">
                    <div className="planbox">
                        <h1>Gym Plans</h1>

                        {gymError && <p className="error">{error}</p>}
                        {gymLoading && <p className="loading">Loading...</p>}

                        {!gymLoading && gymPlans.length === 0 && (
                            <p>You have no saved gym plans. <Link to="/gymplan">Create a new plan</Link>.</p>
                        )}
                        {/*Ai Generated*/}
                        {gymPlans && gymPlans.length > 0 && (
                            <div className="myplans-list">
                                {gymPlans.map((gymPlan) => (
                                    <Link to={`/aigymplan/${gymPlan._id}`} className="myplans-card" key={gymPlan._id}>
                                        <h2>
                                            {GOAL_LABELS[gymPlan.answers.goal]} -- {gymPlan.answers.daysPerWeek} days a week
                                        </h2>
                                        <p className="myplans-date">
                                            Created {new Date(gymPlan.createdAt).toLocaleDateString()}
                                        </p>
                                        {gymPlan.plan && <p>{gymPlan.plan.summary}</p>}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <p><Link to="/gymplan">+ Generate a gym plan</Link></p>
                        {/* end of Ai Generated*/}
                    </div>
                    <div className="planbox">
                        <h1>Nutrition Plans</h1>

                        {nutritionError && <p className="error">{error}</p>}
                        {nutritionLoading && <p className="loading">Loading...</p>}
                        {!nutritionLoading && nutritionPlans.length === 0 && (
                            <p>You have no saved nutrition plans. <Link to="/nutritionplan">Create a new plan</Link>.</p>
                        )}

                        {nutritionPlans && nutritionPlans.length > 0 && (
                            <div className="myplans-list">
                                {nutritionPlans.map((nutritionPlan) => (
                                    <Link to={`/ainutritionplan/${nutritionPlan._id}`} className="myplans-card" key={nutritionPlan._id}>
                                        <h2>
                                            {GOAL_LABELS[nutritionPlan.answers.goal]} -- {nutritionPlan.answers.diet} diet
                                        </h2>
                                        <p>
                                            Created {new Date(nutritionPlan.createdAt).toLocaleDateString()}
                                        </p>
                                        {nutritionPlan.plan && <p>{nutritionPlan.plan.summary}</p>}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <p><Link to="/nutritionplan">+ Generate a nutrition plan</Link></p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MyPlans;