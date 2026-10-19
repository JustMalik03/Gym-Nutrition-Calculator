import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/components.jsx";
import { useAuth } from "../context/AuthContext";
import "../css/AiPlan.css";


function AiPlan() {
    const { id } = useParams(); // the plan id from the URL /aiplan/:id
    const { authFetch } = useAuth();
    const [gymPlan, setGymPlan] = useState(null);
    const [error, setError] = useState("");

    // Load the plan from the server when the page opens
    useEffect(() => {
        const loadPlan = async () => {
            try {
                const res = await authFetch(`/api/gym-plan/${id}`);
                const result = await res.json();

                if (res.ok) {
                    setGymPlan(result);
                } else {
                    setError(result.message || "Could not load your plan");
                }
            } catch {
                setError("Could not connect to the server");
            }
        };

        loadPlan();
    }, [id, authFetch]);

    const plan = gymPlan ? gymPlan.plan : null;

    return (
        <>
            <Header />
            <main className="home-content">
                <h1>Your Gym Plan</h1>

                {error && <p className="error-message">{error}</p>}
                {!gymPlan && !error && <p>Loading...</p>}

                {/* Display the plan if it exists, or a message if it doesn't [AI GENERATED] */}

                {gymPlan && !plan && (
                    <p>This plan was saved before AI generation was added.</p>
                )}
                {/* The AI's plan also AI gen */}
                {plan && (
                    <div className="aiplan">
                        <p className="aiplan-summary">{plan.summary}</p>

                        {/* One card per day */}
                        {plan.days.map((day) => (
                            <section className="aiplan-day" key={day.day}>
                                <h2>{day.day}: {day.focus}</h2>
                                <p><strong>Warm-up:</strong> {day.warmup}</p>

                                <table className="aiplan-table">
                                    <thead>
                                        <tr>
                                            <th>Exercise</th>
                                            <th>Sets</th>
                                            <th>Reps</th>
                                            <th>Rest</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* One row per exercise in this day */}
                                        {day.exercises.map((exercise, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {exercise.name}
                                                    <div className="aiplan-notes">{exercise.notes}</div>
                                                </td>
                                                <td>{exercise.sets}</td>
                                                <td>{exercise.reps}</td>
                                                <td>{exercise.restSeconds}s</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        ))}

                        <h2>Tips</h2>
                        <ul className="aiplan-tips">
                            {plan.tips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                    </div>

                    /* end of AI generated content */
                )}

            </main>
        </>
    );
}

export default AiPlan;
