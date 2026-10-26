import { useForm } from "react-hook-form";
import { FcInfo } from "react-icons/fc";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Header from "../components/components";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [success, setSuccess] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const onSubmit = async (data) => {
    data.id = id;
    data.token = token;
    try {
      const res = await fetch("/api/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
        console.log("Password updated successfully");
      } else {
        console.log("Failed to update password");
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  return (
    <>
      <Header />
      {!success ? (
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <div id="reset-info" className="reset-container">
            <FcInfo />
            <h3>Reset Password</h3>
          </div>
          {/* Password Field */}
          <div>
            <input
              type="password"
              name="password"
              className="input"
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
              className="input"
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
          <div className="submit-container">
            <button type="submit" id="continue-btn">
              Reset Password
            </button>
          </div>
        </form>
      ) : (
        <div className="form-container">
          <div id="check-container">
            <IoMdCheckmarkCircleOutline class="check-icon" size="5em" />
          </div>
          <div id="success-info">
            <p>
              Your password has been successfully updated, you can now close this page.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default ResetPassword;
