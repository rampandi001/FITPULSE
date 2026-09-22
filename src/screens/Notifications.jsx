import {
  Bell,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  HeartPulse,
  Settings,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Notifications({ navigate }) {
  const notifications = [
    {
      icon: Dumbbell,
      type: "WORKOUT",
      title: "Your workout is ready",
      text: "Upper Push Power is scheduled for today.",
      time: "10 min ago",
      unread: true,
    },
    {
      icon: HeartPulse,
      type: "RECOVERY",
      title: "Recovery status updated",
      text: "Your body readiness is currently at 82%.",
      time: "1 hour ago",
      unread: true,
    },
    {
      icon: Flame,
      type: "GOAL",
      title: "You're close to your calorie target",
      text: "Only 1,520 kcal remaining to reach your weekly goal.",
      time: "3 hours ago",
      unread: false,
    },
    {
      icon: Clock3,
      type: "REMINDER",
      title: "Workout reminder",
      text: "Your scheduled training session starts in 30 minutes.",
      time: "Yesterday",
      unread: false,
    },
    {
      icon: CheckCircle2,
      type: "ACHIEVEMENT",
      title: "Goal completed",
      text: "You've completed your 30 workout session milestone.",
      time: "Yesterday",
      unread: false,
    },
  ];

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

          <button className="mark-read-button">
            MARK ALL AS READ
          </button>
        </header>

        <section className="notification-summary">
          <div>
            <span>UNREAD</span>
            <strong>02</strong>
          </div>

          <div>
            <span>TODAY</span>
            <strong>03</strong>
          </div>

          <div>
            <span>TOTAL ALERTS</span>
            <strong>18</strong>
          </div>
        </section>

        <section className="notification-section">
          <div className="notification-section-heading">
            <div>
              <p>RECENT ACTIVITY</p>
              <h2>ALL NOTIFICATIONS</h2>
            </div>

            <span>18 ALERTS</span>
          </div>

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

                      {notification.unread && (
                        <i />
                      )}
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

            <div className="toggle active">
              <span />
            </div>
          </div>

          <div className="notification-setting-row">
            <div>
              <strong>Goal Updates</strong>
              <span>
                Get notified about your training milestones.
              </span>
            </div>

            <div className="toggle active">
              <span />
            </div>
          </div>

          <div className="notification-setting-row">
            <div>
              <strong>Recovery Alerts</strong>
              <span>
                Receive important recovery and readiness updates.
              </span>
            </div>

            <div className="toggle active">
              <span />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Notifications;