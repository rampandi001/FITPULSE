import { useEffect, useState } from "react";

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

  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------------------------------------
  // LOAD SELECTED EXERCISE
  // ----------------------------------------

  useEffect(() => {
    const loadExercise = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("fitpulse_token");

        if (!token) {
          navigate("signin");
          return;
        }

        const savedExercise =
          localStorage.getItem(
            "fitpulse_selected_exercise"
          );

        if (!savedExercise) {
          throw new Error(
            "No exercise selected."
          );
        }

        let selectedExercise;

        try {
          selectedExercise =
            JSON.parse(savedExercise);
        } catch (parseError) {
          throw new Error(
            "Invalid exercise data."
          );
        }

        // ----------------------------------------
        // LOAD FULL EXERCISE FROM BACKEND
        // ----------------------------------------

        if (selectedExercise?._id) {
          const response = await fetch(
            `http://localhost:5000/api/exercises/${selectedExercise._id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (response.status === 401) {
            localStorage.removeItem(
              "fitpulse_token"
            );

            localStorage.removeItem(
              "fitpulse_user"
            );

            navigate("signin");
            return;
          }

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to load exercise."
            );
          }

          setExercise(
            data.exercise || selectedExercise
          );
        } else {
          // Compatibility with old saved data
          setExercise(selectedExercise);
        }
      } catch (err) {
        console.error(
          "EXERCISE DETAILS LOAD ERROR:",
          err
        );

        setError(
          err.message ||
            "Unable to load exercise."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [navigate]);

  // ----------------------------------------
  // LOADING
  // ----------------------------------------

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar
          navigate={navigate}
          active="exercise-details"
        />

        <main className="exercise-details-main">
          <div className="settings-loading">
            LOADING EXERCISE...
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------
  // ERROR
  // ----------------------------------------

  if (!exercise) {
    return (
      <div className="app-shell">
        <Sidebar
          navigate={navigate}
          active="exercise-details"
        />

        <main className="exercise-details-main">
          <div className="settings-error">
            {error || "Exercise not found."}
          </div>

          <button
            className="exercise-back-button"
            onClick={() =>
              navigate("exercise-library")
            }
          >
            <ArrowLeft size={16} />
            BACK TO EXERCISE LIBRARY
          </button>
        </main>
      </div>
    );
  }

  // ----------------------------------------
  // BACKEND DATA
  // ----------------------------------------

  const exerciseName =
    exercise.name || "Exercise";

  const muscle =
    exercise.category || "—";

  const difficulty =
    exercise.level || "—";

  const equipment =
    exercise.equipment || "—";

  const image =
    exercise.image || "";

  // Backend currently doesn't contain these
  // fields, so don't create fake values.
  const recommendedLoad = "—";
  const recommendedSets = "—";
  const restPeriod = "—";
  const calories = "—";

  // Existing backend Exercise model does not
  // contain movement/instructions/tips yet.
  const movement = "—";

  const description =
    "Exercise information is loaded from the FITPULSE performance database.";

  const instructions = [
    "Follow the recommended technique for this exercise.",
    "Maintain controlled movement throughout each repetition.",
    "Use stable positioning and proper form.",
    "Stop the exercise if you experience pain or discomfort.",
  ];

  const tips = [
    "Focus on controlled movement.",
    "Maintain proper body positioning.",
    "Use an appropriate resistance level.",
    "Prioritize technique throughout the exercise.",
  ];

  const handleStartWorkout = () => {
    navigate("workout-tracking");
  };

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
            onClick={() =>
              navigate("exercise-library")
            }
          >
            <ArrowLeft size={16} />
            BACK TO EXERCISE LIBRARY
          </button>
        </header>

        {/* ERROR */}

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

        {/* HERO */}

        <section className="exercise-detail-hero">

          <div className="exercise-detail-visual">

            <div className="exercise-image-container">

              {image ? (
                <img
                  src={image}
                  alt={exerciseName}
                />
              ) : (
                <div className="exercise-image-placeholder">
                  <Dumbbell size={42} />
                </div>
              )}

              <div className="exercise-image-overlay" />

              <div className="exercise-image-label">
                <span>
                  EXERCISE
                </span>

                <strong>
                  {muscle} · {movement}
                </strong>
              </div>
            </div>

            <button
              className="exercise-demo-button"
              onClick={() =>
                setShowDemo(true)
              }
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

              <span>
                {muscle}
              </span>

              <span>
                {difficulty}
              </span>

              <span>
                {equipment}
              </span>

            </div>

            <p className="exercise-detail-kicker">
              STRENGTH MOVEMENT
            </p>

            <h1>
              {exerciseName
                .split(" ")
                .slice(0, -1)
                .join(" ")}

              <br />

              <span>
                {exerciseName
                  .split(" ")
                  .slice(-1)
                  .join(" ")}
              </span>
            </h1>

            <p className="exercise-detail-description">
              {description}
            </p>

            <div className="exercise-detail-stats">

              <div>
                <Target size={17} />

                <span>
                  PRIMARY MUSCLE
                </span>

                <strong>
                  {muscle}
                </strong>
              </div>

              <div>
                <Dumbbell size={17} />

                <span>
                  EQUIPMENT
                </span>

                <strong>
                  {equipment}
                </strong>
              </div>

              <div>
                <HeartPulse size={17} />

                <span>
                  DIFFICULTY
                </span>

                <strong>
                  {difficulty}
                </strong>
              </div>

              <div>
                <Zap size={17} />

                <span>
                  MOVEMENT
                </span>

                <strong>
                  {movement}
                </strong>
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

            <span>
              RECOMMENDED LOAD
            </span>

            <strong>
              {recommendedLoad}
            </strong>

            <small>
              Not available in exercise database
            </small>

          </div>

          <div className="exercise-performance-card">

            <div className="performance-card-icon">
              <Target size={18} />
            </div>

            <span>
              RECOMMENDED SETS
            </span>

            <strong>
              {recommendedSets}
            </strong>

            <small>
              Not available in exercise database
            </small>

          </div>

          <div className="exercise-performance-card">

            <div className="performance-card-icon">
              <Clock3 size={18} />
            </div>

            <span>
              REST PERIOD
            </span>

            <strong>
              {restPeriod}
            </strong>

            <small>
              Not available in exercise database
            </small>

          </div>

          <div className="exercise-performance-card">

            <div className="performance-card-icon">
              <Flame size={18} />
            </div>

            <span>
              EST. CALORIES
            </span>

            <strong>
              {calories}
            </strong>

            <small>
              Not available in exercise database
            </small>

          </div>

        </section>

        {/* TECHNIQUE */}

        <section className="exercise-instructions-section">

          <div className="exercise-section-heading">

            <div>
              <p>
                TECHNIQUE GUIDE
              </p>

              <h2>
                HOW TO PERFORM
              </h2>
            </div>

            <span>
              {instructions.length
                .toString()
                .padStart(2, "0")}{" "}
              STEPS
            </span>

          </div>

          <div className="instruction-layout">

            <div className="instruction-list">

              {instructions.map(
                (instruction, index) => (
                  <div
                    className="instruction-item"
                    key={index}
                  >

                    <div className="instruction-number">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
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
                )
              )}

            </div>

            <div className="exercise-tips-card">

              <div className="tips-heading">

                <CheckCircle2 size={18} />

                <div>
                  <p>
                    PERFORMANCE TIPS
                  </p>

                  <h3>
                    TRAIN WITH CONTROL
                  </h3>
                </div>

              </div>

              <ul>
                {tips.map(
                  (tip, index) => (
                    <li key={index}>
                      {tip}
                    </li>
                  )
                )}
              </ul>

            </div>

          </div>

        </section>

        {/* CTA */}

        <section className="exercise-action-card">

          <div>

            <p>
              ADD TO YOUR TRAINING
            </p>

            <h2>
              READY TO
              <span>
                {" "}
                TRAIN?
              </span>
            </h2>

            <span>
              Start an active workout session and
              track your performance in real time.
            </span>

          </div>

          <button
            className="exercise-start-button"
            onClick={handleStartWorkout}
          >
            START WORKOUT

            <ArrowRight size={16} />
          </button>

        </section>

        {/* VIDEO MODAL */}

        {showDemo && (

          <div
            className="demo-modal-overlay"
            onClick={() =>
              setShowDemo(false)
            }
          >

            <div
              className="demo-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                className="demo-close"
                onClick={() =>
                  setShowDemo(false)
                }
                aria-label="Close demo"
              >
                <X size={18} />
              </button>

              <div className="demo-video-container">

                <div className="exercise-demo-unavailable">
                  <Play size={30} />

                  <p>
                    Demo video is not available
                    for this exercise yet.
                  </p>
                </div>

              </div>

              <div className="demo-modal-info">

                <p>
                  TECHNIQUE DEMO
                </p>

                <h2>
                  {exerciseName}
                </h2>

                <span>
                  Exercise demo content will be
                  added to the FITPULSE exercise
                  database.
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