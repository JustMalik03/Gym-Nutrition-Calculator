import "../css/SignupPage.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (message) => {
    setErrorMessage(message);
    setOpen(true);
  };

  const handleClose = (e, reason) => {
    if(reason === "clickaway") return;
    setOpen(false);
  }

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
        showError(result.message || "There was an error with creating your account");
      }
    } catch (error) {
      console.error("Failed to connect to server", error);
      showError("Could not connect to the server. Please try again.");
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username Field */}
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            {...register("username", {
              required: "Username is required",
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
            {...register("password", {
              required: "Password is required",
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
        </div>

        <input type="submit" value="Sign Up" />
        <p>
          Already have an account? <Link to="/login">Login here!</Link>
        </p>
        <p>
          Want to go home page? <Link to="/">Home</Link>
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
