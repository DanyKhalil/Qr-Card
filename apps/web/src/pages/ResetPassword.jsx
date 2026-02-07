// pages/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IoLockClosed, IoEyeOff, IoEye } from "react-icons/io5";
import '../Style/ResetPassword.css';

const ResetPassword = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  
  const token = searchParams.get('token');
  const userId = searchParams.get('id');

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !userId) {
        setMessage({ 
          text: 'Invalid reset link. Please request a new password reset.', 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/auth/verify-reset-token?token=${token}&userId=${userId}`
        );
        const data = await response.json();
        
        if (data.success) {
          setTokenValid(true);
          setMessage({ 
            text: 'Please enter your new password below.', 
            type: 'info' 
          });
        } else {
          setMessage({ 
            text: data.message || 'Invalid or expired reset token.', 
            type: 'error' 
          });
        }
      } catch (error) {
        setMessage({ 
          text: 'Error validating reset link. Please try again.', 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, userId]);

  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pass)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pass)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage({ 
        text: 'Passwords do not match.', 
        type: 'error' 
      });
      return;
    }
    
    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setMessage({ 
        text: passwordError, 
        type: 'error' 
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          userId, 
          newPassword: password 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ 
          text: data.message, 
          type: 'success' 
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage({ 
          text: data.message || 'Error resetting password.', 
          type: 'error' 
        });
      }
    } catch (error) {
      setMessage({ 
        text: 'Network error. Please check your connection and try again.', 
        type: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleRequestNewLink = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="loading-spinner"></div>
          <p>Validating reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>Reset Your Password</h1>
          <p className="subtitle">Create a new secure password for your account</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {!tokenValid ? (
          <div className="invalid-token-container">
            <div className="error-icon">⚠️</div>
            <h3>Reset Link Invalid</h3>
            <p>{message.text}</p>
            <p>This could be because:</p>
            <ul>
              <li>The link has expired (valid for 1 hour)</li>
              <li>The link has already been used</li>
              <li>The link is incorrect or malformed</li>
            </ul>
            <div className="action-buttons">
              <button 
                className="primary-button"
                onClick={handleRequestNewLink}
              >
                Request New Reset Link
              </button>
              <button 
                className="secondary-button"
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reset-form">
            <div className="input-group">
              <label htmlFor="password">New Password</label>
              <div className="password-input-wrapper">
                <IoLockClosed className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={submitting}
                  className="password-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
              <div className="password-requirements">
                <p><strong>Password must contain:</strong></p>
                <ul>
                  <li className={password.length >= 8 ? 'valid' : ''}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'valid' : ''}>
                    One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(password) ? 'valid' : ''}>
                    One lowercase letter
                  </li>
                  <li className={/[0-9]/.test(password) ? 'valid' : ''}>
                    One number
                  </li>
                </ul>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-input-wrapper">
                <IoLockClosed className="input-icon" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={submitting}
                  className="password-input"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                </button>
              </div>
              <div className={`password-match ${password && confirmPassword ? (password === confirmPassword ? 'match' : 'no-match') : ''}`}>
                {password && confirmPassword && (
                  <span>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={submitting || !password || !confirmPassword}
              >
                {submitting ? (
                  <>
                    <span className="button-spinner"></span>
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
              
              <button
                type="button"
                className="cancel-button"
                onClick={handleBackToLogin}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>

            <div className="security-note">
              <p><strong>Security Tips:</strong></p>
              <ul>
                <li>Use a unique password you haven't used elsewhere</li>
                <li>Avoid common words or personal information</li>
                <li>Consider using a password manager</li>
              </ul>
            </div>
          </form>
        )}

        <div className="footer-links">
          <p>
            Remember your password?{' '}
            <button 
              onClick={handleBackToLogin}
              className="text-link"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;