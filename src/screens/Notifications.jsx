import { useEffect, useState } from "react";

import {
  Bell,
  CheckCircle2,
  Dumbbell,
  Flame,
  Goal,
  Settings,
  Trophy,
  UserRound,
  XCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

const API_BASE_URL = "https://fitpulse-feid.onrender.com";

function Notifications({ navigate }) {
  const [notifications, setNotifications] = useState([]);

  const [preferences, setPreferences] = useState({
    workoutReminders: true,
    goalUpdates: true,
    recoveryAlerts: true,
  });

  const [loading, setLoading] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);
  const [error, setError] = useState("");

  const getNotificationIcon = (type) => {
    switch (type) {
      case "WORKOUT":
        return Dumbbell;

      case "GOAL":
        return Goal;

      case "PROGRESS":
        return Trophy;

      case "SUBSCRIPTION":
        return CheckCircle2;

      case "COMMUNITY":
        return UserRound;

      case "SYSTEM":
        return Bell;

      default:
        return Bell;
    }
  };

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) {
      return "--";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "--";
    }

    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - date.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return "Just now";
    }

    const diffInMinutes = Math.floor(
      diffInSeconds / 60
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(
      diffInMinutes / 60
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(
      diffInHours / 24
    );

    if (diffInDays === 1) {
      return "Yesterday";
    }

    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isToday = (createdAt) => {
    if (!createdAt) {
      return false;
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const now = new Date();

    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const loadNotifications = async () => {
    const token = localStorage.getItem("fitpulse_token");

    if (!token) {
      navigate("signin");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("fitpulse_token");
        localStorage.removeItem("fitpulse_user");
        navigate("signin");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to load notifications."
        );
      }

      const data = await response.json();

      setNotifications(
        Array.isArray(data.notifications)
          ? data.notifications
          : []
      );
    } catch (error) {
      console.error(
        "NOTIFICATIONS LOAD ERROR:",
        error
      );

      setError(
        "Unable to load notifications."
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("fitpulse_token");

      if (!token) {
        navigate("signin");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [
          notificationResponse,
          settingsResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/api/notifications`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(
            `${API_BASE_URL}/api/settings`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        if (
          notificationResponse.status === 401 ||
          settingsResponse.status === 401
        ) {
          localStorage.removeItem(
            "fitpulse_token"
          );
          localStorage.removeItem(
            "fitpulse_user"
          );
          navigate("signin");
          return;
        }

        if (!notificationResponse.ok) {
          throw new Error(
            "Failed to load notifications."
          );
        }

        if (!settingsResponse.ok) {
          throw new Error(
            "Failed to load notification settings."
          );
        }

        const notificationData =
          await notificationResponse.json();

        const settingsData =
          await settingsResponse.json();

        setNotifications(
          Array.isArray(
            notificationData.notifications
          )
            ? notificationData.notifications
            : []
        );

        if (
          typeof settingsData.notifications ===
          "boolean"
        ) {
          const enabled =
            settingsData.notifications;

          setPreferences({
            workoutReminders: enabled,
            goalUpdates: enabled,
            recoveryAlerts: enabled,
          });
        }
      } catch (error) {
        console.error(
          "NOTIFICATION PAGE LOAD ERROR:",
          error
        );

        setError(
          "Unable to load notification data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const togglePreference = async (key) => {
    const token = localStorage.getItem(
      "fitpulse_token"
    );

    if (!token) {
      navigate("signin");
      return;
    }

    const previousPreferences =
      preferences;

    const nextPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    setPreferences(nextPreferences);
    setSavingPreferences(true);
    setError("");

    try {
      const anyEnabled =
        nextPreferences.workoutReminders ||
        nextPreferences.goalUpdates ||
        nextPreferences.recoveryAlerts;

      const response = await fetch(
        `${API_BASE_URL}/api/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            notifications: anyEnabled,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "fitpulse_token"
        );
        localStorage.removeItem(
          "fitpulse_user"
        );
        navigate("signin");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to update notification settings."
        );
      }

      window.dispatchEvent(
        new Event("fitpulse-settings-updated")
      );
    } catch (error) {
      console.error(
        "NOTIFICATION SETTINGS SAVE ERROR:",
        error
      );

      setPreferences(
        previousPreferences
      );

      setError(
        "Unable to save notification preference."
      );
    } finally {
      setSavingPreferences(false);
    }
  };

  const markNotificationAsRead = async (
    notificationId
  ) => {
    const token = localStorage.getItem(
      "fitpulse_token"
    );

    if (!token) {
      navigate("signin");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "fitpulse_token"
        );
        localStorage.removeItem(
          "fitpulse_user"
        );
        navigate("signin");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to mark notification as read."
        );
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );

      setError(
        "Unable to update notification."
      );
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem(
      "fitpulse_token"
    );

    if (!token) {
      navigate("signin");
      return;
    }

    setMarkingAllRead(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/read-all`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "fitpulse_token"
        );
        localStorage.removeItem(
          "fitpulse_user"
        );
        navigate("signin");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to mark all notifications as read."
        );
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "MARK ALL NOTIFICATIONS ERROR:",
        error
      );

      setError(
        "Unable to mark notifications as read."
      );
    } finally {
      setMarkingAllRead(false);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const todayCount = notifications.filter(
    (notification) =>
      isToday(notification.createdAt)
  ).length;

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="notifications"
      />

      <main className="notifications-main">
        <header className="notifications-header">
          <div>
            <p>ALERT CENTER</p>

            <h1>NOTIFICATIONS</h1>

            <span>
              Stay updated with your training and
              performance.
            </span>
          </div>

          <button
            type="button"
            className="mark-read-button"
            onClick={markAllAsRead}
            disabled={
              loading ||
              markingAllRead ||
              unreadCount === 0
            }
          >
            {markingAllRead
              ? "MARKING..."
              : "MARK ALL AS READ"}
          </button>
        </header>

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

        <section className="notification-summary">
          <div>
            <span>UNREAD</span>

            <strong>
              {String(unreadCount).padStart(
                2,
                "0"
              )}
            </strong>
          </div>

          <div>
            <span>TODAY</span>

            <strong>
              {String(todayCount).padStart(
                2,
                "0"
              )}
            </strong>
          </div>

          <div>
            <span>TOTAL ALERTS</span>

            <strong>
              {notifications.length}
            </strong>
          </div>
        </section>

        <section className="notification-section">
          <div className="notification-section-heading">
            <div>
              <p>RECENT ACTIVITY</p>

              <h2>ALL NOTIFICATIONS</h2>
            </div>

            <span>
              {notifications.length} ALERTS
            </span>
          </div>

          {loading ? (
            <div className="settings-loading">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-list">
              <div className="notification-item">
                <div className="notification-icon">
                  <Bell size={18} />
                </div>

                <div className="notification-content">
                  <div className="notification-title">
                    <span>SYSTEM</span>
                  </div>

                  <h3>No notifications yet</h3>

                  <p>
                    New workout, goal, progress,
                    subscription and system alerts
                    will appear here.
                  </p>
                </div>

                <div className="notification-time">
                  --
                </div>
              </div>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map(
                (notification) => {
                  const Icon =
                    getNotificationIcon(
                      notification.type
                    );

                  return (
                    <button
                      type="button"
                      className={`notification-item ${
                        !notification.read
                          ? "unread"
                          : ""
                      }`}
                      key={notification._id}
                      onClick={() => {
                        if (
                          !notification.read
                        ) {
                          markNotificationAsRead(
                            notification._id
                          );
                        }
                      }}
                    >
                      <div className="notification-icon">
                        <Icon size={18} />
                      </div>

                      <div className="notification-content">
                        <div className="notification-title">
                          <span>
                            {notification.type ||
                              "SYSTEM"}
                          </span>

                          {!notification.read && (
                            <i />
                          )}
                        </div>

                        <h3>
                          {notification.title}
                        </h3>

                        <p>
                          {notification.message}
                        </p>
                      </div>

                      <div className="notification-time">
                        {formatNotificationTime(
                          notification.createdAt
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </section>

        <section className="notification-preferences">
          <div className="notification-preferences-heading">
            <div className="notification-settings-icon">
              <Settings size={18} />
            </div>

            <div>
              <p>CONTROL CENTER</p>

              <h2>
                NOTIFICATION PREFERENCES
              </h2>
            </div>
          </div>

          <div className="notification-setting-row">
            <div>
              <strong>
                Workout Reminders
              </strong>

              <span>
                Receive alerts before scheduled
                workouts.
              </span>
            </div>

            <button
              type="button"
              className={
                preferences.workoutReminders
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                togglePreference(
                  "workoutReminders"
                )
              }
              disabled={
                loading ||
                savingPreferences
              }
              aria-label="Toggle workout reminders"
              aria-pressed={
                preferences.workoutReminders
              }
            >
              <span />
            </button>
          </div>

          <div className="notification-setting-row">
            <div>
              <strong>
                Goal Updates
              </strong>

              <span>
                Get notified about your training
                milestones.
              </span>
            </div>

            <button
              type="button"
              className={
                preferences.goalUpdates
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                togglePreference(
                  "goalUpdates"
                )
              }
              disabled={
                loading ||
                savingPreferences
              }
              aria-label="Toggle goal updates"
              aria-pressed={
                preferences.goalUpdates
              }
            >
              <span />
            </button>
          </div>

          <div className="notification-setting-row">
            <div>
              <strong>
                Recovery Alerts
              </strong>

              <span>
                Receive important recovery and
                readiness updates.
              </span>
            </div>

            <button
              type="button"
              className={
                preferences.recoveryAlerts
                  ? "toggle active"
                  : "toggle"
              }
              onClick={() =>
                togglePreference(
                  "recoveryAlerts"
                )
              }
              disabled={
                loading ||
                savingPreferences
              }
              aria-label="Toggle recovery alerts"
              aria-pressed={
                preferences.recoveryAlerts
              }
            >
              <span />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Notifications;