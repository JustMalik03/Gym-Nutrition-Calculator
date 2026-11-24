import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import "../css/ProfileSidebar.css"

function ProfileSidebar() {

    const navigate = useNavigate();

  return (
    <>
    <aside className="settings-sidebar">
      <div>
        <h3 className="sidebar-label">Settings</h3>
        <nav className="sidebar-nav">
          <button
            onClick={() => navigate("/profile/edit")}
            className="menu-btn"
          >
            <FaUser className="icon" />
            Account
          </button>
          <button
            onClick={() => navigate("/profile/security")}
            className="menu-btn"
          >
            <FaLock className="icon" />
            Security
          </button>
        </nav>
      </div>
    </aside>
    </>
  );
}

export default ProfileSidebar