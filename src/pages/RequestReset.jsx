import { useState } from "react";
import Header from "../components/components";
import "../css/RequestReset.css";
import { useForm } from "react-hook-form";
import { FcInfo } from "react-icons/fc";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

function RequestReset() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/requestReset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        console.log("Reset link sent successfully");
        setSuccess(true);
      } else {
        console.log("Something went wrong");
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
            <h3>Request Reset Link</h3>
          </div>

          <div className="reset-container">
            <p>
              Enter the email associated with your account and we will send you
              a code to reset your password.
            </p>
          </div>
          <input
            type="email"
            name="email"
            className="input"
            id="email-reset"
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
          <div className="submit-container">
            <button type="submit" id="continue-btn">
              Continue
            </button>
          </div>
        </form>
      ) : (
        <div className="form-container">
          <div id="check-container">
            <IoMdCheckmarkCircleOutline class="check-icon" size="5em"/>
          </div>
          <div id="success-info">
            <p>A reset link has successfully been sent to the requested email. Follow the instructions to reset your password</p>
          </div>
        </div>
      )}
    </>
  );
}

export default RequestReset;
