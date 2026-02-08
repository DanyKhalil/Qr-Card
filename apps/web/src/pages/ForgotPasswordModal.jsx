// ForgotPasswordModal.jsx
import { useState } from 'react';
import { IoClose, IoMail } from "react-icons/io5";

const ForgotPasswordModal = ({ isOpen, onClose, userEmail }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState(userEmail || '');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter email, 2: Confirmation

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (data.success) {
        setStep(2); // Move to confirmation step
        setMessage('');
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage('Error sending reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClose = () => {
    setStep(1);
    setEmail(userEmail || '');
    setMessage('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{step === 1 ? 'Reset Password' : 'Check Your Email'}</h2>
          <IoClose className="close-icon" onClick={handleClose} />
        </div>

        {step === 1 ? (
          <>
            <p className="modal-description">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="input-with-icon">
                <IoMail className="input-icon" />
                <input
                  className='form-input with-icon'
                  type='email'
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {message && (
                <p className={`modal-message ${message.includes('Error') ? 'error' : 'info'}`}>
                  {message}
                </p>
              )}

              <div className="modal-buttons">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit"
                  disabled={!email || isLoading || !isValidEmail(email)}
                >
                  {isLoading ? (
                    <span className="spinner"></span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="confirmation-content">
              <div className="email-icon">
                <IoMail size={48} color="#6B63FF" />
              </div>
              
              <h3>Email Sent!</h3>
              
              <p className="confirmation-text">
                We've sent a password reset link to:
              </p>
              
              <p className="user-email-display">
                {email}
              </p>
              
              <div className="instructions">
                <p><strong>Instructions:</strong></p>
                <ol>
                  <li>Check your email inbox</li>
                  <li>Click the "Reset Password" link in the email</li>
                  <li>Follow the instructions to create a new password</li>
                </ol>
              </div>
              
              <p className="note">
                <strong>Note:</strong> The link will expire in 1 hour.
              </p>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="modal-submit"
                  onClick={handleClose}
                >
                  Got it, thanks!
                </button>
              </div>

              <p className="resend-text">
                Didn't receive the email? 
                <span 
                  className="resend-link"
                  onClick={() => setStep(1)}
                >
                  Try again
                </span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;