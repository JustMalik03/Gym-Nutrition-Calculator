import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaPencilAlt,
  FaCalendar,
  FaCheck,
  FaRegSave,
  FaKey,
  FaUser,
  FaLock,
} from "react-icons/fa";
import { LuUserPen } from "react-icons/lu";
import { BsUpload } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import "../css/Profile.css";
import Header from "../components/components";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Profile() {
  const { user, updateUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [newUsername, setNewUsername] = useState(user.username);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [verifyEmailPassword, setVerifyEmailPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("error");

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
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{8,}$/;
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const joinDate = isodate.toLocaleDateString("en-US");
  const [month, day, year] = joinDate.split("/");
  const formatDate = `${months[month - 1]}, ${day}, ${year}`;
  const validUsername = useRef(false);
  const validPassword = useRef(false);
  const validNewPassword = useRef(false);
  const validMatchPassword = useRef(false);
  const validEmail = useRef(false);
  const validVerifyPassword = useRef(false);

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
        setAlertType("success");
        showMessage("Username updated successfully");
      } else {
        setAlertType("error");
        showMessage("Failed to update username");
      }
    } catch (err) {
      console.log("Something went wrong");
    }
  };

  const handleUsernameValidation = (e) => {
    const username = e.target.value.trim();
    setNewUsername(e.target.value);
    if (
      username.length >= 4 &&
      username.length < 26 &&
      username !== user.username &&
      /^[a-zA-Z0-9]+$/.test(username)
    ) {
      validUsername.current = true;
    } else {
      validUsername.current = false;
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const res = await fetch("/api/update-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
          email,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setAlertType("success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        showMessage(result.message || "Password updated successfully");
      } else {
        setAlertType("error");
        showMessage(
          result.message || "There was an error updating your password",
        );
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

  const handleUpdateEmail = async () => {
    const userId = user.userId;
    try {
      const res = await fetch("/api/update-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEmail, verifyEmailPassword, userId }),
      });

      const result = await res.json();
      if (res.ok) {
        updateUser({...user, isVerified: result.user.isVerified, email: result.user.email})
        setAlertType("success");
        showMessage(result.message || "Email address updated successfully");
      } else {
        setAlertType("error");
        showMessage(result.message || "Failed to update email address");
      }
    } catch (error) {
      setAlertType("error");
      showMessage("Something went wrong");
    }
  };

  const handleSendEmail = async () => {
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const result = await res.json();
      if(res.ok){
        setAlertType("success");
        showMessage(result.message || "Email has been sent successfully");
      } else {
        showAlert("error");
        showMessage(result.message || "Failed to send email");
      }
    } catch (error) {
      setAlertType("error");
      showMessage("Something went wrong");
    }
  };

  const handleCurrentPasswordValidation = (e) => {
    const pass = e.target.value;
    setCurrentPassword(pass);
    if (pass.length > 0) {
      validPassword.current = true;
    } else {
      validPassword.current = false;
    }
  };

  const handleNewPasswordValidation = (e) => {
    const pass = e.target.value;
    setNewPassword(pass);
    if (passRegex.test(pass)) {
      console.log("Valid password");
      validNewPassword.current = true;
    } else {
      validNewPassword.current = false;
    }
  };

  const handleConfirmPasswordValidation = (e) => {
    const confirmPass = e.target.value;
    setConfirmNewPassword(confirmPass);
    if (confirmPass === newPassword) {
      console.log("Matching passwords");
      validMatchPassword.current = true;
    } else {
      validMatchPassword.current = false;
    }
  };

  const handleEmailValidation = (e) => {
    const email = e.target.value;
    setNewEmail(email);
    if (emailRegex.test(email)) {
      validEmail.current = true;
    } else {
      validEmail.current = false;
    }
  };

  const handleVerifyPassword = (e) => {
    const verifyPass = e.target.value;
    setVerifyEmailPassword(verifyPass);
    if (verifyPass.length > 0) {
      validVerifyPassword.current = true;
    } else {
      validVerifyPassword.current = false;
    }
  };

  const securityRef = useRef(null);
  const accountRef = useRef(null);

  const scrollToSection = (ref) => {
    console.log("Clicked!");
    console.log(ref.current);
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
        <aside className="settings-sidebar">
          <div>
            <h3 className="sidebar-label">Settings</h3>
            <nav className="sidebar-nav">
              <button
                onClick={() => scrollToSection(accountRef)}
                className="menu-btn"
              >
                <FaUser className="icon" />
                Account
              </button>
              <button
                onClick={() => scrollToSection(securityRef)}
                className="menu-btn"
              >
                <FaLock className="icon" />
                Security
              </button>
            </nav>
          </div>
        </aside>
        <main className="settings-main">
          <section className="settings-section" ref={accountRef}>
            <div className="settings-inner">
              <h2 className="settings-header">Account</h2>
              <div className="user-card">
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
                  <button className="submit-btn" onClick={handleFileUpload}>
                    <FaRegSave className="icon" /> Save Avatar
                  </button>
                  {errMessage && <p className="error-message">{errMessage}</p>}
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
            </div>
          </section>

          <section className="settings-section" ref={securityRef}>
            <div className="settings-inner">
              <h2 className="settings-header">Security</h2>
              <div className="security-card">
                <label>Username</label>
                <p className="info-text">
                  4-26 characters, letters and numbers only
                </p>
                <input
                  type="text"
                  className="input"
                  placeholder="Username"
                  value={newUsername}
                  onChange={(e) => handleUsernameValidation(e)}
                />
                <button
                  className={`submit-btn ${validUsername.current ? "" : "disabled"}`}
                  onClick={handleUpdateUsername}
                >
                  <LuUserPen className="icon" />
                  Update Username
                </button>
                <hr></hr>
                <label>Current Password</label>
                <p className="info-text">
                  Please enter your current password to prove your identity
                </p>
                <input
                  type="password"
                  className="input"
                  value={currentPassword}
                  onChange={(e) => handleCurrentPasswordValidation(e)}
                />
                <label>New Password</label>
                <p className="info-text">
                  At least 8 characters, an uppercase letter, lowercase letter,
                  number, and symbol
                </p>
                <input
                  type="password"
                  className="input"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => handleNewPasswordValidation(e)}
                />
                <label>Confirm New Password</label>
                <p className="info-text">Please re-enter your new password</p>
                <input
                  type="password"
                  className="input"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => handleConfirmPasswordValidation(e)}
                />
                <button
                  className={`submit-btn ${validMatchPassword.current && validPassword.current && validNewPassword.current ? "" : "disabled"}`}
                  onClick={handleUpdatePassword}
                >
                  <FaKey className="icon" />
                  Update Password
                </button>
                <hr></hr>
                <label>Update Email Address</label>
                {!user.isVerified && (
                  <div className="warning">
                    <span>Your email has not been verified</span>
                    <button className="warning-btn" onClick={handleSendEmail}>
                      Send verification email
                    </button>
                  </div>
                )}
                <label>New Email Address</label>
                <p className="info-text">Please enter your new email address</p>
                <input
                  type="email"
                  className="input"
                  placeholder="Email Address"
                  onChange={(e) => handleEmailValidation(e)}
                />
                <label>Verify Password</label>
                <p className="info-text">
                  Please enter your password to prove your identity
                </p>
                <input
                  type="password"
                  placeholder="Password"
                  className="input"
                  onChange={(e) => handleVerifyPassword(e)}
                />
                <button
                  className={`submit-btn ${validEmail.current && validVerifyPassword.current ? "" : "disabled"}`}
                  onClick={handleUpdateEmail}
                >
                  <MdEmail className="icon" />
                  Update Email Address
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
      <div>
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
      </div>
    </>
  );
}

export default Profile;
