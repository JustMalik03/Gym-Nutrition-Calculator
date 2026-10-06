import { useState } from "react";
import "../css/ProfileSettings.css";
import { useAuth } from "../context/AuthContext";

function ProfileSettings() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {user} = useAuth();

  const handleUsername = async () => {
    try {
      console.log(user)
      const userEmail = user.email
      const res = await fetch("/api/update-username", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, userEmail }),
      });

      const result = await res.json();
      if(!res.ok){
        console.log("Username updated")
      } else {
        console.log("Failed to update username")
      }
    } catch (err) {
      console.log("Something went wrong")
  }
  };

  return (
    <>
      <h1>Profile Settings</h1>
      <div id="settings-container">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        {username && <button className="btn-update" onClick={handleUsername}>Update Username</button>}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        {email && <button className="btn-update">Update Email</button>}
        <label htmlFor="password">Change Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        ></input>
        {(password || confirmPassword) && (
          <button className="btn-update">Update Password</button>
        )}
      </div>
    </>
  );
}

export default ProfileSettings;
