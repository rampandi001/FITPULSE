import { useState } from "react";

import {
  Activity,
  ArrowRight,
  Dumbbell,
  Play,
  X,
} from "lucide-react";

function Landing({ navigate }) {
  const [showTechDemo, setShowTechDemo] = useState(false);

  return (
    <div className="fitpulse-landing">

      {/* ================= NAVBAR ================= */}
      <header className="landing-navbar">
        <button
          className="landing-brand"
          onClick={() => navigate("landing")}
        >
          <img
            src="/images/fitpulse-logo.png"
            alt="FITPULSE"
            className="landing-logo-image"
          />
          <span>FITPULSE</span>
        </button>

        <nav className="landing-navigation">
          <button
            className="nav-link active"
            onClick={() => navigate("landing")}
          >
            Overview
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("features")}
          >
            Features
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("workout-plans")}
          >
            Workout Plans
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("pricing")}
          >
            Pricing
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("community")}
          >
            Community
          </button>
        </nav>

        <div className="landing-nav-actions">
          <button
            type="button"
            className="login-button"
            onClick={() => navigate("signin")}
          >
            Login
          </button>

          <button
            type="button"
            className="join-button"
            onClick={() => navigate("register")}
          >
            JOIN FREE
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="landing-hero">

        <div className="hero-background" />
        <div className="hero-overlay" />

        <div className="hero-content">

          {/* LEFT CONTENT */}
          <div className="hero-left">

            <div className="release-badge">
              NEW RELEASE: V2.0
            </div>

            <h1 className="hero-title">
              <span>CRUSH YOUR</span>
              <span>GOALS WITH</span>
              <span className="lime-text">
                PULSE ENERGY
              </span>
            </h1>

            <p className="hero-description">
              Track workouts, craft professional custom
              programs, and analyze biological metrics
              using our next-generation, high-octane
              performance ecosystem.
            </p>

            <div className="hero-buttons">

              <button
                type="button"
                className="tracking-button"
                onClick={() => navigate("register")}
              >
                START TRACKING NOW
                <ArrowRight size={17} />
              </button>

              <button
                type="button"
                className="demo-button"
                onClick={() => setShowTechDemo(true)}
              >
                <Play size={14} fill="currentColor" />
                WATCH TECH DEMO
              </button>

            </div>
          </div>

          {/* RIGHT PHONE */}
          <div className="hero-right">

            <div className="phone-card">

              <div className="phone-card-top">
                <span>FITPULSE PERFORMANCE</span>
                <strong>V2.0</strong>
              </div>

              <img
                src="/images/workout-phone.jpg"
                alt="FITPULSE Workout App"
                className="workout-phone-image"
              />

            </div>

          </div>
        </div>

        {/* ================= BOTTOM FEATURES ================= */}
        <div className="hero-bottom">

          <div className="hero-bottom-item">
            <Dumbbell size={15} />
            <div>
              <strong>SMART TRAINING</strong>
              <span>Adaptive workout programs</span>
            </div>
          </div>

          <div className="hero-bottom-line" />

          <div className="hero-bottom-item">
            <Activity size={15} />
            <div>
              <strong>REAL-TIME METRICS</strong>
              <span>Track every performance signal</span>
            </div>
          </div>

          <div className="hero-bottom-line" />

          <div className="hero-bottom-item">
            <Activity size={15} />
            <div>
              <strong>PERFORMANCE ANALYTICS</strong>
              <span>Understand your progress</span>
            </div>
          </div>

        </div>
      </section>

      {/* ================= TECH DEMO MODAL ================= */}
      {showTechDemo && (
        <div
          className="tech-demo-overlay"
          onClick={() => setShowTechDemo(false)}
        >
          <div
            className="tech-demo-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="tech-demo-close"
              onClick={() => setShowTechDemo(false)}
              aria-label="Close tech demo"
            >
              <X size={18} />
            </button>

            <div className="tech-demo-video-container">

              <video
                src="/videos/fitpulse-tech-demo.mp4"
                controls
                autoPlay
                playsInline
                className="tech-demo-video"
              >
                Your browser does not support video playback.
              </video>

            </div>

            <div className="tech-demo-info">

              <div>
                <p>FITPULSE V2.0</p>

                <h2>
                  PERFORMANCE
                  <span> INTELLIGENCE.</span>
                </h2>

                <span>
                  Track workouts, monitor real-time metrics
                  and understand your performance through
                  one connected fitness ecosystem.
                </span>
              </div>

              <button
                className="tech-demo-start"
                onClick={() => {
                  setShowTechDemo(false);
                  navigate("register");
                }}
              >
                START TRACKING
                <ArrowRight size={15} />
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Landing;