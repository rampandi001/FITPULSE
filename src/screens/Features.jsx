import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Flame,
  HeartPulse,
  Target,
  Zap,
} from "lucide-react";

function Features({ navigate }) {
  const features = [
    {
      icon: Activity,
      number: "01",
      title: "SMART TRAINING",
      description:
        "Build structured workouts around your goals, performance level and training intensity.",
      tag: "TRAINING INTELLIGENCE",
    },
    {
      icon: HeartPulse,
      number: "02",
      title: "REAL-TIME METRICS",
      description:
        "Monitor heart rate, active zones, calories and session load while you train.",
      tag: "LIVE PERFORMANCE",
    },
    {
      icon: BarChart3,
      number: "03",
      title: "PERFORMANCE ANALYTICS",
      description:
        "Understand your weekly training patterns and track performance over time.",
      tag: "DATA INSIGHTS",
    },
    {
      icon: BrainCircuit,
      number: "04",
      title: "RECOVERY INTELLIGENCE",
      description:
        "Use readiness and recovery signals to understand when your body is ready to perform.",
      tag: "BODY READINESS",
    },
    {
      icon: Target,
      number: "05",
      title: "GOAL TRACKING",
      description:
        "Create measurable performance targets and monitor your progress toward every goal.",
      tag: "PROGRESS SYSTEM",
    },
    {
      icon: Flame,
      number: "06",
      title: "ACTIVITY INTELLIGENCE",
      description:
        "Track calories, steps and active minutes to build a complete picture of your daily activity.",
      tag: "DAILY ACTIVITY",
    },
  ];

  return (
    <div className="features-page">
      {/* ================= NAVBAR ================= */}

      <header className="features-navbar">
        <button
          className="features-brand"
          onClick={() => navigate("landing")}
        >
          <div className="features-brand-icon">
            <Activity size={17} strokeWidth={3} />
          </div>

          <span>FITPULSE</span>
        </button>

        <nav className="features-nav">
          <button onClick={() => navigate("landing")}>
            OVERVIEW
          </button>

          <button className="active">
            FEATURES
          </button>

          <button onClick={() => navigate("workout-plans")}>
            WORKOUT PLANS
          </button>

          <button onClick={() => navigate("pricing")}>
            PRICING
          </button>

          <button>
            COMMUNITY
          </button>
        </nav>

        <div className="features-nav-actions">
          <button
            className="features-login"
            onClick={() => navigate("signin")}
          >
            LOGIN
          </button>

          <button
            className="features-join"
            onClick={() => navigate("register")}
          >
            JOIN FREE
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <main>
        <section className="features-hero">
          <div className="features-hero-grid" />

          <div className="features-hero-content">
            <div className="features-back">
              <ArrowLeft size={14} />
              PERFORMANCE ECOSYSTEM
            </div>

            <div className="features-release">
              <Zap size={13} />
              POWERED BY FITPULSE V2.0
            </div>

            <h1>
              EVERYTHING YOU NEED
              <br />
              TO <span>PERFORM</span> BETTER.
            </h1>

            <p>
              FITPULSE combines intelligent training, real-time
              performance data and recovery insights into one
              high-performance fitness ecosystem.
            </p>

            <div className="features-hero-buttons">
              <button
                className="features-primary-button"
                onClick={() => navigate("register")}
              >
                START TRAINING
                <ArrowRight size={16} />
              </button>

              <button
                className="features-secondary-button"
                onClick={() => navigate("workout-plans")}
              >
                EXPLORE WORKOUTS
              </button>
            </div>
          </div>

          <div className="features-hero-stats">
            <div>
              <strong>120+</strong>
              <span>EXERCISES</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>ACTIVITY TRACKING</span>
            </div>

            <div>
              <strong>V2.0</strong>
              <span>PERFORMANCE SYSTEM</span>
            </div>
          </div>
        </section>

        {/* ================= FEATURE GRID ================= */}

        <section className="features-section">
          <div className="features-section-heading">
            <div>
              <p>THE FITPULSE SYSTEM</p>
              <h2>BUILT FOR PERFORMANCE</h2>
            </div>

            <span>06 CORE SYSTEMS</span>
          </div>

          <div className="features-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  className="feature-card"
                  key={feature.number}
                >
                  <div className="feature-card-top">
                    <div className="feature-icon">
                      <Icon size={21} />
                    </div>

                    <span>{feature.number}</span>
                  </div>

                  <div className="feature-tag">
                    {feature.tag}
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <div className="feature-card-line">
                    <span />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= PERFORMANCE BLOCK ================= */}

        <section className="features-performance">
          <div className="performance-content">
            <p>ONE PLATFORM. COMPLETE CONTROL.</p>

            <h2>
              TRAIN HARDER.
              <br />
              <span>TRACK SMARTER.</span>
            </h2>

            <p className="performance-description">
              From your first rep to your long-term performance
              goals, FITPULSE keeps your training data connected
              in one place.
            </p>

            <div className="performance-points">
              <div>
                <div>
                  <CheckIcon />
                </div>

                <span>
                  Structured training programs
                </span>
              </div>

              <div>
                <div>
                  <CheckIcon />
                </div>

                <span>
                  Real-time workout monitoring
                </span>
              </div>

              <div>
                <div>
                  <CheckIcon />
                </div>

                <span>
                  Long-term performance insights
                </span>
              </div>
            </div>
          </div>

          <div className="performance-visual">
            <div className="performance-ring ring-one">
              <div className="performance-ring ring-two">
                <div className="performance-core">
                  <Activity size={32} />

                  <strong>82</strong>

                  <span>READINESS</span>
                </div>
              </div>
            </div>

            <div className="performance-floating-card top">
              <span>BIO LOAD</span>
              <strong>76.4</strong>
            </div>

            <div className="performance-floating-card bottom">
              <span>HEART RATE</span>
              <strong>138 BPM</strong>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="features-cta">
          <p>YOUR PERFORMANCE STARTS HERE</p>

          <h2>
            READY TO FIND YOUR
            <span> PULSE?</span>
          </h2>

          <button
            onClick={() => navigate("register")}
          >
            JOIN FITPULSE FREE
            <ArrowRight size={17} />
          </button>
        </section>
      </main>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default Features;