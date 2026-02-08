import express from "express";
import { 
  loginUser, 
  registerUser, 
  getCurrentUserWithSubscription,
  forgotPassword,
  verifyResetToken,
  resetPassword
} from "../controllers/authController.js";
import { verifyEmail } from "../controllers/verifyController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

// Protected route (requires authentication)
router.get("/profile/:profileId/subscription", authenticate, getCurrentUserWithSubscription);

export default router;