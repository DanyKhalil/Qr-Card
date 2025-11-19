import { User, Profile } from "../models/index.js";
import bcrypt from "bcrypt";
import { Op, fn, col, where } from "sequelize";
import jwt from "jsonwebtoken";

// GET all users
export const getAllUsers = async (req, res) => {
  const search = req.query.search || "";

  try {
    const users = await User.findAll({
      where: search
        ? {
            [Op.or]: [
              where(fn("LOWER", col("name")), {
                [Op.like]: `%${search.toLowerCase()}%`,
              }),
              where(fn("LOWER", col("role")), {
                [Op.like]: `%${search.toLowerCase()}%`,
              }),
            ],
          }
        : {},
      attributes: ["id", "name", "email", "role", "verified"],
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: ["profile_pic_url", "cover_pic_url", "bio", "headline", "website"],
        },
      ],
      order: [["name", "ASC"]],
    });

    res.json(users);
  } catch (error) {
    console.error("GET /api/users error:", error);
    res.status(500).json({ error: "Server error" });
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
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      verified: true, // Admin-created users are automatically verified
    });

    // ✅ Automatically create a Profile for the new user with default values
    await Profile.create({
      user_id: newUser.id,
      profile_pic_url: null,
      cover_pic_url: null,
      bio: "",
      headline: "",
      website: ""
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("POST /api/users error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update user
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role, verified } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");

    if (decoded.id === user.id) return res.status(403).json({ error: "You cannot update yourself" });
    if (user.role === "admin") return res.status(403).json({ error: "You cannot update another admin" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    if (verified !== undefined) user.verified = verified;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("PUT /api/users/:id error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");

    if (decoded.id === user.id) return res.status(403).json({ error: "You cannot delete yourself" });
    if (user.role === "admin") return res.status(403).json({ error: "You cannot delete another admin" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/users/:id error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
