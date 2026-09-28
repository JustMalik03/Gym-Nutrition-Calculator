import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap pages only logged-in users should see.
// Logged-out users get sent to the login page instead.
function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
