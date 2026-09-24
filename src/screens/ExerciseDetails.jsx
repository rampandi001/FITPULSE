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

  const selectedExercise = (() => {
    try {
      const savedExercise = localStorage.getItem(
        "fitpulse_selected_exercise"
      );

      return savedExercise
        ? JSON.parse(savedExercise)
        : null;
    } catch (error) {
      console.error(
        "SELECTED EXERCISE LOAD ERROR:",
        error
      );

      return null;
    }
  })();

  const exercise =
    selectedExercise || {
      number: "01",
      name: "Barbell Bench Press",
      muscle: "CHEST",
      sets: "5 × 5",
      rest: "120 SEC",
      load: "80 KG",
    };

  const exerciseDatabase = {
    "Barbell Bench Press": {
      difficulty: "INTERMEDIATE",
      equipment: "BARBELL",
      movement: "PUSH",
      description:
        "A fundamental upper-body pressing movement focused on developing chest strength, triceps power and overall pressing performance.",
      calories: "86 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Position yourself on the bench with your feet firmly planted on the floor.",
        "Grip the bar slightly wider than shoulder width and keep your wrists stable.",
        "Lower the bar toward the middle of your chest with controlled movement.",
        "Drive the bar upward while keeping your shoulder blades retracted.",
      ],

      tips: [
        "Keep your shoulder blades retracted throughout the set.",
        "Maintain controlled movement during the lowering phase.",
        "Avoid bouncing the bar off your chest.",
        "Keep your feet stable and firmly planted.",
      ],
    },

    "Dumbbell Incline Press": {
      difficulty: "INTERMEDIATE",
      equipment: "DUMBBELLS",
      movement: "PUSH",
      description:
        "An upper-chest pressing movement that builds strength and muscular development through a controlled incline pressing pattern.",
      calories: "74 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Set the bench to a moderate incline and sit with a dumbbell in each hand.",
        "Position the dumbbells near your upper chest with your elbows slightly below the bench line.",
        "Press both dumbbells upward while maintaining a stable shoulder position.",
        "Lower the dumbbells slowly until you feel a controlled stretch through the upper chest.",
      ],

      tips: [
        "Keep your upper back firmly supported by the bench.",
        "Do not allow the dumbbells to drift too far forward.",
        "Use a controlled lowering phase on every repetition.",
        "Keep your wrists neutral throughout the movement.",
      ],
    },

    "Seated Shoulder Press": {
      difficulty: "INTERMEDIATE",
      equipment: "DUMBBELLS",
      movement: "PUSH",
      description:
        "A vertical pressing movement designed to develop shoulder strength, stability and overhead pressing performance.",
      calories: "68 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Sit upright with your back supported and hold the dumbbells at shoulder height.",
        "Brace your core and keep your feet firmly planted on the floor.",
        "Press the dumbbells upward until your arms are almost fully extended.",
        "Lower the dumbbells under control back to shoulder level.",
      ],

      tips: [
        "Keep your core tight throughout the movement.",
        "Avoid excessive arching through the lower back.",
        "Press in a smooth and controlled path.",
        "Do not lock out the elbows aggressively.",
      ],
    },

    "Cable Lateral Raise": {
      difficulty: "INTERMEDIATE",
      equipment: "CABLE",
      movement: "ISOLATION",
      description:
        "A controlled shoulder isolation movement targeting the lateral deltoids for improved shoulder width and stability.",
      calories: "42 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Stand beside the cable machine and hold the handle with the outside hand.",
        "Keep your torso stable and maintain a slight bend in your elbow.",
        "Raise your arm outward until it reaches approximately shoulder height.",
        "Lower the handle slowly while keeping tension on the lateral deltoid.",
      ],

      tips: [
        "Avoid swinging your body to move the weight.",
        "Keep the movement controlled throughout the full range.",
        "Lead with the elbow rather than the hand.",
        "Use a lighter load if you cannot maintain strict form.",
      ],
    },

    "Weighted Dips": {
      difficulty: "ADVANCED",
      equipment: "DIP STATION",
      movement: "PUSH",
      description:
        "A demanding bodyweight pressing movement that develops the triceps, chest and overall upper-body pressing strength.",
      calories: "78 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Secure the additional weight and position yourself between the parallel bars.",
        "Start with your arms extended and your shoulders controlled.",
        "Lower your body by bending your elbows while maintaining a stable torso.",
        "Drive through your hands to return to the starting position.",
      ],

      tips: [
        "Keep your shoulders controlled throughout the movement.",
        "Avoid dropping too quickly into the bottom position.",
        "Maintain a stable core while performing each repetition.",
        "Stop the range of motion if shoulder discomfort appears.",
      ],
    },

    "Rope Tricep Pushdown": {
      difficulty: "INTERMEDIATE",
      equipment: "CABLE",
      movement: "ISOLATION",
      description:
        "A focused triceps isolation movement using a cable and rope attachment to build pressing strength and arm development.",
      calories: "48 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Attach the rope to the high cable and grip both ends firmly.",
        "Keep your elbows close to your sides and brace your core.",
        "Push the rope downward until your arms are fully extended.",
        "Return the rope upward under control without allowing the elbows to move forward.",
      ],

      tips: [
        "Keep your elbows fixed beside your torso.",
        "Avoid using momentum from your shoulders.",
        "Squeeze the triceps at the bottom of every repetition.",
        "Use controlled tempo during the return phase.",
      ],
    },

    "Barbell Back Squat": {
      difficulty: "ADVANCED",
      equipment: "BARBELL",
      movement: "SQUAT",
      description:
        "A foundational lower-body strength movement targeting the quads, glutes and posterior chain.",
      calories: "112 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Position the bar securely across your upper back and brace your core.",
        "Stand with your feet approximately shoulder width apart.",
        "Lower your hips while keeping your knees aligned with your toes.",
        "Drive through the floor to return to the standing position.",
      ],

      tips: [
        "Keep your chest controlled throughout the movement.",
        "Maintain stable knee tracking.",
        "Brace your core before every repetition.",
        "Avoid losing balance at the bottom position.",
      ],
    },

    "Romanian Deadlift": {
      difficulty: "INTERMEDIATE",
      equipment: "BARBELL",
      movement: "HINGE",
      description:
        "A posterior-chain movement that develops the hamstrings, glutes and lower-back strength through controlled hip hinging.",
      calories: "96 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Stand tall while holding the barbell close to your thighs.",
        "Push your hips backward while maintaining a neutral spine.",
        "Lower the bar until you feel a strong hamstring stretch.",
        "Drive your hips forward to return to the starting position.",
      ],

      tips: [
        "Keep the bar close to your legs.",
        "Do not round your lower back.",
        "Focus on moving through the hips.",
        "Keep the movement slow and controlled.",
      ],
    },

    "Leg Press": {
      difficulty: "INTERMEDIATE",
      equipment: "LEG PRESS",
      movement: "PUSH",
      description:
        "A machine-based lower-body movement designed to build quad and glute strength with controlled resistance.",
      calories: "104 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Place your feet securely on the platform at approximately shoulder width.",
        "Release the safety mechanism and brace your core.",
        "Lower the platform under control while keeping your knees aligned.",
        "Press through your feet to return the platform without locking your knees aggressively.",
      ],

      tips: [
        "Keep your lower back supported against the pad.",
        "Maintain stable foot positioning.",
        "Control the depth of every repetition.",
        "Avoid locking the knees aggressively at the top.",
      ],
    },

    "Walking Lunges": {
      difficulty: "INTERMEDIATE",
      equipment: "DUMBBELLS",
      movement: "LUNGE",
      description:
        "A unilateral lower-body movement that develops leg strength, balance and coordination.",
      calories: "82 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Stand tall while holding a dumbbell in each hand.",
        "Step forward and lower your rear knee toward the floor.",
        "Push through the front foot to return to standing.",
        "Continue forward while alternating legs.",
      ],

      tips: [
        "Keep your torso upright.",
        "Maintain controlled knee tracking.",
        "Use a consistent stride length.",
        "Avoid rushing between repetitions.",
      ],
    },

    "Leg Curl": {
      difficulty: "BEGINNER",
      equipment: "MACHINE",
      movement: "ISOLATION",
      description:
        "A hamstring isolation exercise that develops knee-flexion strength through controlled machine resistance.",
      calories: "52 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Position your legs correctly against the machine pads.",
        "Brace your body against the support pad.",
        "Curl your heels toward your body under control.",
        "Slowly return your legs to the starting position.",
      ],

      tips: [
        "Keep your hips stable against the pad.",
        "Avoid using momentum.",
        "Squeeze the hamstrings at the top.",
        "Control the return phase.",
      ],
    },

    "Standing Calf Raise": {
      difficulty: "BEGINNER",
      equipment: "MACHINE",
      movement: "CALF RAISE",
      description:
        "A focused calf exercise designed to improve lower-leg strength and muscular endurance.",
      calories: "38 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Position your shoulders securely under the machine pads.",
        "Place the balls of your feet firmly on the platform.",
        "Raise your heels while keeping your knees controlled.",
        "Lower your heels slowly to achieve a full stretch.",
      ],

      tips: [
        "Use a full range of motion.",
        "Avoid bouncing at the bottom.",
        "Pause briefly at the top.",
        "Keep your movement controlled.",
      ],
    },

    "Treadmill Sprint": {
      difficulty: "INTERMEDIATE",
      equipment: "TREADMILL",
      movement: "CARDIO",
      description:
        "A high-intensity running interval designed to improve speed, cardiovascular capacity and conditioning.",
      calories: "96 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Begin with a controlled warm-up pace.",
        "Increase the treadmill speed to your target sprint pace.",
        "Maintain an upright posture while driving your arms.",
        "Reduce the speed gradually during the recovery interval.",
      ],

      tips: [
        "Build speed progressively.",
        "Keep your posture upright.",
        "Stay focused on controlled breathing.",
        "Never sprint without an adequate warm-up.",
      ],
    },

    "Rowing Intervals": {
      difficulty: "INTERMEDIATE",
      equipment: "ROWER",
      movement: "CARDIO",
      description:
        "A full-body rowing interval that develops cardiovascular capacity and muscular endurance.",
      calories: "91 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Secure your feet and sit tall on the rowing machine.",
        "Drive through your legs before extending your hips.",
        "Pull the handle toward your lower chest.",
        "Return the handle smoothly while resetting your body position.",
      ],

      tips: [
        "Drive with the legs first.",
        "Keep your back neutral.",
        "Maintain a consistent rhythm.",
        "Avoid pulling only with your arms.",
      ],
    },

    "Battle Rope": {
      difficulty: "INTERMEDIATE",
      equipment: "BATTLE ROPE",
      movement: "CONDITIONING",
      description:
        "A high-intensity upper-body conditioning movement designed to improve endurance and work capacity.",
      calories: "72 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Stand with your feet stable and hold one rope end in each hand.",
        "Brace your core and slightly bend your knees.",
        "Create alternating waves with your arms.",
        "Maintain a consistent pace throughout the interval.",
      ],

      tips: [
        "Keep your core braced.",
        "Avoid excessive shoulder elevation.",
        "Maintain a steady breathing pattern.",
        "Use consistent rope waves.",
      ],
    },

    "Burpees": {
      difficulty: "INTERMEDIATE",
      equipment: "BODYWEIGHT",
      movement: "FULL BODY",
      description:
        "A full-body conditioning movement combining a squat, plank and explosive jump.",
      calories: "65 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Stand tall with your feet approximately shoulder width apart.",
        "Lower into a squat and place your hands on the floor.",
        "Jump or step your feet back into a plank position.",
        "Return to standing and finish with a controlled jump.",
      ],

      tips: [
        "Keep your core tight.",
        "Land softly after the jump.",
        "Maintain a steady rhythm.",
        "Modify the movement if fatigue affects technique.",
      ],
    },

    "Mountain Climbers": {
      difficulty: "INTERMEDIATE",
      equipment: "BODYWEIGHT",
      movement: "CORE",
      description:
        "A dynamic bodyweight conditioning movement targeting the core while increasing cardiovascular demand.",
      calories: "58 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Start in a strong high-plank position.",
        "Drive one knee toward your chest.",
        "Return that leg while bringing the opposite knee forward.",
        "Continue alternating while keeping the hips controlled.",
      ],

      tips: [
        "Keep your shoulders stacked over your hands.",
        "Avoid excessive hip movement.",
        "Maintain a steady pace.",
        "Keep your core engaged throughout.",
      ],
    },

    "Bike Sprint": {
      difficulty: "INTERMEDIATE",
      equipment: "BIKE",
      movement: "CARDIO",
      description:
        "A high-output cycling interval designed to improve cardiovascular fitness and lower-body endurance.",
      calories: "88 KCAL",
      video: "/videos/bench-press-demo.mp4",
      image: "/images/bench-press.jpg",

      instructions: [
        "Adjust the bike seat and resistance to a comfortable position.",
        "Begin with a controlled warm-up pace.",
        "Increase resistance and cadence for the sprint interval.",
        "Reduce intensity gradually during recovery.",
      ],

      tips: [
        "Keep your posture stable.",
        "Maintain controlled breathing.",
        "Build intensity progressively.",
        "Recover fully before the next sprint.",
      ],
    },
  };

  const details =
    exerciseDatabase[exercise.name] ||
    exerciseDatabase["Barbell Bench Press"];

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
              navigate("plan-details")
            }
          >
            <ArrowLeft size={16} />
            BACK TO PLAN
          </button>

        </header>


        {/* HERO */}

        <section className="exercise-detail-hero">

          <div className="exercise-detail-visual">

            <div className="exercise-image-container">

              <img
                src={details.image}
                alt={exercise.name}
              />

              <div className="exercise-image-overlay" />

              <div className="exercise-image-label">

                <span>
                  EXERCISE {exercise.number}
                </span>

                <strong>
                  {exercise.muscle} ·{" "}
                  {details.movement}
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
                {exercise.muscle}
              </span>

              <span>
                {details.difficulty}
              </span>

              <span>
                {details.equipment}
              </span>

            </div>


            <p className="exercise-detail-kicker">
              STRENGTH MOVEMENT
            </p>


            <h1>

              {exercise.name
                .split(" ")
                .slice(0, -1)
                .join(" ")}

              <br />

              <span>
                {exercise.name
                  .split(" ")
                  .slice(-1)
                  .join(" ")}
              </span>

            </h1>


            <p className="exercise-detail-description">
              {details.description}
            </p>


            <div className="exercise-detail-stats">

              <div>

                <Target size={17} />

                <span>
                  PRIMARY MUSCLE
                </span>

                <strong>
                  {exercise.muscle}
                </strong>

              </div>


              <div>

                <Dumbbell size={17} />

                <span>
                  EQUIPMENT
                </span>

                <strong>
                  {details.equipment}
                </strong>

              </div>


              <div>

                <HeartPulse size={17} />

                <span>
                  DIFFICULTY
                </span>

                <strong>
                  {details.difficulty}
                </strong>

              </div>


              <div>

                <Zap size={17} />

                <span>
                  MOVEMENT
                </span>

                <strong>
                  {details.movement}
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
              {exercise.load}
            </strong>

            <small>
              Based on your current plan
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
              {exercise.sets}
            </strong>

            <small>
              Current training protocol
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
              {exercise.rest}
            </strong>

            <small>
              Between working sets
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
              {details.calories}
            </strong>

            <small>
              Per training session
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
              {details.instructions.length
                .toString()
                .padStart(2, "0")}{" "}
              STEPS
            </span>

          </div>


          <div className="instruction-layout">

            <div className="instruction-list">

              {details.instructions.map(
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

                {details.tips.map(
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

                <video
                  src={details.video}
                  controls
                  autoPlay
                  playsInline
                  className="demo-video"
                >

                  Your browser does not support
                  video playback.

                </video>

              </div>


              <div className="demo-modal-info">

                <p>
                  TECHNIQUE DEMO
                </p>

                <h2>
                  {exercise.name}
                </h2>

                <span>
                  Follow controlled movement,
                  stable positioning and proper
                  breathing throughout every
                  repetition.
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