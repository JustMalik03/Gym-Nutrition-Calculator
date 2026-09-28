import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// wraps pages only logged-out users should see .
// logged-in users get sent to the dashboard instead.
function GuestRoute({ children }) {
    const { user } = useAuth();
    return user ? <Navigate to="/dashboard" replace /> : children;
}

export default GuestRoute;
