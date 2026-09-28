import { Link } from "react-router-dom";
import "../css/header.css";
import { useAuth } from "../context/AuthContext";


function Header() {
    const { user, logout } = useAuth();
    return (
        <header className="home-header">
            <h1><a href="/">Gym Nutrition Calculator</a></h1>
            <nav className="home-nav">
                {user ? (
                    <>
                        <span id="userwelcome"><a href="/dashboard">Welcome, {user.username}!</a></span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;
