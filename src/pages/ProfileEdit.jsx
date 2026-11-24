import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FaPencilAlt, FaCalendar, FaCheck, FaRegSave } from "react-icons/fa";
import { LuUserPen } from "react-icons/lu";

import { BsUpload } from "react-icons/bs";

import "../css/Profile.css";
import Header from "../components/components";
import ProfileSidebar from "../components/ProfileSidebar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function ProfileEdit() {
  const { user, updateUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);

  const [errMessage, setErrMessage] = useState("");
  const [newUsername, setNewUsername] = useState(user.username);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [open, setOpen] = useState(false);
  const [userBio, setUserBio] = useState(user.bio);

  const avatarRef = useRef(null);
  
  const email = user.email;
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

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("avatar", selectedFile);
    if (!selectedFile) {
      setErrMessage("Please select a file");
      return;
    }
    try {
      const res = await fetch(`/api/profile-upload/${user.userId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        updateUser({ ...user, avatarURL: data.filePath });
        console.log("Upload successful!");
      } else {
        showError(
          data.message || "There was a problem uploading your profile image",
        );
      }
    } catch (err) {
      console.error("Something went wrong", err);
    }
  };

  const handleProfileChanges = async () => {
    try {
      const res = await fetch("/api/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername, userBio, email }),
      });

      const result = await res.json();

      if (res.ok) {
        updateUser({ ...user, username: result.updatedUser.username, bio: result.updatedUser.bio });
        setAlertType("success");
        showMessage(result.message || "Profile updated successfully");
      } else {
        setAlertType("error");
        showMessage(result.message || "Failed to update profile");
      }
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  const handleBioUpdate = (e) => {
    const profileBio = e.target.value;
    if(profileBio.length > 500){
      return;
    }
    setUserBio(profileBio);
  }

  const showMessage = (message) => {
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (e, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <>
      <Header />
      <div className="layout">
        <ProfileSidebar />
        <main className="settings-main">
          <section className="settings-section">
            <div className="settings-inner">
              <h2 className="settings-header">Account</h2>
              <div className="user-card">
                <div className="user-card-info">
                  <div className="avatar-image-container">
                    <button
                      className="avatar-edit-btn"
                      popoverTarget="avatar-menu"
                    >
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
                        <div
                          className="verified-badge"
                          aria-label="verifed badge"
                        >
                          <FaCheck size="0.8rem" />
                        </div>
                      )}
                    </div>
                    <p>
                      <FaCalendar className="icon" /> Joined {formatDate}
                    </p>
                    <p>
                      <BsUpload className="icon" /> Max upload size 5MB (PNG,
                      JPEG, JPG)
                    </p>
                    {errMessage && (
                      <p className="error-message">{errMessage}</p>
                    )}
                  </div>
                  <div id="avatar-menu" popover="auto">
                    <button className="menu-btn" onClick={handleAvatarBtnClick}>
                      <BsUpload className="icon" /> Change avatar image
                    </button>
                    <input
                      ref={avatarRef}
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
                <button
                  id="save-avatar"
                  className="submit-btn"
                  onClick={handleFileUpload}
                >
                  <FaRegSave className="icon" /> Save Avatar
                </button>
              </div>
              <div className="user-details">
                <label>Username</label>
                <span className="info-text">
                  4-26 characters, letters and numbers only
                </span>
                <input
                  type="text"
                  className="input"
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />

                <label>Bio</label>
                <span className="info-text">
                  Tell us a little bit about yourself
                </span>
                <textarea
                  className="text-area-input input"
                  rows={5}
                  cols={100}
                  value={userBio}
                  onChange={handleBioUpdate}
                ></textarea>
                <span className="text-count">{userBio.length}/500</span>
                <button className="submit-btn" onClick={handleProfileChanges}>
                  <LuUserPen className="icon" />
                  Update Profile
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProfileEdit;
