import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/components.jsx";
import { useAuth } from "../context/AuthContext";

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

    return (
        <>
            <Header />
            <main className="home-content">
                <h1>Your Gym Plan</h1>

                {error && <p className="error-message">{error}</p>}
                {!gymPlan && !error && <p>Loading...</p>}

                
                {gymPlan && (gymPlan.plan
                    ? <pre>{JSON.stringify(gymPlan.plan, null, 2)}</pre>
                    : <p>This plan was saved before AI generation was added.</p>
                )}

            </main>
        </>
    );
}

export default AiPlan;
