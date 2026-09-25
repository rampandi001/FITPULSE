import { useEffect, useState } from "react";

import {
  Bell,
  Settings,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Notifications({ navigate }) {
  const [notifications, setNotifications] = useState([]);

  const [preferences, setPreferences] = useState({
    workoutReminders: true,
    goalUpdates: true,
    recoveryAlerts: true,
  });

  const [loading, setLoading] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPreferences = async () => {
      const token = localStorage.getItem("fitpulse_token");

      if (!token) {
        navigate("signin");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "http://localhost:5000/api/settings",
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
            "Failed to load notification settings."
          );
        }

        const data = await response.json();

        if (typeof data.notifications === "boolean") {
          const enabled = data.notifications;

          setPreferences({
            workoutReminders: enabled,
            goalUpdates: enabled,
            recoveryAlerts: enabled,
          });
        }
      } catch (error) {
        console.error(
          "NOTIFICATION SETTINGS LOAD ERROR:",
          error
        );

        setError(
          "Unable to load notification preferences."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [navigate]);

  const togglePreference = async (key) => {
    const token = localStorage.getItem("fitpulse_token");

    if (!token) {
      navigate("signin");
      return;
    }

    const previousPreferences = preferences;

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
        "http://localhost:5000/api/settings",
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
        localStorage.removeItem("fitpulse_token");
        localStorage.removeItem("fitpulse_user");
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

      setPreferences(previousPreferences);
      setError(
        "Unable to save notification preference."
      );
    } finally {
      setSavingPreferences(false);
    }
  };

  const unreadCount = 0;
  const todayCount = 0;

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
              Stay updated with your training and performance.
            </span>
          </div>

          <button
            type="button"
            className="mark-read-button"
            disabled
          >
            MARK ALL AS READ
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
              {String(unreadCount).padStart(2, "0")}
            </strong>
          </div>

          <div>
            <span>TODAY</span>
            <strong>
              {String(todayCount).padStart(2, "0")}
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
              Loading notification settings...
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
                    Notification records will appear here when
                    the backend notification system is available.
                  </p>
                </div>

                <div className="notification-time">
                  --
                </div>
              </div>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification, index) => {
                const Icon = notification.icon;

                return (
                  <div
                    className={`notification-item ${
                      notification.unread ? "unread" : ""
                    }`}
                    key={index}
                  >
                    <div className="notification-icon">
                      <Icon size={18} />
                    </div>

                    <div className="notification-content">
                      <div className="notification-title">
                        <span>{notification.type}</span>

                        {notification.unread && <i />}
                      </div>

                      <h3>{notification.title}</h3>

                      <p>{notification.text}</p>
                    </div>

                    <div className="notification-time">
                      {notification.time}
                    </div>
                  </div>
                );
              })}
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
              <h2>NOTIFICATION PREFERENCES</h2>
            </div>
          </div>

          <div className="notification-setting-row">
            <div>
              <strong>Workout Reminders</strong>
              <span>
                Receive alerts before scheduled workouts.
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
                togglePreference("workoutReminders")
              }
              disabled={
                loading || savingPreferences
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
              <strong>Goal Updates</strong>
              <span>
                Get notified about your training milestones.
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
                togglePreference("goalUpdates")
              }
              disabled={
                loading || savingPreferences
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
              <strong>Recovery Alerts</strong>
              <span>
                Receive important recovery and readiness updates.
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
                togglePreference("recoveryAlerts")
              }
              disabled={
                loading || savingPreferences
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