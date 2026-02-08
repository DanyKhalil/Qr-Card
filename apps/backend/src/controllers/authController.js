import { User, Profile, UserSubscription, SubscriptionPlan } from '../models/index.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/sendEmail.js";

import crypto from 'crypto';
import { sendPasswordResetEmail } from "../utils/sendEmail.js"; 


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{
        model: Profile,
        as: 'profiles', // updated association
        attributes: ['id'], // get only IDs
        order: [['created_at', 'ASC']] // get oldest profile first
      }]
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.verified) {
      return res.status(403).json({ error: "Please verify your email before logging in." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // pick the first profile ID if multiple exist
    const firstProfileId = user.profiles?.length > 0 ? user.profiles[0].id : null;

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile_id: firstProfileId
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (verified=false initially)
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      verified: false
    });

    // ✅ Automatically create a Profile linked to this user
    await Profile.create({
      name: name,
      user_id: newUser.id,
      profile_pic_url: null,
      cover_pic_url: null,
      bio: "",
      headline: "",
      website: ""
    });

    // Create verification token
    const verifyToken = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "1h" });

    // Send verification email
    await sendVerificationEmail(email, verifyToken);

    res.status(201).json({
      message: "Registration successful. Check your email to verify your account."
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
};




// Add this to your authController.js
export const getCurrentUserWithSubscription = async (req, res) => {
  try {
    const { profileId } = req.params;

    if (!profileId) {
      return res.status(400).json({ error: "Profile ID is required" });
    }

    // Get profile with user
    const profile = await Profile.findOne({
      where: { id: profileId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "role", "verified", "is_active"]
        }
      ]
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // Get latest subscription for this profile
    const subscription = await UserSubscription.findOne({
      where: { profile_id: profileId },
      include: [
        {
          model: SubscriptionPlan,
          as: "plan",
          attributes: ["id", "name", "price", "currency", "billing_interval"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    // Format subscription data
    let subscriptionData = null;
    if (subscription) {
      subscriptionData = {
        plan_name: subscription.plan?.name || null,
        starts_at: subscription.start_date,
        expires_at: subscription.end_date,
        status: subscription.status,
        is_active:
          subscription.status === "active" &&
          (!subscription.end_date || new Date(subscription.end_date) > new Date())
      };
    }

    res.json({
      user: {
        id: profile.user.id,
        email: profile.user.email,
        role: profile.user.role,
        verified: profile.user.verified,
        is_active: profile.user.is_active,
        name: profile.name, // ✅ name comes from Profile
        profile_pic_url: profile.profile_pic_url
      },
      subscription: subscriptionData
    });

  } catch (error) {
    console.error("Error getting profile with subscription:", error);
    res.status(500).json({ error: "Server error" });
  }
};





























































// Reset Password

// ===========================================
// PASSWORD RESET FUNCTIONS
// ===========================================

/**
 * 1. Request password reset (forgot password)
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Find user by email
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email']
    });

    // Security: Return same response whether user exists or not
    const responseMessage = "If an account exists with this email, you will receive a password reset link.";

    if (!user) {
      return res.status(200).json({
        success: true,
        message: responseMessage
      });
    }

    // 2. Generate reset token and send email
    const resetData = await sendPasswordResetEmail(email, user.id);

    // 3. Save the hashed token and expiration to the database
    await User.update(
      {
        reset_password_token: resetData.resetTokenHash,
        reset_password_expires: new Date(resetData.resetTokenExpires)
      },
      {
        where: { id: user.id }
      }
    );

    res.status(200).json({
      success: true,
      message: responseMessage
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};

/**
 * 2. Helper function to validate reset token
 */
const validateResetToken = async (userId, token) => {
  try {
    // Get user with reset token
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'reset_password_token', 'reset_password_expires']
    });

    if (!user || !user.reset_password_token || !user.reset_password_expires) {
      return { valid: false, user: null };
    }

    // Check if token has expired
    const now = new Date();
    const expiresDate = new Date(user.reset_password_expires);

    if (now > expiresDate) {
      // Clean up expired token
      await User.update(
        {
          reset_password_token: null,
          reset_password_expires: null
        },
        {
          where: { id: userId }
        }
      );
      return { valid: false, user: null };
    }

    // Hash the incoming token to compare with stored hash
    const incomingTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Compare hashes
    const isValid = crypto.timingSafeEqual(
      Buffer.from(incomingTokenHash),
      Buffer.from(user.reset_password_token)
    );

    return { valid: isValid, user };

  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false, user: null };
  }
};

/**
 * 3. Verify reset token (when user clicks the link)
 * This endpoint checks if the token is valid before showing the reset form
 */
export const verifyResetToken = async (req, res) => {
  try {
    const { token, userId } = req.query;

    if (!token || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing token or user ID"
      });
    }

    // Validate token
    const { valid } = await validateResetToken(userId, token);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token. Please request a new password reset."
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid"
    });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
};

/**
 * 4. Reset password (after token verification)
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, userId, newPassword } = req.body;

    if (!token || !userId || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Validate token
    const { valid } = await validateResetToken(userId, token);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token. Please request a new password reset."
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await User.update(
      {
        password: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null
      },
      {
        where: { id: userId }
      }
    );

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now login with your new password."
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again."
    });
  }
};