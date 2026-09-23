import { Activity } from "lucide-react";

function PublicNav({ navigate, active = "landing" }) {
  const navItems = [
    { label: "Overview", screen: "landing", key: "landing" },
    { label: "Features", screen: "features", key: "features" },
    { label: "Workout Plans", screen: "workout-plans", key: "workout-plans" },
    { label: "Pricing", screen: "pricing", key: "pricing" },
    { label: "Community", screen: "community", key: "community" },
  ];

  return (
    <header className="public-navbar">
      <button
        className="public-brand"
        onClick={() => navigate("landing")}
      >
        <img
          src="/images/fitpulse-logo.png"
          alt="FITPULSE"
          className="public-brand-logo"
        />
        <span>FITPULSE</span>
      </button>

      <nav className="public-nav-links">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`public-nav-link ${
              active === item.key ? "active" : ""
            }`}
            onClick={() => navigate(item.screen)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="public-nav-actions">
        <button
          className="public-login"
          onClick={() => navigate("signin")}
        >
          Login
        </button>

        <button
          className="public-join"
          onClick={() => navigate("register")}
        >
          JOIN FREE
        </button>
      </div>
    </header>
  );
}

export default PublicNav;