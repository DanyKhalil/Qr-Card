import { User, Profile, UserSubscription, SubscriptionPlan } from '../models/index.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/sendEmail.js";

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

