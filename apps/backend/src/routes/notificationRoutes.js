import express from "express";
import { 
  createNotification, 
  getUserNotifications,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /notifications - create a notification
router.post("/", authenticate, createNotification);

// GET /notifications - get user's notifications
router.get("/", authenticate, getUserNotifications);

// PUT /notifications/mark-all-read - mark all notifications as read
router.put("/mark-all-read", authenticate, markAllNotificationsAsRead); 

export default router;