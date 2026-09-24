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
  const storedPlan = (() => {
    try {
      const savedPlan = localStorage.getItem(
        "fitpulse_selected_plan"
      );

      return savedPlan
        ? JSON.parse(savedPlan)
        : null;
    } catch (error) {
      console.error(
        "SELECTED PLAN LOAD ERROR:",
        error
      );

      return null;
    }
  })();

  const plan = storedPlan || {
    id: "upper-push-power",
    title: "UPPER PUSH POWER",
    category: "STRENGTH",
    level: "INTERMEDIATE",
    duration: "52 MIN",
    calories: "486 KCAL",
    exercises: "08 EXERCISES",
    rpe: "8.5",
    description:
      "Build upper-body strength with a focused push training protocol.",
    focus:
      "Chest, shoulders and triceps.",
  };

  const planData = {
    "upper-push-power": {
      tags: [
        plan.level || "INTERMEDIATE",
        "UPPER BODY",
        `${plan.rpe || "8.5"} RPE`,
      ],

      programLabel: "STRENGTH PROGRAM",

      titleTop: "UPPER PUSH",
      titleBottom: "POWER",

      description:
        "A high-intensity upper-body strength protocol designed to build pressing power, muscular strength and training capacity.",

      load: "HIGH",

      heartRate: "142 BPM",

      movementCount: "06 MOVEMENTS",

      exercises: [
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
      ],

      intensityTitle:
        "HIGH PERFORMANCE LOAD",

      intensityText:
        "Maintain an RPE target of 8–8.5 across the main working sets.",

      focusTitle:
        "CONTROLLED PROGRESSION",

      focusText:
        "Prioritize clean technique, controlled repetitions and consistent rest periods.",
    },

    "lower-body-strength": {
      tags: [
        plan.level || "ADVANCED",
        "LOWER BODY",
        `${plan.rpe || "9.0"} RPE`,
      ],

      programLabel: "STRENGTH PROGRAM",

      titleTop: "LOWER BODY",
      titleBottom: "STRENGTH",

      description:
        "A high-load lower-body strength session designed to build power, stability and muscular strength.",

      load: "VERY HIGH",

      heartRate: "148 BPM",

      movementCount: "06 MOVEMENTS",

      exercises: [
        {
          number: "01",
          name: "Barbell Back Squat",
          muscle: "QUADS",
          sets: "5 × 5",
          rest: "150 SEC",
          load: "100 KG",
        },
        {
          number: "02",
          name: "Romanian Deadlift",
          muscle: "HAMSTRINGS",
          sets: "4 × 8",
          rest: "120 SEC",
          load: "90 KG",
        },
        {
          number: "03",
          name: "Leg Press",
          muscle: "QUADS",
          sets: "4 × 10",
          rest: "90 SEC",
          load: "180 KG",
        },
        {
          number: "04",
          name: "Walking Lunges",
          muscle: "GLUTES",
          sets: "3 × 12",
          rest: "90 SEC",
          load: "24 KG",
        },
        {
          number: "05",
          name: "Leg Curl",
          muscle: "HAMSTRINGS",
          sets: "3 × 12",
          rest: "60 SEC",
          load: "45 KG",
        },
        {
          number: "06",
          name: "Standing Calf Raise",
          muscle: "CALVES",
          sets: "4 × 15",
          rest: "60 SEC",
          load: "70 KG",
        },
      ],

      intensityTitle:
        "MAXIMUM STRENGTH LOAD",

      intensityText:
        "Keep the main compound movements heavy while maintaining strict technique.",

      focusTitle:
        "LOWER BODY POWER",

      focusText:
        "Prioritize controlled eccentric movement and stable positioning.",
    },

    "conditioning-protocol": {
      tags: [
        plan.level || "INTERMEDIATE",
        "CARDIO",
        `${plan.rpe || "8.0"} RPE`,
      ],

      programLabel: "CARDIO PROGRAM",

      titleTop: "CONDITIONING",
      titleBottom: "PROTOCOL",

      description:
        "A high-intensity conditioning session designed to improve cardiovascular capacity and endurance.",

      load: "HIGH",

      heartRate: "156 BPM",

      movementCount: "06 MOVEMENTS",

      exercises: [
        {
          number: "01",
          name: "Treadmill Sprint",
          muscle: "CARDIO",
          sets: "5 × 60 SEC",
          rest: "60 SEC",
          load: "HIGH SPEED",
        },
        {
          number: "02",
          name: "Rowing Intervals",
          muscle: "FULL BODY",
          sets: "4 × 500 M",
          rest: "90 SEC",
          load: "HIGH",
        },
        {
          number: "03",
          name: "Battle Rope",
          muscle: "UPPER BODY",
          sets: "4 × 45 SEC",
          rest: "60 SEC",
          load: "HIGH",
        },
        {
          number: "04",
          name: "Burpees",
          muscle: "FULL BODY",
          sets: "3 × 15",
          rest: "60 SEC",
          load: "BODYWEIGHT",
        },
        {
          number: "05",
          name: "Mountain Climbers",
          muscle: "CORE",
          sets: "3 × 30 SEC",
          rest: "45 SEC",
          load: "BODYWEIGHT",
        },
        {
          number: "06",
          name: "Bike Sprint",
          muscle: "LEGS",
          sets: "5 × 45 SEC",
          rest: "60 SEC",
          load: "HIGH",
        },
      ],

      intensityTitle:
        "HIGH INTENSITY CONDITIONING",

      intensityText:
        "Maintain controlled breathing while keeping the effort inside the target heart-rate zone.",

      focusTitle:
        "CARDIO CAPACITY",

      focusText:
        "Focus on consistent pacing and strong recovery between intervals.",
    },

    "pull-strength": {
      tags: [
        plan.level || "INTERMEDIATE",
        "PULL",
        `${plan.rpe || "8.5"} RPE`,
      ],

      programLabel: "STRENGTH PROGRAM",

      titleTop: "PULL",
      titleBottom: "STRENGTH",

      description:
        "A progressive pulling session focused on developing back, biceps and rear-delt strength.",

      load: "HIGH",

      heartRate: "144 BPM",

      movementCount: "06 MOVEMENTS",

      exercises: [
        {
          number: "01",
          name: "Barbell Deadlift",
          muscle: "BACK",
          sets: "5 × 5",
          rest: "150 SEC",
          load: "120 KG",
        },
        {
          number: "02",
          name: "Lat Pulldown",
          muscle: "LATS",
          sets: "4 × 8",
          rest: "90 SEC",
          load: "65 KG",
        },
        {
          number: "03",
          name: "Seated Cable Row",
          muscle: "MID BACK",
          sets: "4 × 10",
          rest: "90 SEC",
          load: "60 KG",
        },
        {
          number: "04",
          name: "Face Pull",
          muscle: "REAR DELTS",
          sets: "3 × 12",
          rest: "60 SEC",
          load: "24 KG",
        },
        {
          number: "05",
          name: "EZ Bar Curl",
          muscle: "BICEPS",
          sets: "3 × 10",
          rest: "60 SEC",
          load: "30 KG",
        },
        {
          number: "06",
          name: "Hammer Curl",
          muscle: "BICEPS",
          sets: "3 × 12",
          rest: "60 SEC",
          load: "16 KG",
        },
      ],

      intensityTitle:
        "PROGRESSIVE PULL LOAD",

      intensityText:
        "Keep the primary pulling movements controlled with a strong contraction.",

      focusTitle:
        "BACK DEVELOPMENT",

      focusText:
        "Prioritize full range of motion and controlled eccentric repetitions.",
    },

    "athletic-performance": {
      tags: [
        plan.level || "ADVANCED",
        "PERFORMANCE",
        `${plan.rpe || "8.8"} RPE`,
      ],

      programLabel: "PERFORMANCE PROGRAM",

      titleTop: "ATHLETIC",
      titleBottom: "PERFORMANCE",

      description:
        "Explosive movements and athletic drills designed to improve power, speed and movement efficiency.",

      load: "VERY HIGH",

      heartRate: "162 BPM",

      movementCount: "06 MOVEMENTS",

      exercises: [
        {
          number: "01",
          name: "Box Jump",
          muscle: "LOWER BODY",
          sets: "4 × 8",
          rest: "90 SEC",
          load: "BODYWEIGHT",
        },
        {
          number: "02",
          name: "Medicine Ball Slam",
          muscle: "FULL BODY",
          sets: "4 × 10",
          rest: "60 SEC",
          load: "12 KG",
        },
        {
          number: "03",
          name: "Kettlebell Swing",
          muscle: "POSTERIOR CHAIN",
          sets: "4 × 12",
          rest: "60 SEC",
          load: "24 KG",
        },
        {
          number: "04",
          name: "Sled Push",
          muscle: "LEGS",
          sets: "5 × 20 M",
          rest: "90 SEC",
          load: "80 KG",
        },
        {
          number: "05",
          name: "Battle Rope Sprint",
          muscle: "FULL BODY",
          sets: "4 × 30 SEC",
          rest: "60 SEC",
          load: "HIGH",
        },
        {
          number: "06",
          name: "Agility Ladder",
          muscle: "FOOTWORK",
          sets: "5 × 45 SEC",
          rest: "45 SEC",
          load: "BODYWEIGHT",
        },
      ],

      intensityTitle:
        "EXPLOSIVE PERFORMANCE LOAD",

      intensityText:
        "Perform every movement with maximum intent while maintaining safe landing and movement mechanics.",

      focusTitle:
        "POWER & SPEED",

      focusText:
        "Keep repetitions explosive and prioritize movement quality over fatigue.",
    },

    "recovery-flow": {
      tags: [
        plan.level || "BEGINNER",
        "RECOVERY",
        `${plan.rpe || "5.0"} RPE`,
      ],

      programLabel: "RECOVERY PROGRAM",

      titleTop: "RECOVERY",
      titleBottom: "FLOW",

      description:
        "A low-intensity mobility session designed to improve flexibility, movement quality and recovery readiness.",

      load: "LOW",

      heartRate: "108 BPM",

      movementCount: "06 MOVEMENTS",

      exercises: [
        {
          number: "01",
          name: "Cat Cow Stretch",
          muscle: "SPINE",
          sets: "3 × 10",
          rest: "30 SEC",
          load: "BODYWEIGHT",
        },
        {
          number: "02",
          name: "World's Greatest Stretch",
          muscle: "FULL BODY",
          sets: "3 × 8",
          rest: "30 SEC",
          load: "BODYWEIGHT",
        },
        {
          number: "03",
          name: "Hip Flexor Stretch",
          muscle: "HIPS",
          sets: "3 × 45 SEC",
          rest: "30 SEC",
          load: "BODYWEIGHT",
        },
        {
          number: "04",
          name: "Hamstring Stretch",
          muscle: "HAMSTRINGS",
          sets: "3 × 45 SEC",
          rest: "30 SEC",
          load: "BODYWEIGHT",
        },
        {
          number: "05",
          name: "Shoulder Mobility",
          muscle: "SHOULDERS",
          sets: "3 × 10",
          rest: "30 SEC",
          load: "BODYWEIGHT",
        },
        {
          number: "06",
          name: "Deep Breathing",
          muscle: "RECOVERY",
          sets: "5 × 60 SEC",
          rest: "30 SEC",
          load: "LOW",
        },
      ],

      intensityTitle:
        "LOW RECOVERY LOAD",

      intensityText:
        "Keep the session comfortable and avoid pushing into painful ranges of motion.",

      focusTitle:
        "MOBILITY & RECOVERY",

      focusText:
        "Move slowly, breathe consistently and focus on improving movement quality.",
    },
  };

  const details =
    planData[plan.id] ||
    planData["upper-push-power"];

  const handleExerciseClick = (exercise) => {
    localStorage.setItem(
      "fitpulse_selected_exercise",
      JSON.stringify(exercise)
    );

    navigate("exercise-details");
  };

  const handleStartWorkout = () => {
    navigate("workout-tracking");
  };

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
            onClick={() =>
              navigate("workout-plans")
            }
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

              {details.programLabel}

            </div>


            <div className="plan-detail-tags">

              {details.tags.map((tag) => (
                <span key={tag}>
                  {tag}
                </span>
              ))}

            </div>


            <h1>

              {details.titleTop}

              <br />

              <span>
                {details.titleBottom}
              </span>

            </h1>


            <p>
              {details.description}
            </p>


            <div className="plan-detail-actions">

              <button
                className="plan-start-button"
                onClick={handleStartWorkout}
              >
                START WORKOUT

                <ArrowRight size={17} />

              </button>


              <button
                className="plan-library-button"
                onClick={() =>
                  navigate("exercise-library")
                }
              >
                EXERCISE LIBRARY
              </button>

            </div>

          </div>


          <div className="plan-detail-visual">

            <div className="plan-visual-ring ring-one">

              <div className="plan-visual-ring ring-two">

                <Dumbbell
                  size={82}
                  strokeWidth={0.8}
                />

              </div>

            </div>


            <div className="plan-visual-label">

              <span>
                PROGRAM LOAD
              </span>

              <strong>
                {details.load}
              </strong>

            </div>

          </div>

        </section>


        {/* PROGRAM STATS */}

        <section className="plan-detail-stats">

          <div className="plan-stat-card">

            <Clock3 size={18} />

            <span>
              DURATION
            </span>

            <strong>
              {plan.duration}
            </strong>

          </div>


          <div className="plan-stat-card">

            <Flame size={18} />

            <span>
              CALORIES
            </span>

            <strong>
              {plan.calories}
            </strong>

          </div>


          <div className="plan-stat-card">

            <Target size={18} />

            <span>
              EXERCISES
            </span>

            <strong>
              {details.exercises.length
                .toString()
                .padStart(2, "0")}
            </strong>

          </div>


          <div className="plan-stat-card">

            <HeartPulse size={18} />

            <span>
              AVG HEART RATE
            </span>

            <strong>
              {details.heartRate}
            </strong>

          </div>

        </section>


        {/* EXERCISES */}

        <section className="plan-exercises-section">

          <div className="plan-section-heading">

            <div>

              <p>
                TRAINING PROTOCOL
              </p>

              <h2>
                SESSION EXERCISES
              </h2>

            </div>


            <span>
              {details.movementCount}
            </span>

          </div>


          <div className="plan-exercise-list">

            {details.exercises.map(
              (exercise) => (

                <button
                  className="plan-exercise-row"
                  key={exercise.number}
                  onClick={() =>
                    handleExerciseClick(
                      exercise
                    )
                  }
                >

                  <div className="plan-exercise-number">
                    {exercise.number}
                  </div>


                  <div className="plan-exercise-name">

                    <span>
                      {exercise.muscle}
                    </span>

                    <strong>
                      {exercise.name}
                    </strong>

                  </div>


                  <div className="plan-exercise-stat">

                    <span>
                      SETS × REPS
                    </span>

                    <strong>
                      {exercise.sets}
                    </strong>

                  </div>


                  <div className="plan-exercise-stat">

                    <span>
                      REST
                    </span>

                    <strong>
                      {exercise.rest}
                    </strong>

                  </div>


                  <div className="plan-exercise-stat">

                    <span>
                      LOAD
                    </span>

                    <strong>
                      {exercise.load}
                    </strong>

                  </div>


                  <ArrowRight
                    size={16}
                    className="plan-exercise-arrow"
                  />

                </button>

              )
            )}

          </div>

        </section>


        {/* TRAINING NOTES */}

        <section className="plan-notes-grid">

          <div className="plan-note-card">

            <div className="plan-note-icon">

              <Zap size={18} />

            </div>


            <div>

              <p>
                TRAINING INTENSITY
              </p>

              <h3>
                {details.intensityTitle}
              </h3>

              <span>
                {details.intensityText}
              </span>

            </div>

          </div>


          <div className="plan-note-card">

            <div className="plan-note-icon">

              <CheckCircle2 size={18} />

            </div>


            <div>

              <p>
                SESSION FOCUS
              </p>

              <h3>
                {details.focusTitle}
              </h3>

              <span>
                {details.focusText}
              </span>

            </div>

          </div>

        </section>


        {/* FINAL CTA */}

        <section className="plan-final-cta">

          <div>

            <p>
              READY TO TRAIN?
            </p>

            <h2>

              START YOUR

              <span>
                {" "}
                {details.titleBottom}
                {" "}
                SESSION.
              </span>

            </h2>

            <span>
              Track every set, rep and performance
              metric in real time.
            </span>

          </div>


          <button
            onClick={handleStartWorkout}
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