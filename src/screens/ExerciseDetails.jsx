import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  HeartPulse,
  Play,
  Target,
  X,
  Zap,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function ExerciseDetails({ navigate }) {
  const [showDemo, setShowDemo] = useState(false);

  const instructions = [
    "Position yourself on the bench with your feet firmly planted on the floor.",
    "Grip the bar slightly wider than shoulder width and keep your wrists stable.",
    "Lower the bar toward the middle of your chest with controlled movement.",
    "Drive the bar upward while keeping your shoulder blades retracted.",
  ];

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="exercise-details"
      />

      <main className="exercise-details-main">

        {/* HEADER */}
        <header className="exercise-details-header">
          <button
            className="exercise-back-button"
            onClick={() => navigate("exercise-library")}
          >
            <ArrowLeft size={16} />
            BACK TO EXERCISE LIBRARY
          </button>
        </header>

        {/* HERO */}
        <section className="exercise-detail-hero">

          <div className="exercise-detail-visual">

            <div className="exercise-image-container">
              <img
                src="/images/bench-press.jpg"
                alt="Barbell Bench Press"
              />

              <div className="exercise-image-overlay" />

              <div className="exercise-image-label">
                <span>EXERCISE 01</span>
                <strong>CHEST · PUSH</strong>
              </div>
            </div>

            <button
              className="exercise-demo-button"
              onClick={() => setShowDemo(true)}
            >
              <Play
                size={14}
                fill="currentColor"
              />
              WATCH DEMO
            </button>

          </div>

          {/* INFO */}
          <div className="exercise-detail-info">

            <div className="exercise-detail-tags">
              <span>CHEST</span>
              <span>INTERMEDIATE</span>
              <span>BARBELL</span>
            </div>

            <p className="exercise-detail-kicker">
              STRENGTH MOVEMENT
            </p>

            <h1>
              BARBELL
              <br />
              <span>BENCH PRESS</span>
            </h1>

            <p className="exercise-detail-description">
              A fundamental upper-body pressing movement focused on
              developing chest strength, triceps power and overall
              pressing performance.
            </p>

            <div className="exercise-detail-stats">

              <div>
                <Target size={17} />
                <span>PRIMARY MUSCLE</span>
                <strong>CHEST</strong>
              </div>

              <div>
                <Dumbbell size={17} />
                <span>EQUIPMENT</span>
                <strong>BARBELL</strong>
              </div>

              <div>
                <HeartPulse size={17} />
                <span>DIFFICULTY</span>
                <strong>INTERMEDIATE</strong>
              </div>

              <div>
                <Zap size={17} />
                <span>MOVEMENT</span>
                <strong>PUSH</strong>
              </div>

            </div>
          </div>
        </section>

        {/* PERFORMANCE STATS */}
        <section className="exercise-performance-grid">

          <div className="exercise-performance-card">
            <div className="performance-card-icon">
              <Dumbbell size={18} />
            </div>
            <span>RECOMMENDED LOAD</span>
            <strong>80 KG</strong>
            <small>Based on your current profile</small>
          </div>

          <div className="exercise-performance-card">
            <div className="performance-card-icon">
              <Target size={18} />
            </div>
            <span>RECOMMENDED SETS</span>
            <strong>5 × 5</strong>
            <small>Strength progression protocol</small>
          </div>

          <div className="exercise-performance-card">
            <div className="performance-card-icon">
              <Clock3 size={18} />
            </div>
            <span>REST PERIOD</span>
            <strong>120 SEC</strong>
            <small>Between working sets</small>
          </div>

          <div className="exercise-performance-card">
            <div className="performance-card-icon">
              <Flame size={18} />
            </div>
            <span>EST. CALORIES</span>
            <strong>86 KCAL</strong>
            <small>Per training session</small>
          </div>

        </section>

        {/* TECHNIQUE */}
        <section className="exercise-instructions-section">

          <div className="exercise-section-heading">
            <div>
              <p>TECHNIQUE GUIDE</p>
              <h2>HOW TO PERFORM</h2>
            </div>

            <span>04 STEPS</span>
          </div>

          <div className="instruction-layout">

            <div className="instruction-list">

              {instructions.map((instruction, index) => (
                <div
                  className="instruction-item"
                  key={index}
                >
                  <div className="instruction-number">
                    0{index + 1}
                  </div>

                  <div>
                    <strong>
                      STEP {index + 1}
                    </strong>

                    <p>
                      {instruction}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            <div className="exercise-tips-card">

              <div className="tips-heading">
                <CheckCircle2 size={18} />

                <div>
                  <p>PERFORMANCE TIPS</p>
                  <h3>TRAIN WITH CONTROL</h3>
                </div>
              </div>

              <ul>
                <li>
                  Keep your shoulder blades retracted
                  throughout the set.
                </li>

                <li>
                  Maintain controlled movement during
                  the lowering phase.
                </li>

                <li>
                  Avoid bouncing the bar off your chest.
                </li>

                <li>
                  Keep your feet stable and firmly planted.
                </li>
              </ul>

            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="exercise-action-card">

          <div>
            <p>ADD TO YOUR TRAINING</p>

            <h2>
              READY TO
              <span> PRESS?</span>
            </h2>

            <span>
              Start an active workout session and track
              your performance in real time.
            </span>
          </div>

          <button
            className="exercise-start-button"
            onClick={() => navigate("workout-tracking")}
          >
            START WORKOUT
            <ArrowRight size={16} />
          </button>

        </section>

        {/* VIDEO MODAL */}
        {showDemo && (
          <div
            className="demo-modal-overlay"
            onClick={() => setShowDemo(false)}
          >

            <div
              className="demo-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <button
                className="demo-close"
                onClick={() => setShowDemo(false)}
                aria-label="Close demo"
              >
                <X size={18} />
              </button>

              <div className="demo-video-container">
                <video
                  src="/videos/bench-press-demo.mp4"
                  controls
                  autoPlay
                  playsInline
                  className="demo-video"
                >
                  Your browser does not support video playback.
                </video>
              </div>

              <div className="demo-modal-info">

                <p>TECHNIQUE DEMO</p>

                <h2>
                  BARBELL BENCH PRESS
                </h2>

                <span>
                  Follow controlled movement, stable
                  positioning and proper breathing
                  throughout every repetition.
                </span>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

export default ExerciseDetails;