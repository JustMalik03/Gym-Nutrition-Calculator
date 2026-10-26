import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/components";

import "../css/LoginPage.css";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/login", {
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
        navigate("/dashboard");
      } else {
        console.log("Invalid credentials");
      }
    } catch (error) {
      console.log("Something went wrong.");
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h1>Login</h1>
        <input
          type="email"
          name="email"
          className="input"
          placeholder="Email Address"
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
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
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
        <input type="submit" className="submit-btn" value="Login" />
        <div id="redirect-links">
          <Link to="/passwords/reset">Forgot Password?</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </form>
    </>
  );
}

export default LoginPage;
