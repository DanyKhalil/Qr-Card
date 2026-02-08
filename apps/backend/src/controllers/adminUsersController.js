import { User, Profile } from "../models/index.js";
import bcrypt from "bcrypt";
import { Op, fn, col, where } from "sequelize";
import jwt from "jsonwebtoken";

// GET all profiles (ADMIN)
export const getAllUsers = async (req, res) => {
  const {
    search = "",
    role,
    verified,
    locked,
    sortBy = "joined_at",
    sortOrder = "DESC",
    page = 1,
    limit = 20,
  } = req.query;

  try {
    // =========================
    // PAGINATION SETUP
    // =========================
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // =========================
    // SEARCH (name / role / email)
    // =========================
    const searchWhere = search
      ? {
          [Op.or]: [
            where(fn("LOWER", col("Profile.name")), {
              [Op.like]: `%${search.toLowerCase()}%`,
            }),
            where(fn("LOWER", col("user.role")), {
              [Op.like]: `%${search.toLowerCase()}%`,
            }),
            where(fn("LOWER", col("user.email")), {
              [Op.like]: `%${search.toLowerCase()}%`,
            }),
          ],
        }
      : {};

    // =========================
    // USER FILTERS
    // =========================
    const userWhere = {};

    if (role) userWhere.role = role;

    if (verified !== undefined && verified !== '') {
      userWhere.verified = verified === "true";
    }

    if (locked !== undefined && locked !== '') {
      // locked = true → visibility = false
      userWhere.visibility = locked === "true" ? false : true;
    }

    // =========================
    // SORTING (SAFE MAP)
    // =========================
    const sortMap = {
      joined_at: ["created_at"], // Profile.created_at
      name: ["name"], // Profile.name
      role: [{ model: User, as: "user" }, "role"],
    };

    const order = sortMap[sortBy]
      ? [[...sortMap[sortBy], sortOrder]]
      : [["created_at", "DESC"]];

    // =========================
    // GET TOTAL COUNT
    // =========================
    const totalCount = await Profile.count({
      where: searchWhere,
      include: [
        {
          model: User,
          as: "user",
          where: userWhere,
        },
      ],
    });

    // =========================
    // QUERY WITH PAGINATION
    // =========================
    const profiles = await Profile.findAll({
      where: searchWhere,
      attributes: [
        "id",
        "name",
        "profile_pic_url",
        "cover_pic_url",
        "bio",
        "headline",
        "website",
        "created_at", // ✅ DATE JOINED (PROFILE)
      ],
      include: [
        {
          model: User,
          as: "user",
          where: userWhere,
          attributes: ["email", "role", "verified", "visibility"],
        },
      ],
      order,
      limit: limitNum,
      offset,
    });

    // =========================
    // RESPONSE SHAPE
    // =========================
    const result = profiles.map((p) => ({
      profile_id: p.id, // ✅ profile id only
      name: p.name,
      email: p.user.email,
      role: p.user.role,
      verified: p.user.verified,
      visibility: p.user.visibility,
      joined_at: p.created_at, // ✅ from PROFILE
      profile_pic_url: p.profile_pic_url,
      cover_pic_url: p.cover_pic_url,
      bio: p.bio,
      headline: p.headline,
      website: p.website,
    }));

    // =========================
    // PAGINATION METADATA
    // =========================
    const totalPages = Math.ceil(totalCount / limitNum);

    // =========================
    // RESPONSE WITH PAGINATION
    // =========================
    res.json({
      success: true,
      users: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
      filters: {
        search,
        role,
        verified,
        locked,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error("GET /api/users (profiles) error:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// POST new user (Admin)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      role,
      verified: true, // Admin-created users are automatically verified
    });

    // ✅ Automatically create a Profile for the new user with default values
    await Profile.create({
      user_id: newUser.id,
      name: name,
      profile_pic_url: null,
      cover_pic_url: null,
      bio: "",
      headline: "",
      website: "",
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("POST /api/users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update user
export const updateUser = async (req, res) => {
  try {
    const profileId = req.params.id;
    const { name, email, role, verified, visibility } = req.body; // Added visibility

    // 1️⃣ Find profile first
    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    // 2️⃣ Load user via profile
    const user = await User.findByPk(profile.user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY"
    );

    if (decoded.id === user.id) {
      return res
        .status(403)
        .json({ error: "You cannot update yourself" });
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ error: "You cannot update another admin" });
    }

    profile.name = name || profile.name;
    user.email = email || user.email;
    user.role = role || user.role;

    if (verified !== undefined) user.verified = verified;
    if (visibility !== undefined) user.visibility = visibility; // Added visibility update

    await user.save();
    await profile.save();

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("PUT /api/users/:id error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const profileId = req.params.id;

    const profile = await Profile.findByPk(profileId);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const user = await User.findByPk(profile.user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY"
    );

    if (decoded.id === user.id) {
      return res
        .status(403)
        .json({ error: "You cannot delete yourself" });
    }

    if (user.role === "admin") {
      return res
        .status(403)
        .json({ error: "You cannot delete another admin" });
    }

    // Check how many profiles this user has
    const profileCount = await Profile.count({
      where: { user_id: user.id },
    });

    // Always delete the profile
    await profile.destroy();

    // If this was the last profile, delete the user as well
    if (profileCount === 1) {
      await user.destroy();
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/users/:id error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const resetUserPassword = async (req, res) => {
  try {
    const profileId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    // 1️⃣ Find profile and user
    const profile = await Profile.findByPk(profileId);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const user = await User.findByPk(profile.user_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 2️⃣ Admin authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");

    if (decoded.id === user.id) {
      return res.status(403).json({ error: "You cannot reset your own password" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ error: "You cannot reset another admin's password" });
    }

    // 3️⃣ Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
};