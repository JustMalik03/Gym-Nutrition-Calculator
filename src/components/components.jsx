import { Link, useNavigate } from "react-router-dom";
import "../css/header.css";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

    let navigate = useNavigate();

  return (
    <header className="home-header">
      <h1>
        <a href="/">Gym Nutrition Calculator</a>
      </h1>
      <nav className="home-nav">
        {user ? (
          <>
            <button id="profile-menu-btn" popoverTarget="website-menu">
              <img
                src={user.avatarURL}
                alt="User Profile"
                id="header-profile-img"
              />
            </button>
            <div id="website-menu" popover="auto">
              <button onClick={() => navigate("/profile")} className="menu-btn">
                Profile
                </button>
              <button onClick={() => navigate("/myplans")} className="menu-btn">
                My Plans
              </button>
              <button onClick={() => navigate("/dashboard")} className="menu-btn">
                Dashboard
              </button>
              <button onClick={logout} className="menu-btn">
                Sign Out
              </button>
            </div>
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
