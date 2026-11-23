import "../css/SignupPage.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAuth } from "../context/AuthContext";
import Header from "../components/components";

function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validLength, setValidLength] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasUppercase, setHasUpperCase] = useState(false);
  const [hasDigit, setHasDigit] = useState(false);
  const [hasSymbol, setHasSymbol] = useState(false);

  const handleChecklistUpdate = (e) => {
    const livePassword = e.target.value;
    if (livePassword.trim().length >= 8) {
      setValidLength(true);
    } else {
      setValidLength(false);
    }

    if (/[a-z]/.test(livePassword)) {
      setHasLowercase(true);
    } else {
      setHasLowercase(false);
    }

    if (/[A-Z]/.test(livePassword)) {
      setHasUpperCase(true);
    } else {
      setHasUpperCase(false);
    }

    if (/[\d]/.test(livePassword)) {
      setHasDigit(true);
    } else {
      setHasDigit(false);
    }

    if (/[\W]/.test(livePassword)) {
      setHasSymbol(true);
    } else {
      setHasSymbol(false);
    }
  };

  const showError = (message) => {
    setErrorMessage(message);
    setOpen(true);
  };

  const handleClose = (e, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        // result.user is { username, email } from the server
        login(result.token, result.user);
      } else {
        showError(
          result.message || "There was an error with creating your account",
        );
      }
    } catch (error) {
      console.error("Failed to connect to server", error);
      showError("Could not connect to the server. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h1>Sign Up</h1>
        {/* Username Field */}
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input"
            {...register("username", {
              required: "Username is required",
              pattern: {
                value: /^[a-zA-Z0-9]+$/,
                message: "Only letters and numbers are allowed"
              },
              minLength: {
                value: 4,
                message: "Username must be at least 4 characters long",
              },
              maxLength: {
                value: 26,
                message: "Username cannot exceed 26 characters",
              },
            })}
          />
          {errors.username && (
            <span className="error-message">{errors.username.message}</span>
          )}
        </div>

        {/* Email Field */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Email is invalid",
              },
            })}
          />
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>

        {/* Password Field */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            {...register("password", {
              required: "Password is required",
              onChange: (e) => handleChecklistUpdate(e),
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
          />
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="input"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value) =>
                value === document.getElementsByName("password")[0].value ||
                "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <span className="error-message">
              {errors.confirmPassword.message}
            </span>
          )}
          <div className="checklist-container">
          <ul className="checklist">
            <li className={validLength ? "valid" : ""}>
              Password is at least 8 characters long
            </li>

            <li className={hasLowercase ? "valid" : ""}>
              Password contains a lowercase character
            </li>
            <li className={hasUppercase ? "valid" : ""}>
              Password contains a uppercase character
            </li>
            <li className={hasDigit ? "valid" : ""}>
              Password contains a number
            </li>
            <li className={hasSymbol ? "valid" : ""}>
              Password contains a symbol
            </li>
          </ul>
          </div>
        </div>

        <input type="submit" value="Sign Up" className="submit-btn" />
        <p>
          Already have an account? <Link to="/login">Login here!</Link>
        </p>
      </form>
      <div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}

export default SignupPage;
