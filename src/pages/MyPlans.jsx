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
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const res = await authFetch("/api/gym-plan");
                const result = await res.json();
                if (res.ok) {
                    setPlans(result);
                } else {
                    setError(result.message || "Failed to fetch plans");
                }
            } catch (error) {
                console.error("Error occurred while fetching plans:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPlans();
    }, [authFetch]);

    return (
        <div className="myplans-page">
            <Header />
            <main className="home-content">
                <h1>My Plans</h1>

                {error && <p className="error">{error}</p>}
                {loading && <p className="loading">Loading...</p>}

                {!loading && plans.length === 0 && (
                    <p>You have no saved plans. <Link to="/gymplan">Create a new plan</Link>.</p>
                )}
                {/*Ai Generated*/}
                {plans && plans.length > 0 && (
                    <div className="myplans-list">
                        {plans.map((gymPlan) => (
                            <Link to={`/aiplan/${gymPlan._id}`} className="myplans-card" key={gymPlan._id}>
                                <h2>
                                    {GOAL_LABELS[gymPlan.answers.goal]} · {gymPlan.answers.daysPerWeek} days a week
                                </h2>
                                <p className="myplans-date">
                                    Created {new Date(gymPlan.createdAt).toLocaleDateString()}
                                </p>
                                {gymPlan.plan && <p>{gymPlan.plan.summary}</p>}
                            </Link>
                        ))}
                    </div>
                )}

                    <p><Link to="/gymplan">+ Generate a new plan</Link></p>

                   {/* end of Ai Generated*/}

            </main>
        </div>
    );
}

export default MyPlans;