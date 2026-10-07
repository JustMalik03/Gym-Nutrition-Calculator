import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { postRequest } from "../../utils/service";
import { Alert, CircularProgress } from "@mui/material";

const VerifyEmail = () => {
  const { user, login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const emailToken = searchParams.get("emailToken");
  console.log(user);
  console.log("email token", emailToken)

  useEffect(() => {
    console.log("Checking email verification status...");
    const verify = async () => {
      if (user?.isVerified) {
        // Already verified: go home after 3 seconds
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      if (!emailToken) return;

      setIsLoading(true);

      const res = await postRequest("/api/verify-email", JSON.stringify({ emailToken }));
      setIsLoading(false);

      if (res.error) {
        return setError(res);
      }

      // Server sends { token, user }, log them in with their verified info
      login(res.token, res.user);
    };

    verify();
  }, [emailToken, user]);


  return (
    <div>
      {isLoading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
        <div>
          {user?.isVerified ? (
            <div>
              <Alert severity="success">
                Email successfully verified, redirecting...
              </Alert>
            </div>
          ) : (
            <div>
              {error.error ? <Alert severity="error">{error.message}</Alert> : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
