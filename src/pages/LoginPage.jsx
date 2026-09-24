import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import "../css/LoginPage.css";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        console.log("Login Successful!");
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
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
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
        <input type="submit" id="login-btn" value="Submit" />
        <p>
          Need to create an account? <Link to="/signup">Sign up here!</Link>
        </p>
        <p>Want to go home page? <Link to="/">Home</Link></p>
      </form>
    </>
  );
}

export default LoginPage;
