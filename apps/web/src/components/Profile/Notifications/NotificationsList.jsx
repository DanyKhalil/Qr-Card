import React, { useState, useEffect } from "react";
import { IoPersonOutline, IoCheckmark, IoEye } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import './NotificationsList.css';
import notificationsApi from '../../../services/notificationApi'; // adjust path if needed


const NotificationsList = ({ notifications = [], onNotificationClick = () => {} }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleClearAll = async () => {
    try {
      setLoading(true);
      const currentProfileId = localStorage.getItem("profileId");
      if (!currentProfileId) {
        console.error("No profile ID found. Cannot mark notifications as seen.");
        return;
      }
      await notificationsApi.markAllAsSeen(currentProfileId);
      setLoading(false);
      window.location.reload();
    } catch (err) {
      console.error("Clear all notifications error:", err);
      setError("Failed to clear notifications");
      setLoading(false);
    }
  };

  // Calculate unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.is_read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Format time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type, profilePic) => {
    const iconStyle = {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '20px',
      overflow: 'hidden'
    };

    // If there's a profile picture, use it as background
    if (profilePic) {
      return (
        <div 
          className="notification-icon with-profile-pic"
          style={{
            ...iconStyle,
            backgroundImage: `url(${profilePic})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '3px solid white',
            boxShadow: '0 3px 10px rgba(0,0,0,0.15)'
          }}
        />
      );
    }

    // Otherwise show icon with colored background
    switch (type) {
      case 'new_follower':
        return (
          <div className="notification-icon follower" style={iconStyle}>
            <IoPersonOutline />
          </div>
        );
      case 'profile_visit':
        return (
          <div className="notification-icon visit" style={iconStyle}>
            <IoEye />
          </div>
        );
      default:
        return (
          <div className="notification-icon default" style={iconStyle}>
            <IoPersonOutline />
          </div>
        );
    }
  };

  // Get notification title color
  const getNotificationTitle = (type) => {
    switch (type) {
      case 'new_follower':
        return { text: 'New Follower', color: '#64A377' };
      case 'profile_visit':
        return { text: 'Profile Visit', color: '#2196F3' };
      default:
        return { text: 'Notification', color: '#9C27B0' };
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    onNotificationClick(notification);
    
    // Navigate to sender's profile if available
    if (notification.sender?.id) {
      navigate(`/profile/${notification.sender_profile_id}`);
    }
  };

  if (!notifications.length) {
    return (
      <div className="notifications-container no-notifications">
        <div className="notifications-header">
          <h3>Notifications</h3>
          <span className="notifications-count">0</span>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <p>No notifications yet</p>
          <p className="empty-subtitle">When you get notifications, they'll appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h3>Notifications</h3>
        <div className="header-right">
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} unread</span>
          )}

          <button
            className="clear-all-btn"
            onClick={handleClearAll}
            disabled={loading}
          >
            {loading ? "Clearing..." : "Clear all"}
          </button>

          <span className="notifications-count">{notifications.length}</span>
        </div>
      </div>

      <div className="notifications-list">
        {notifications.map((notification) => {
          const titleInfo = getNotificationTitle(notification.type);
          const isUnread = !notification.is_read;
          const profilePic = notification.sender?.profile_pic_url;
          return (
            <div 
              key={notification.id} 
              className={`notification-card ${isUnread ? 'unread' : ''}`}
              onClick={ 
                titleInfo.text !== "Notification"
                  ? () => handleNotificationClick(notification)
                  : undefined
              }
              style={{
                cursor: titleInfo.text !== "notification" ? "pointer" : "default"
              }}
            >
              <div className="notification-indicator">
                {getNotificationIcon(notification.type, profilePic)}
              </div>

              <div className="notification-content">
                <div className="notification-header">
                  <span className="notification-type" style={{ color: titleInfo.color }}>
                    {titleInfo.text}
                  </span>
                  <span className="notification-time">
                    {getTimeAgo(notification.created_at)}
                  </span>
                </div>

                <p className="notification-message">{notification.message}</p>
              </div>
            </div>
          );

        })}
      </div>
    </div>
  );
};

export default NotificationsList;