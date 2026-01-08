import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying email...");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/verify-email/${token}`);
        setMessage(res.data.message);

        // Redirect after 2 seconds
        setTimeout(() => navigate("/login"), 2000);

      } catch (err) {
        setMessage(err.response?.data?.error || "Verification failed");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      <h2>{message}</h2>
      <p>You will be redirected shortly...</p>
    </div>
  );
};

export default VerifyEmail;
