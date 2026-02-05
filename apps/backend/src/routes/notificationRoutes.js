import express from "express";
import { 
  createNotification, 
  getUserNotifications,
  markAllNotificationsAsRead,
  markAllNotificationsAsSeen,
  getUnreadNotificationCount,
} from "../controllers/notificationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /notifications - create a notification
router.post("/", authenticate, createNotification);

// GET /notifications - get user's notifications
router.get("/", authenticate, getUserNotifications);

// PUT /notifications/mark-all-read - mark all notifications as read
router.put("/mark-all-read", authenticate, markAllNotificationsAsRead); 

// PUT /notifications/mark-all-seen - mark all notifications as seen
router.put("/mark-all-seen", authenticate, markAllNotificationsAsSeen); 

// GET /notifications/unread-count - get unread notifications count
router.get("/unread-count", authenticate, getUnreadNotificationCount);


export default router;