import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../css/ProfileSettings.css";

function ProfileSettings() {
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { user } = useAuth();
  const email = user.email;

  const handleUpdateUsername = async () => {
    try {
      const res = await fetch("/api/update-username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername, email }),
      });
      if (res.ok) {
        console.log("Username updated successfully.")
      } else {
        console.log("Failed to update username.");
      }
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const res = await fetch("/api/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, email }),
      });

      if (res.ok) {
        console.log("Password updated successfully");
      } else {
        console.log("Failed to update password");
      }
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  return (
    <>
      <h1>Profile Settings</h1>
      <div className="settings-container">
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            onChange={(e) => {
              setNewUsername(e.target.value);
            }}
          />
          {newUsername &&
            newUsername.length >= 4 &&
            newUsername.length < 26 && (
              <button className="btn-update" onClick={handleUpdateUsername}>
                Update Username
              </button>
            )}
        </div>
        <div>
          <label htmlFor="new-password">Change Password</label>
          <input
            type="password"
            id="new-password"
            placeholder="Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            id="confirm-newPassword"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {(newPassword || confirmNewPassword) && (
            <button className="btn-update" onClick={handleUpdatePassword}>
              Update Password
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfileSettings;
