import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/components.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/AiNutritionPlan.css";


function AiNutritionPlan() {
    const { id } = useParams();
    const { authFetch } = useAuth();
    const [nutritionPlan, setNutritionPlan] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPlan = async () => {
            try {
                const res = await authFetch(`/api/nutrition-plan/${id}`);
                const result = await res.json();

                if (res.ok) {
                    setNutritionPlan(result);
                } else {
                    setError(result.message || "Could not load your plan");
                }
            } catch {
                setError("Could not connect to the server");
            }
        };

        loadPlan();
    }, [id, authFetch]);

    const plan = nutritionPlan ? nutritionPlan.plan : null;

    return (
        <>
            <Header />
            <main className="home-content">
                <h1>Your Nutrition Plan</h1>

                {error && <p className="error-message">{error}</p>}
                {!nutritionPlan && !error && <p>Loading...</p>}

                {nutritionPlan && !plan && (
                    <p>This plan was saved before AI generation was added.</p>
                )}
                
                {plan && (
                    <div className="ainutritionplan">
                        <p className="ainutritionplan-summary">{plan.summary}</p>

                        {plan.days.map((day) => (
                            <section className="ainutritionplan-day" key={day.day}>
                                <p><strong>Total Calories:</strong> {day.totalcalories}</p>

                                <table className="ainutritionplan-table">
                                    <thead>
                                        <tr>
                                            <th>Meal</th>
                                            <th>Name</th>
                                            <th>Calories</th>
                                            <th>Nutrition</th>
                                            <th>Ingredients</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {day.meals.map((meal, index) => (
                                            <tr key={index}>
                                                <td>{meal.timeofday}</td>
                                                <td>
                                                    {meal.name}
                                                    <div className="ainutritionplan-notes">{meal.notes}</div>
                                                </td>
                                                <td>{meal.calories}</td>
                                                <td>{meal.nutrition}</td>
                                                <td>{meal.ingredients}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        ))}

                        <h2>Tips</h2>
                        <ul className="ainutritionplan-tips">
                            {plan.tips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                    </div>

                )}

            </main>
        </>
    );
}

export default AiNutritionPlan;
