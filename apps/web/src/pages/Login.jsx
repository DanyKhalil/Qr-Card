import '../Style/Login.css';
import backround from '../assets/images/icons/man-woman-qr.png';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { IoMail, IoLockClosed } from "react-icons/io5";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);
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

  const handleSignUpClick = () => {
    navigate('/registration');
  };

  const handleContinueWithoutAccount = () => {
    navigate('/Filtering');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5050/api/auth/login", {
        email,
        password,
      });

      // save token + user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }

    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  // Show loading while checking authentication
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

            {/* Buttons Container */}
            <div className="buttons-container">
              <button className="login-button" type='submit'>
                Login
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
  );
};

export default Form;