import { useState, useRef } from "react";
import { MdEmail } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { FaKey } from "react-icons/fa";
import Header from "../components/components";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ProfileSidebar from "../components/ProfileSidebar";

function ProfileSecurity() {
  const { user, updateUser } = useAuth();
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[A-Za-z\d\W]{8,}$/;

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [verifyEmailPassword, setVerifyEmailPassword] = useState("");

  const validMatchPassword = useRef(false);
  const validEmail = useRef(false);
  const validPassword = useRef(false);
  const validNewPassword = useRef(false);

  const validVerifyPassword = useRef(false);

  const email = user.email;

  const showMessage = (message) => {
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (e, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
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
        updateUser({
          ...user,
          isVerified: result.user.isVerified,
          email: result.user.email,
        });
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
      if (res.ok) {
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

  const handleVerifyPassword = (e) => {
    const verifyPass = e.target.value;
    setVerifyEmailPassword(verifyPass);
    if (verifyPass.length > 0) {
      validVerifyPassword.current = true;
    } else {
      validVerifyPassword.current = false;
    }
  };

  return (
    <>
      <Header />
      <div className="layout">
        <ProfileSidebar/>
        <main className="settings-main">
        <section className="settings-section">
          <div className="settings-inner">
            <h2 className="settings-header">Security</h2>
            <div className="security-card">
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

export default ProfileSecurity;
