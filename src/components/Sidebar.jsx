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
  ShieldCheck,
  Target,
} from "lucide-react";

import Logo from "./Logo";

function Sidebar({ navigate, active = "dashboard" }) {
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
      icon: ShieldCheck,
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
      {/* LOGO */}
      <div className="sidebar-logo">
        <Logo />
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`sidebar-item ${
                active === item.screen ? "active" : ""
              }`}
              onClick={() => navigate(item.screen)}
            >
              <Icon size={15} strokeWidth={1.8} />

              <span>{item.label}</span>

              {item.notification && (
                <span className="notification-badge">
                  {item.notification}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* PROFILE */}
      <button
        className={`sidebar-user ${
          active === "profile" ? "profile-active" : ""
        }`}
        onClick={() => navigate("profile")}
      >
        <div className="user-avatar">
          <img
            src="/images/profile.jpg"
            alt="Karthik"
          />
        </div>

        <div className="user-details">
          <strong>Karthik</strong>
          <span>Athlete Lvl 14</span>
        </div>
      </button>
    </aside>
  );
}

export default Sidebar;