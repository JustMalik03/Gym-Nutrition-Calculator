import { Link, useNavigate } from "react-router-dom";
import "../css/header.css";
import { useAuth } from "../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { FaChalkboard } from "react-icons/fa";

function Header() {
  const { user, logout } = useAuth();

    let navigate = useNavigate();

  return (
    <header className="home-header">
      <h1>
        <a href="/" id="header-title">FitBalancer</a>
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
              <button onClick={() => navigate("/profile/edit")} className="menu-btn">
                <FaUser className="icon"/>
                Profile
                </button>
              <button onClick={() => navigate("/myplans")} className="menu-btn">
                <FaBook className="icon"/>
                My Plans
              </button>
              <button onClick={() => navigate("/dashboard")} className="menu-btn">
                <FaChalkboard className="icon"/>
                Dashboard
              </button>
              <button onClick={logout} className="menu-btn signout-btn">
                <FiLogOut className="icon"/>
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} id="login-btn">
              Sign In
            </button>
            <button onClick={() => navigate("/signup")} id="signup-btn">
              Sign Up
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
