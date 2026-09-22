import Logo from "./Logo";

function PublicNav({ navigate, active = "landing" }) {
  return (
    <header className="public-navbar">
      <button
        className="public-brand"
        onClick={() => navigate("landing")}
      >
        <Logo />
      </button>

      <nav className="public-navigation">
        <button
          className={`public-nav-link ${
            active === "landing" ? "active" : ""
          }`}
          onClick={() => navigate("landing")}
        >
          Overview
        </button>

        <button
          className={`public-nav-link ${
            active === "features" ? "active" : ""
          }`}
          onClick={() => navigate("features")}
        >
          Features
        </button>

        <button
          className={`public-nav-link ${
            active === "workout-plans" ? "active" : ""
          }`}
          onClick={() => navigate("workout-plans")}
        >
          Workout Plans
        </button>

        <button
          className={`public-nav-link ${
            active === "pricing" ? "active" : ""
          }`}
          onClick={() => navigate("pricing")}
        >
          Pricing
        </button>

        <button
          className={`public-nav-link ${
            active === "community" ? "active" : ""
          }`}
          onClick={() => navigate("community")}
        >
          Community
        </button>
      </nav>

      <div className="public-nav-actions">
        <button
          className="public-login-button"
          onClick={() => navigate("signin")}
        >
          Login
        </button>

        <button
          className="public-join-button"
          onClick={() => navigate("register")}
        >
          JOIN FREE
        </button>
      </div>
    </header>
  );
}

export default PublicNav;