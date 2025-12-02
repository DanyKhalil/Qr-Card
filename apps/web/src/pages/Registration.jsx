import '../Style/Login.css';
import backround from "../assets/images/icons/Background2.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { IoPerson, IoMail, IoLockClosed } from "react-icons/io5";

const TitleLogin = ({ onLoginClick }) => (
  <div className="tab-container">
    <h1 className="tab-inactive" onClick={onLoginClick}>Login</h1>
    <h1 className="tab-active">Sign up</h1>
  </div>
);

const Image = () => (
  <div className="image-container">
    <img src={backround} alt="Background" className="form-image" />
  </div>
);

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      
      if (token && user) {
        // User is logged in, redirect to filtering
        navigate('/Filtering');
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleContinueWithoutAccount = () => {
    navigate('/Filtering');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // Clear any previous password error
    setPasswordError("");

    try {
      await axios.post("http://localhost:5050/api/auth/register", {
        name,
        email,
        password,
        role: "client"
      });

      setMessage("Registration successful! Please check your email to verify your account.");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="page-container">
        <div className="content-wrapper">
          <div className="form-section">
            <p>Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <Image />
        
        <div className="form-section">
          <TitleLogin onLoginClick={handleLoginClick} />

          <form className="form-container" onSubmit={handleSubmit}>
            {/* Name field with icon */}
            <div className="input-with-icon">
              <IoPerson className="input-icon" />
              <input
                className="form-input with-icon"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email field with icon */}
            <div className="input-with-icon">
              <IoMail className="input-icon" />
              <input
                className="form-input with-icon"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password field with icon */}
            <div className="input-with-icon">
              <IoLockClosed className="input-icon" />
              <input
                className="form-input with-icon"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password field with icon */}
            <div className="input-with-icon">
              <IoLockClosed className="input-icon" />
              <input
                className="form-input with-icon"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {passwordError && (
              <p className="error-message">{passwordError}</p>
            )}

            {/* Buttons Container */}
            <div className="buttons-container" style={{marginTop: '50px'}}>
              <button className="signup-button" type="submit">
                Sign up
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

          <p className={message.includes("successful") ? "success-message" : "error-message"}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;