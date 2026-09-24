import { useEffect, useState } from "react";

import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CircleHelp,
  Dumbbell,
  LayoutDashboard,
  Settings,
  Target,
  UserRound,
} from "lucide-react";

function Sidebar({ navigate, active = "dashboard" }) {
  const [user, setUser] = useState(null);

  const loadUser = () => {
    try {
      const storedUser = localStorage.getItem("fitpulse_user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("SIDEBAR USER ERROR:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    const handleUserUpdate = () => {
      loadUser();
    };

    window.addEventListener(
      "fitpulse-user-updated",
      handleUserUpdate
    );

    window.addEventListener(
      "storage",
      handleUserUpdate
    );

    return () => {
      window.removeEventListener(
        "fitpulse-user-updated",
        handleUserUpdate
      );

      window.removeEventListener(
        "storage",
        handleUserUpdate
      );
    };
  }, []);

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      screen: "dashboard",
    },
    {
      label: "Workout Plans",
      icon: Dumbbell,
      screen: "workout-plans",
    },
    {
      label: "Exercise Library",
      icon: BookOpen,
      screen: "exercise-library",
    },
    {
      label: "Exercise Details",
      icon: BookOpen,
      screen: "exercise-details",
    },
    {
      label: "Workout Tracking",
      icon: Activity,
      screen: "workout-tracking",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      screen: "analytics",
    },
    {
      label: "Goals",
      icon: Target,
      screen: "goals",
    },
    {
      label: "Calorie & Activity Tracking",
      icon: Activity,
      screen: "calories",
    },
    {
      label: "Workout History",
      icon: CalendarDays,
      screen: "workout-history",
    },
    {
      label: "Subscription",
      icon: CalendarDays,
      screen: "pricing",
    },
    {
      label: "Notifications",
      icon: Bell,
      screen: "notifications",
      notification: 2,
    },
    {
      label: "Support Desk",
      icon: CircleHelp,
      screen: "support",
    },
    {
      label: "Settings",
      icon: Settings,
      screen: "settings",
    },
  ];

  return (
    <aside className="sidebar">

      {/* =========================
          FITPULSE LOGO
      ========================== */}

      <div className="sidebar-logo">

        <div className="sidebar-logo-mark">
          <Activity
            size={19}
            strokeWidth={3}
          />
        </div>

        <div className="sidebar-logo-text">
          FITPULSE
        </div>

      </div>

      {/* =========================
          NAVIGATION
      ========================== */}

      <nav className="sidebar-nav">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className={`sidebar-item ${
                active === item.screen
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate(item.screen)}
            >
              <Icon
                size={16}
                strokeWidth={1.9}
              />

              <span>
                {item.label}
              </span>

              {item.notification && (
                <span className="notification-badge">
                  {item.notification}
                </span>
              )}
            </button>
          );
        })}

      </nav>

      {/* =========================
          USER PROFILE
      ========================== */}

      <button
        type="button"
        className={`sidebar-user ${
          active === "profile"
            ? "profile-active"
            : ""
        }`}
        onClick={() => navigate("profile")}
      >

        <div className="user-avatar">

          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name || "Profile"}
            />
          ) : (
            <UserRound size={17} />
          )}

        </div>

        <div className="user-details">

          <strong>
            {user?.name || "Athlete"}
          </strong>

          <span>
            Athlete Lvl 14
          </span>

        </div>

      </button>

    </aside>
  );
}

export default Sidebar;