import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { postRequest } from "../../utils/service";
import { Alert, CircularProgress } from "@mui/material";

const VerifyEmail = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const emailToken = searchParams.get("emailToken");
  console.log(user);
  console.log("email token", emailToken)

  useEffect(() => {
    async () => {
      console.log("Looking at token...")
      if (user?.isVerified) {
        setTimeout(() => {
          return navigate("/");
        }, 3000);
      } else {
        if (emailToken) {
          setIsLoading(true);
          const res = await postRequest(
            "/api/verify-email",
            JSON.stringify(emailToken),
          );

          setIsLoading(false);
          console.log("response:", res);

          if (res.error) {
            return setError(res);
          }

          updateUser(res);
        }
      }
    };
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
