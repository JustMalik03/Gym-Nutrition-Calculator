import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FaPencilAlt, FaCalendar, FaCheck, FaRegSave } from "react-icons/fa";
import { BsUpload } from "react-icons/bs";
import "../css/Profile.css";

function Profile() {
  const { user, updateUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");

  

  const email = user.email;
  const avatarRef = useRef(null);
  const months = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const isodate = new Date(user.createdAt);
  const joinDate = isodate.toLocaleDateString("en-US");
  const [month, day, year] = joinDate.split("/");
  const formatDate = `${months[month - 1]}, ${day}, ${year}`;

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
        // Update the saved user so the header shows the new name right away
        updateUser({ ...user, username: newUsername });
        console.log("Username updated successfully.");
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

  const handleAvatarBtnClick = (e) => {
    if (avatarRef.current) {
      avatarRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      console.log(file);
    }
  };

  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("avatar", selectedFile);
    if (!selectedFile) {
      setErrMessage("Please select a file")
      return;
    }
    try {
      const res = await fetch(`/api/profile-upload/${user.userId}`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Upload successful!");
      } else {
        console.log("Failed to upload image");
      }
    } catch (err) {
      console.error("Something went wrong", err);
    }
  };

  return (
    <>
      <h1>Profile Settings</h1>
      <div className="settings-container">
        <div className="avatar-image-container">
          <button className="avatar-edit-btn" popoverTarget="avatar-menu">
            <FaPencilAlt />
          </button>
          <div className="avatar-circle">
            <img
              className="avatar-image"
              src={user.avatarURL}
              alt="profile image"
            />
          </div>
        </div>
        <div className="profile-info">
          <div className="user-info">
          <h2>{user.username}</h2> 
          {user.isVerified && (
            <div className="verified-badge" aria-label="verifed badge">
              <FaCheck size="0.8rem" />
            </div>
          )}
          </div>
          <p><FaCalendar className="icon" /> Joined {formatDate}</p>
          <p><BsUpload className="icon" /> Max upload size 5MB (PNG, JPEG, JPG)</p>
          <button className="btn-update" onClick={handleFileUpload}><FaRegSave /> Save Avatar</button>
          {errMessage && (<p className="error-message">{errMessage}</p>)}
        </div>
        <div id="avatar-menu" popover="auto">
          <button className="avatar-btn" onClick={handleAvatarBtnClick}>
            <BsUpload className="icon"/> Change avatar image
          </button>
          <input
            ref={avatarRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <p className="input-info">4-27 characters</p>
          <input
            type="text"
            id="username"
            value={newUsername}
            onChange={(e) => {
              setNewUsername(e.target.value);
            }}
          />
          {newUsername !== user.username &&
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

export default Profile;
