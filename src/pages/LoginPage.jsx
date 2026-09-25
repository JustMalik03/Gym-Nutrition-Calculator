import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useState } from "react";

import "../css/LoginPage.css";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const naviagte = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClose = (e, reason) => {
    if (reason === "clickaway"){ 
      return
    }
    setOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setOpen(true);

      if (res.ok) {
        console.log("Login Successful!");
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            This is a success Alert inside a Snackbar!
          </Alert>
        </Snackbar>;
        naviagte("/dashboard");
      } else {
        console.log("Invalid credentials");
      }
    } catch (error) {
      console.log("Something went wrong.");
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <input type="submit" id="login-btn" value="Submit" />
        <p>
          Need to create an account? <Link to="/signup">Sign up here!</Link>
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
            Invalid credentials
          </Alert>
        </Snackbar>;
      </div>
    </>
  );
}

export default LoginPage;
