import express from "express";
import { 
  loginUser, 
  registerUser, 
  getCurrentUserWithSubscription 
} from "../controllers/authController.js";
import { verifyEmail } from "../controllers/verifyController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);

// Protected route (requires authentication)
router.get("/me", authenticate, getCurrentUserWithSubscription);

export default router;