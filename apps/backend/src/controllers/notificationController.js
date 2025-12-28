import { Notification, User, Profile } from "../models/index.js";

/**
 * Create a notification for a user
 * POST /notifications
 * body: { user_id, sender_id, type, title, message, metadata, action_url, action_label }
 */
export const createNotification = async (req, res) => {
  try {
    const {
      receiver_profile_id,
      sender_profile_id, // optional
      type,
      title,
      message,
      metadata,
      action_url,
      action_label
    } = req.body;

    const notification = await Notification.create({
      receiver_profile_id,
      sender_profile_id: sender_profile_id || null,
      type,
      title,
      message,
      metadata,
      action_url,
      action_label,
      is_read: false,
      is_sent: false,
      is_seen: false,
      created_at: new Date(),
    });

    res.status(201).json({
      message: "Notification created",
      notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get notifications for the logged-in user
 * GET /notifications
 */
export const getUserNotifications = async (req, res) => {
  try {
    const { profile_id } = req.query;

    if (!profile_id) {
      return res.status(400).json({ error: "profile_id is required" });
    }

    const notifications = await Notification.findAll({
      where: { receiver_profile_id: profile_id },
      order: [["created_at", "DESC"]],
      limit: 50,
      include: [
        {
          model: Profile,
          as: "senderProfile",
          attributes: ["id", "profile_pic_url", "user_id"], // <-- add user_id
        },
        {
          model: Profile,
          as: "receiverProfile",
          attributes: ["id", "user_id"], // <-- add user_id
        },
      ],
    });

    const formattedNotifications = notifications.map((notification) => ({
      id: notification.id,
      receiver_profile_id: notification.receiver_profile_id,
      sender_profile_id: notification.sender_profile_id,
      receiver_user_id: notification.receiverProfile?.user_id || null,
      sender_user_id: notification.senderProfile?.user_id || null,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      metadata: notification.metadata,
      is_read: notification.is_read,
      is_sent: notification.is_sent,
      is_seen: notification.is_seen,
      action_url: notification.action_url,
      action_label: notification.action_label,
      created_at: notification.created_at,
      read_at: notification.read_at,
      sent_at: notification.sent_at,
      seen_at: notification.seen_at,
      sender: notification.senderProfile
        ? {
            id: notification.senderProfile.id,
            profile_pic_url: notification.senderProfile.profile_pic_url,
            user_id: notification.senderProfile.user_id, // <-- include user_id
          }
        : null,
      receiver: notification.receiverProfile
        ? {
            id: notification.receiverProfile.id,
            user_id: notification.receiverProfile.user_id, // <-- include user_id
          }
        : null,
    }));

    res.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: error.message });
  }
};




export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { profile_id } = req.body;

    if (!profile_id) {
      return res.status(400).json({ error: "profile_id is required" });
    }

    const [updatedCount] = await Notification.update(
      {
        is_read: true,
        read_at: new Date(),
      },
      {
        where: {
          receiver_profile_id: profile_id,
          is_read: false,
        },
      }
    );

    res.json({
      message: `Marked ${updatedCount} notifications as read`,
      updated_count: updatedCount,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: error.message });
  }
};
