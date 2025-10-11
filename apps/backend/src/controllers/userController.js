import User from "../models/userModel.js";

// ---- To get all the users ----
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---- To create a new User ----
export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ---- To update a User ----
export const updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, { where: { id: req.params.id } });
    res.json({ updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---- To delete a User ----
export const deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};