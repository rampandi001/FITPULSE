import {
  Activity,
  ArrowRight,
  Users,
  Zap,
} from "lucide-react";

function Community({ navigate }) {
  const members = [
    {
      initials: "AK",
      name: "Arjun K.",
      workout: "Upper Push Power",
    },
    {
      initials: "SR",
      name: "Sarah R.",
      workout: "Strength Session",
    },
    {
      initials: "VK",
      name: "Vikram K.",
      workout: "Leg Performance",
    },
  ];

  return (
    <div className="public-page community-page">
      {/* NAVBAR */}
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

        <nav className="public-nav">
          <button
            className="public-nav-link"
            onClick={() => navigate("landing")}
          >
            Overview
          </button>

          <button
            className="public-nav-link"
            onClick={() => navigate("features")}
          >
            Features
          </button>

          <button
            className="public-nav-link"
            onClick={() => navigate("workout-plans")}
          >
            Workout Plans
          </button>

          <button
            className="public-nav-link"
            onClick={() => navigate("pricing")}
          >
            Pricing
          </button>

          <button
            className="public-nav-link active"
            onClick={() => navigate("community")}
          >
            Community
          </button>
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

      {/* COMMUNITY HERO */}
      <main className="community-main">
        <section className="community-hero">

          <div className="community-copy">

            <div className="community-top-label">
              <span className="community-back-arrow">←</span>
              <span>PERFORMANCE COMMUNITY</span>

              <div className="community-powered">
                <Users size={13} />
                BUILT FOR ATHLETES
              </div>
            </div>

            <h1>
              TRAIN
              <span> TOGETHER.</span>
              <br />
              PERFORM
              <br />
              BETTER.
            </h1>

            <p>
              Connect with athletes, share your progress,
              discover training routines and stay accountable
              through the FITPULSE community.
            </p>

            <div className="community-actions">
              <button
                className="community-primary-btn"
                onClick={() => navigate("register")}
              >
                JOIN COMMUNITY
                <ArrowRight size={17} />
              </button>

              <button
                className="community-secondary-btn"
                onClick={() => navigate("workout-plans")}
              >
                EXPLORE WORKOUTS
              </button>
            </div>

          </div>

          {/* ACTIVE COMMUNITY CARD */}
          <div className="community-live-card">

            <div className="community-card-header">
              <div>
                <span className="live-label">
                  LIVE COMMUNITY
                </span>

                <h2>ACTIVE NOW</h2>
              </div>

              <span className="live-dot"></span>
            </div>

            <div className="community-members">
              {members.map((member) => (
                <div
                  className="community-member"
                  key={member.name}
                >
                  <div className="member-avatar">
                    {member.initials}
                  </div>

                  <div className="member-info">
                    <strong>{member.name}</strong>
                    <span>{member.workout}</span>
                  </div>

                  <b>LIVE</b>
                </div>
              ))}
            </div>

            <div className="community-live-footer">
              <Activity size={17} />
              <span>
                1,284 ATHLETES TRAINING NOW
              </span>
            </div>

          </div>

        </section>

        {/* BOTTOM STATS */}
        <section className="community-stats">

          <div className="community-stat">
            <div className="stat-icon">
              <Users size={17} />
            </div>
            <div>
              <strong>12K+</strong>
              <span>ACTIVE ATHLETES</span>
            </div>
          </div>

          <div className="community-stat">
            <div className="stat-icon">
              <Zap size={17} />
            </div>
            <div>
              <strong>24/7</strong>
              <span>COMMUNITY ACTIVITY</span>
            </div>
          </div>

          <div className="community-stat">
            <div className="stat-icon">
              <Activity size={17} />
            </div>
            <div>
              <strong>8.4K</strong>
              <span>WORKOUTS SHARED</span>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}

export default Community;