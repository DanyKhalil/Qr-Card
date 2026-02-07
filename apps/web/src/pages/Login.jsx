import '../Style/Login.css';
import backround from '../assets/images/icons/man-woman-qr.png';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { IoMail, IoLockClosed } from "react-icons/io5";
import ForgotPasswordModal from './ForgotPasswordModal'; // ADD THIS IMPORT

const TitleLogin = ({ onSignUpClick }) => (
  <div className="tab-container">
    <h1 className="tab-active">Login</h1>
    <h1 className="tab-inactive" onClick={onSignUpClick}>Sign up</h1>
  </div>
);

const Image = () => (
  <div className='image-container'>
    <img 
      src={backround}
      alt="Example"
      className="form-image"
    />
  </div>
);

const Form = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // ADD THIS STATE
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      if (token && user) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/auth/profile/${localStorage.getItem("profileId")}/subscription`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          localStorage.setItem("user", JSON.stringify(response.data.user));
          if (response.data.subscription) {
            localStorage.setItem("subscription", JSON.stringify(response.data.subscription));
          }
          
          if (response.data.user.role === "admin") {
            navigate('/admin');
          } else {
            navigate('/profile');
          }
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("subscription");
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSignUpClick = () => {
    navigate('/registration');
  };

  const handleContinueWithoutAccount = () => {
    navigate('/scan-qr-code');
  };

  // ADD THIS FUNCTION
  const handleForgotPasswordClick = (currentEmail) => {
    if (!currentEmail) {
      setError("Please enter your email first");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setShowForgotPassword(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const loginRes = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));
      localStorage.setItem("profileId", loginRes.data.user.profile_id);
      
      try {
        const userRes = await axios.get(`${API_BASE_URL}/api/auth/profile/${loginRes.data.user.profile_id}/subscription`, {
          headers: { Authorization: `Bearer ${loginRes.data.token}` }
        });

        localStorage.setItem("user", JSON.stringify(userRes.data.user));
        if (userRes.data.subscription) {
          localStorage.setItem("subscription", JSON.stringify(userRes.data.subscription));
        }

        if (userRes.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }

      } catch (userError) {
        console.error("Error fetching user data:", userError);
        if (loginRes.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }

    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isChecking) {
    return (
      <div className='page-container'>
        <div className='content-wrapper'>
          <div className="form-section">
            <p>Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='page-container'>
        <div className='content-wrapper'>
          <div className="form-section">
            <TitleLogin onSignUpClick={handleSignUpClick} />

            <form className='form-container' onSubmit={handleLogin}>
              {error && <p className="error-message">{error}</p>}

              <div className="input-with-icon">
                <IoMail className="input-icon" />
                <input 
                  className='form-input with-icon'
                  type='text'
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-with-icon">
                <IoLockClosed className="input-icon" />
                <input
                  className='form-input with-icon'
                  type='password'
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* UPDATED FORGOT PASSWORD LINK */}
              <div className="forgot-password-link">
                <span 
                  onClick={() => handleForgotPasswordClick(email)}
                  className={email ? "clickable" : "disabled"}
                >
                  Forgot Password?
                </span>
              </div>

              <div className="buttons-container">
                <button 
                  className="login-button" 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <span className="spinner"></span> : "Login"}
                </button>

                <button 
                  className="continue-button"
                  onClick={handleContinueWithoutAccount}
                  type="button"
                >
                  Continue without account
                </button>
              </div>
            </form>
          </div>

          <Image />
        </div>
      </div>

      {/* ADD THE MODAL */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        userEmail={email}
      />
    </>
  );
};

export default Form;