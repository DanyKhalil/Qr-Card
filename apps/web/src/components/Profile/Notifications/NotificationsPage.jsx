import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import NotificationsList from "./NotificationsList";
import Header from "../../Header/Header";
import Footer from "../../Footer/Footer";
import "./NotificationsPage.css";
import { notificationsApi } from "../../../services/notificationApi.js";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Fetch from your API
      const data = await notificationsApi.getUserNotifications();
      setNotifications(data.notifications || []);
      handleMarkAllAsRead();
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

//   const handleNotificationClick = (notification) => {
//     console.log("Notification clicked:", notification);
//     // You can add mark as read functionality here
//   };

  const handleMarkAllAsRead = async () => {
    notificationsApi.markAllAsRead()
  };

  return (
    <div className="notifications-page">
      <Header activeIndex={2}/>

      <div className="notifications-page-container">
        <div className="page-header">
          <h1 className="page-title">Notifications</h1>
          {notifications.length > 0 && (
            <button 
              className="mark-all-read-btn"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button 
              className="retry-btn"
              onClick={fetchNotifications}
            >
              Try Again
            </button>
          </div>
        ) : (
          <NotificationsList 
            notifications={notifications}
            // onNotificationClick={handleNotificationClick}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsPage;