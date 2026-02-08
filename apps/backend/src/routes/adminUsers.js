import express from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
} from "../controllers/adminUsersController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";


const router = express.Router();

// Apply middleware to all admin routes
router.use(authenticate, isAdmin);

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
// adminuser.js
router.post("/:id/reset-password", resetUserPassword); // remove /users


export default router;
