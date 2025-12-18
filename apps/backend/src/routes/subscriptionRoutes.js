// routes/subscriptionRoutes.js
import express from "express";
import { 
  getCurrentSubscription, 
  getAvailablePlans, 
  subscribeToPlan, 
  cancelSubscription 
} from "../controllers/subscriptionController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { uploadUserMedia } from "../middleware/uploadMiddleware.js"; // import multer

const router = express.Router();

// GET /subscription/current - get current user's subscription
router.get("/current", authenticate, getCurrentSubscription);

// GET /subscription/plans - get all available subscription plans
router.get("/plans", authenticate, getAvailablePlans);

// POST /subscription/subscribe - subscribe to a plan with receipt upload
router.post("/subscribe", authenticate, uploadUserMedia, subscribeToPlan);

// POST /subscription/cancel - cancel current subscription
router.post("/cancel", authenticate, cancelSubscription);

export default router;
