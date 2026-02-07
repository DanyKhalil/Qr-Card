import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Existing verification email function
export const sendVerificationEmail = async (email, token) => {
  const verifyURL = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"QR Cardify" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyURL}">${verifyURL}</a>
      <p>This link expires in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};







/**
 * Send a password reset email with a secure, time-limited token
 * @param {string} email - User's email address
 * @param {string} userId - User's unique identifier (from database)
 * @returns {Object} - Contains the reset token for database storage
 */
export const sendPasswordResetEmail = async (email, userId) => {
  try {
    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Create a hash of the token to store in database (never store plain token)
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set expiration time (e.g., 1 hour from now)
    const resetTokenExpires = Date.now() + 3600000; // 1 hour in milliseconds
    
    // Create reset URL with both userId and token
    // The client will need to send both to the server for validation
    const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&id=${userId}`;
    
    const mailOptions = {
      from: `"QR Cardify" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You recently requested to reset your password for your QR Cardify account.</p>
          <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; font-weight: bold;">
              Reset Your Password
            </a>
          </div>
          
          <p>Or copy and paste this URL into your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; 
                    word-break: break-all;">
            ${resetURL}
          </p>
          
          <p><strong>Important Security Notes:</strong></p>
          <ul>
            <li>If you didn't request this password reset, please ignore this email.</li>
            <li>Your password will not change until you create a new one.</li>
            <li>For security reasons, this link will expire in 1 hour.</li>
          </ul>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `,
      text: `Password Reset Request\n\n
You recently requested to reset your password for your QR Cardify account.\n
Reset your password here: ${resetURL}\n
This link is valid for 1 hour.\n\n
If you didn't request this password reset, please ignore this email.\n
Your password will not change until you create a new one.\n\n
This is an automated message, please do not reply to this email.`
    };

    await transporter.sendMail(mailOptions);
    
    // Return the hashed token and expiration for database storage
    return {
      resetTokenHash,
      resetTokenExpires,
      resetToken // Return plain token only for URL creation (client will receive via email)
    };
    
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

/**
 * Helper function to validate a password reset token
 * Use this in your password reset verification endpoint
 * @param {string} userTokenHash - Hash stored in database for the user
 * @param {string} userTokenExpires - Expiration timestamp from database
 * @param {string} incomingToken - Token received from the client
 * @returns {boolean} - Whether the token is valid
 */
export const validateResetToken = (userTokenHash, userTokenExpires, incomingToken) => {
  try {
    // Check if token has expired
    if (Date.now() > userTokenExpires) {
      return false;
    }
    
    // Hash the incoming token to compare with stored hash
    const incomingTokenHash = crypto
      .createHash('sha256')
      .update(incomingToken)
      .digest('hex');
    
    // Compare hashes (timing-safe comparison)
    return crypto.timingSafeEqual(
      Buffer.from(incomingTokenHash),
      Buffer.from(userTokenHash)
    );
    
  } catch (error) {
    console.error("Error validating reset token:", error);
    return false;
  }
};