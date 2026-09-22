import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  HeartPulse,
  Target,
  Zap,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function PlanDetails({ navigate }) {
  const exercises = [
    {
      number: "01",
      name: "Barbell Bench Press",
      muscle: "CHEST",
      sets: "5 × 5",
      rest: "120 SEC",
      load: "80 KG",
    },
    {
      number: "02",
      name: "Dumbbell Incline Press",
      muscle: "UPPER CHEST",
      sets: "4 × 8",
      rest: "90 SEC",
      load: "28 KG",
    },
    {
      number: "03",
      name: "Seated Shoulder Press",
      muscle: "SHOULDERS",
      sets: "4 × 8",
      rest: "90 SEC",
      load: "24 KG",
    },
    {
      number: "04",
      name: "Cable Lateral Raise",
      muscle: "SIDE DELTS",
      sets: "3 × 12",
      rest: "60 SEC",
      load: "12 KG",
    },
    {
      number: "05",
      name: "Weighted Dips",
      muscle: "TRICEPS",
      sets: "3 × MAX",
      rest: "90 SEC",
      load: "BW + 10 KG",
    },
    {
      number: "06",
      name: "Rope Tricep Pushdown",
      muscle: "TRICEPS",
      sets: "3 × 12",
      rest: "60 SEC",
      load: "32 KG",
    },
  ];

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="workout-plans"
      />

      <main className="plan-details-main">

        {/* HEADER */}

        <header className="plan-details-header">

          <button
            className="plan-back-button"
            onClick={() => navigate("workout-plans")}
          >
            <ArrowLeft size={16} />
            BACK TO WORKOUT PLANS
          </button>

        </header>


        {/* HERO */}

        <section className="plan-detail-hero">

          <div className="plan-detail-content">

            <div className="plan-detail-label">
              <Dumbbell size={14} />
              STRENGTH PROGRAM
            </div>

            <div className="plan-detail-tags">
              <span>INTERMEDIATE</span>
              <span>UPPER BODY</span>
              <span>8.5 RPE</span>
            </div>

            <h1>
              UPPER PUSH
              <br />
              <span>POWER</span>
            </h1>

            <p>
              A high-intensity upper-body strength protocol designed
              to build pressing power, muscular strength and training
              capacity.
            </p>

            <div className="plan-detail-actions">

              <button
                className="plan-start-button"
                onClick={() => navigate("workout-tracking")}
              >
                START WORKOUT
                <ArrowRight size={17} />
              </button>

              <button
                className="plan-library-button"
                onClick={() => navigate("exercise-library")}
              >
                EXERCISE LIBRARY
              </button>

            </div>

          </div>


          <div className="plan-detail-visual">

            <div className="plan-visual-ring ring-one">
              <div className="plan-visual-ring ring-two">
                <Dumbbell size={82} strokeWidth={0.8} />
              </div>
            </div>

            <div className="plan-visual-label">
              <span>PROGRAM LOAD</span>
              <strong>HIGH</strong>
            </div>

          </div>

        </section>


        {/* PROGRAM STATS */}

        <section className="plan-detail-stats">

          <div className="plan-stat-card">
            <Clock3 size={18} />
            <span>DURATION</span>
            <strong>52 MIN</strong>
          </div>

          <div className="plan-stat-card">
            <Flame size={18} />
            <span>CALORIES</span>
            <strong>486 KCAL</strong>
          </div>

          <div className="plan-stat-card">
            <Target size={18} />
            <span>EXERCISES</span>
            <strong>08</strong>
          </div>

          <div className="plan-stat-card">
            <HeartPulse size={18} />
            <span>AVG HEART RATE</span>
            <strong>142 BPM</strong>
          </div>

        </section>


        {/* EXERCISES */}

        <section className="plan-exercises-section">

          <div className="plan-section-heading">

            <div>
              <p>TRAINING PROTOCOL</p>
              <h2>SESSION EXERCISES</h2>
            </div>

            <span>06 MOVEMENTS</span>

          </div>


          <div className="plan-exercise-list">

            {exercises.map((exercise) => (

              <button
                className="plan-exercise-row"
                key={exercise.number}
                onClick={() => navigate("exercise-details")}
              >

                <div className="plan-exercise-number">
                  {exercise.number}
                </div>

                <div className="plan-exercise-name">
                  <span>{exercise.muscle}</span>
                  <strong>{exercise.name}</strong>
                </div>

                <div className="plan-exercise-stat">
                  <span>SETS × REPS</span>
                  <strong>{exercise.sets}</strong>
                </div>

                <div className="plan-exercise-stat">
                  <span>REST</span>
                  <strong>{exercise.rest}</strong>
                </div>

                <div className="plan-exercise-stat">
                  <span>LOAD</span>
                  <strong>{exercise.load}</strong>
                </div>

                <ArrowRight
                  size={16}
                  className="plan-exercise-arrow"
                />

              </button>

            ))}

          </div>

        </section>


        {/* TRAINING NOTES */}

        <section className="plan-notes-grid">

          <div className="plan-note-card">

            <div className="plan-note-icon">
              <Zap size={18} />
            </div>

            <div>
              <p>TRAINING INTENSITY</p>
              <h3>HIGH PERFORMANCE LOAD</h3>
              <span>
                Maintain an RPE target of 8–8.5 across the main
                working sets.
              </span>
            </div>

          </div>


          <div className="plan-note-card">

            <div className="plan-note-icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p>SESSION FOCUS</p>
              <h3>CONTROLLED PROGRESSION</h3>
              <span>
                Prioritize clean technique, controlled repetitions
                and consistent rest periods.
              </span>
            </div>

          </div>

        </section>


        {/* FINAL CTA */}

        <section className="plan-final-cta">

          <div>
            <p>READY TO TRAIN?</p>

            <h2>
              START YOUR
              <span> PUSH SESSION.</span>
            </h2>

            <span>
              Track every set, rep and performance metric in real time.
            </span>
          </div>

          <button
            onClick={() => navigate("workout-tracking")}
          >
            START ACTIVE SESSION
            <ArrowRight size={16} />
          </button>

        </section>

      </main>
    </div>
  );
}

export default PlanDetails;