import { User, Profile } from "../models/index.js";
import { Op, fn, col, where } from "sequelize";

export const getAllUsers = async (req, res) => {
  const search = req.query.search || ""; // get ?search=...

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
        : {}, // no search term → return all users
      attributes: ["id", "name", "role", "verified"],
      include: [
        {
          model: Profile,
          as: "profile",
          attributes: ["profile_pic_url"],
        },
      ],
      order: [["name", "ASC"]],
    });

    res.json(users);
  } catch (error) {
    console.error("GET /api/users2 error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
