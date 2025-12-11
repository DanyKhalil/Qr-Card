import { Notification, User, Profile } from "../models/index.js";

/**
 * Create a notification for a user
 * POST /notifications
 * body: { user_id, sender_id, type, title, message, metadata, action_url, action_label }
 */
export const createNotification = async (req, res) => {
  try {
    const {
      user_id,
      sender_id,
      type,
      title,
      message,
      metadata,
      action_url,
      action_label
    } = req.body;

    // Create the notification
    const notification = await Notification.create({
      user_id,
      sender_id,
      type,
      title,
      message,
      metadata,
      action_url,
      action_label,
      is_read: false,
      is_sent: false,
      is_seen: false,
      created_at: new Date()
    });

    res.status(201).json({ 
      message: "Notification created", 
      notification 
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
    // Get user ID from auth token (adjust based on your auth)
    const userId = req.user.id;

    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: 50,
      include: [
        {
          model: User,
          as: 'sender', // Make sure this association exists in Notification model
          attributes: ['id', 'name'],
          include: [
            {
              model: Profile,
              as: 'profile',
              attributes: ['profile_pic_url']
            }
          ]
        }
      ]
    });

    // Format the response
    const formattedNotifications = notifications.map(notification => ({
      id: notification.id,
      user_id: notification.user_id,
      sender_id: notification.sender_id,
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
      sender: notification.sender ? {
        id: notification.sender.id,
        name: notification.sender.name,
        profile_pic_url: notification.sender.profile?.profile_pic_url
      } : null
    }));

    res.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: error.message });
  }
};