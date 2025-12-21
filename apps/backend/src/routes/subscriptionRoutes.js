// routes/subscriptionRoutes.js
import express from "express";
import { 
  getCurrentSubscription, 
  getAvailablePlans, 
  subscribeToPlan, 
  cancelSubscription,
  getAllPayments,
  updatePaymentStatus,
  getPaymentStats
} from "../controllers/subscriptionController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";
import { uploadUserMedia } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ==================== User Routes ====================
// GET /subscription/current - get current user's subscription
router.get("/current", authenticate, getCurrentSubscription);

// GET /subscription/plans - get all available subscription plans
router.get("/plans", authenticate, getAvailablePlans);

// POST /subscription/subscribe - subscribe to a plan with receipt upload
router.post("/subscribe", authenticate, uploadUserMedia, subscribeToPlan);

// POST /subscription/cancel - cancel current subscription
router.post("/cancel", authenticate, cancelSubscription);

// ==================== Admin Routes ====================
// GET /subscription/payments - get all payments (admin only)
router.get("/payments", authenticate, isAdmin, getAllPayments);

// GET /subscription/payments/stats - get payment statistics (admin only)
router.get("/payments/stats", authenticate, isAdmin, getPaymentStats);

// PATCH /subscription/payments/:paymentId - update payment status (admin only)
router.patch("/payments/:paymentId", authenticate, isAdmin, updatePaymentStatus);

export default router;
