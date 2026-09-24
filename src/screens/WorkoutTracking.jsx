import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Target,
  X,
  Zap,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function WorkoutTracking({ navigate }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [completedSets, setCompletedSets] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  /*
    WORKOUT DATA
  */

  const workoutDatabase = {
    "upper-push-power": [
      {
        name: "Barbell Bench Press",
        muscle: "CHEST",
        sets: 5,
        reps: 5,
        load: "80 KG",
        rest: 120,
      },
      {
        name: "Dumbbell Incline Press",
        muscle: "UPPER CHEST",
        sets: 4,
        reps: 8,
        load: "24 KG",
        rest: 90,
      },
      {
        name: "Seated Shoulder Press",
        muscle: "SHOULDERS",
        sets: 4,
        reps: 8,
        load: "22 KG",
        rest: 90,
      },
      {
        name: "Cable Lateral Raise",
        muscle: "SIDE DELTS",
        sets: 3,
        reps: 12,
        load: "10 KG",
        rest: 60,
      },
      {
        name: "Weighted Dips",
        muscle: "TRICEPS",
        sets: 3,
        reps: 8,
        load: "15 KG",
        rest: 90,
      },
      {
        name: "Rope Tricep Pushdown",
        muscle: "TRICEPS",
        sets: 3,
        reps: 12,
        load: "25 KG",
        rest: 60,
      },
    ],

    "lower-body-strength": [
      {
        name: "Barbell Back Squat",
        muscle: "QUADS",
        sets: 5,
        reps: 5,
        load: "100 KG",
        rest: 150,
      },
      {
        name: "Romanian Deadlift",
        muscle: "HAMSTRINGS",
        sets: 4,
        reps: 8,
        load: "80 KG",
        rest: 120,
      },
      {
        name: "Leg Press",
        muscle: "QUADS",
        sets: 4,
        reps: 10,
        load: "160 KG",
        rest: 90,
      },
      {
        name: "Walking Lunges",
        muscle: "GLUTES",
        sets: 3,
        reps: 12,
        load: "20 KG",
        rest: 90,
      },
      {
        name: "Leg Curl",
        muscle: "HAMSTRINGS",
        sets: 3,
        reps: 12,
        load: "45 KG",
        rest: 60,
      },
      {
        name: "Standing Calf Raise",
        muscle: "CALVES",
        sets: 4,
        reps: 15,
        load: "60 KG",
        rest: 60,
      },
    ],

    "conditioning-protocol": [
      {
        name: "Treadmill Sprint",
        muscle: "FULL BODY",
        sets: 6,
        reps: 1,
        load: "12 KM/H",
        rest: 60,
      },
      {
        name: "Rowing Intervals",
        muscle: "FULL BODY",
        sets: 5,
        reps: 1,
        load: "HIGH",
        rest: 60,
      },
      {
        name: "Battle Rope",
        muscle: "UPPER BODY",
        sets: 4,
        reps: 30,
        load: "BODYWEIGHT",
        rest: 45,
      },
      {
        name: "Burpees",
        muscle: "FULL BODY",
        sets: 4,
        reps: 12,
        load: "BODYWEIGHT",
        rest: 45,
      },
      {
        name: "Mountain Climbers",
        muscle: "CORE",
        sets: 4,
        reps: 20,
        load: "BODYWEIGHT",
        rest: 45,
      },
      {
        name: "Bike Sprint",
        muscle: "LEGS",
        sets: 6,
        reps: 1,
        load: "HIGH",
        rest: 60,
      },
    ],

    "pull-strength": [
      {
        name: "Barbell Deadlift",
        muscle: "BACK",
        sets: 5,
        reps: 5,
        load: "110 KG",
        rest: 150,
      },
      {
        name: "Lat Pulldown",
        muscle: "LATS",
        sets: 4,
        reps: 10,
        load: "60 KG",
        rest: 90,
      },
      {
        name: "Seated Cable Row",
        muscle: "BACK",
        sets: 4,
        reps: 10,
        load: "55 KG",
        rest: 90,
      },
      {
        name: "Face Pull",
        muscle: "REAR DELTS",
        sets: 3,
        reps: 15,
        load: "20 KG",
        rest: 60,
      },
      {
        name: "EZ Bar Curl",
        muscle: "BICEPS",
        sets: 3,
        reps: 10,
        load: "30 KG",
        rest: 60,
      },
      {
        name: "Hammer Curl",
        muscle: "BICEPS",
        sets: 3,
        reps: 12,
        load: "14 KG",
        rest: 60,
      },
    ],

    "athletic-performance": [
      {
        name: "Box Jump",
        muscle: "LEGS",
        sets: 4,
        reps: 8,
        load: "BODYWEIGHT",
        rest: 60,
      },
      {
        name: "Medicine Ball Slam",
        muscle: "FULL BODY",
        sets: 4,
        reps: 12,
        load: "10 KG",
        rest: 60,
      },
      {
        name: "Kettlebell Swing",
        muscle: "POSTERIOR CHAIN",
        sets: 4,
        reps: 15,
        load: "24 KG",
        rest: 60,
      },
      {
        name: "Sled Push",
        muscle: "LEGS",
        sets: 5,
        reps: 1,
        load: "80 KG",
        rest: 90,
      },
      {
        name: "Battle Rope Sprint",
        muscle: "FULL BODY",
        sets: 4,
        reps: 30,
        load: "HIGH",
        rest: 45,
      },
      {
        name: "Agility Ladder",
        muscle: "FULL BODY",
        sets: 4,
        reps: 1,
        load: "BODYWEIGHT",
        rest: 45,
      },
    ],

    "recovery-flow": [
      {
        name: "Cat Cow Stretch",
        muscle: "SPINE",
        sets: 2,
        reps: 10,
        load: "BODYWEIGHT",
        rest: 30,
      },
      {
        name: "World's Greatest Stretch",
        muscle: "FULL BODY",
        sets: 2,
        reps: 5,
        load: "BODYWEIGHT",
        rest: 30,
      },
      {
        name: "Hip Flexor Stretch",
        muscle: "HIPS",
        sets: 2,
        reps: 30,
        load: "BODYWEIGHT",
        rest: 30,
      },
      {
        name: "Hamstring Stretch",
        muscle: "HAMSTRINGS",
        sets: 2,
        reps: 30,
        load: "BODYWEIGHT",
        rest: 30,
      },
      {
        name: "Shoulder Mobility",
        muscle: "SHOULDERS",
        sets: 2,
        reps: 10,
        load: "BODYWEIGHT",
        rest: 30,
      },
      {
        name: "Deep Breathing",
        muscle: "RECOVERY",
        sets: 3,
        reps: 10,
        load: "BODYWEIGHT",
        rest: 30,
      },
    ],
  };

  /*
    LOAD SELECTED PLAN
  */

  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem(
        "fitpulse_selected_plan"
      );

      if (savedPlan) {
        setSelectedPlan(JSON.parse(savedPlan));
      } else {
        setSelectedPlan({
          id: "upper-push-power",
          title: "UPPER PUSH POWER",
          category: "STRENGTH",
          level: "INTERMEDIATE",
          duration: "52 MIN",
          calories: "486 KCAL",
          exercises: "08 EXERCISES",
          rpe: "8.5",
        });
      }
    } catch (error) {
      console.error(
        "WORKOUT PLAN LOAD ERROR:",
        error
      );

      setSelectedPlan({
        id: "upper-push-power",
        title: "UPPER PUSH POWER",
        category: "STRENGTH",
        level: "INTERMEDIATE",
        duration: "52 MIN",
        calories: "486 KCAL",
        exercises: "08 EXERCISES",
        rpe: "8.5",
      });
    }
  }, []);

  /*
    CURRENT WORKOUT
  */

  const exercises = useMemo(() => {
    if (!selectedPlan) {
      return [];
    }

    return (
      workoutDatabase[selectedPlan.id] ||
      workoutDatabase["upper-push-power"]
    );
  }, [selectedPlan]);

  const current = exercises[currentExercise];

  /*
    TIMER
  */

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setSeconds((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  /*
    TIMER FORMAT
  */

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const secs = totalSeconds % 60;

    return [
      hours,
      minutes,
      secs,
    ]
      .map((value) =>
        String(value).padStart(2, "0")
      )
      .join(":");
  };

  /*
    TOTAL SETS
  */

  const totalSets = exercises.reduce(
    (total, item) => total + item.sets,
    0
  );

  const completedSetCount =
    Object.values(completedSets).reduce(
      (total, sets) =>
        total + sets.length,
      0
    );

  const progress =
    totalSets > 0
      ? Math.round(
          (completedSetCount / totalSets) * 100
        )
      : 0;

  /*
    CALORIE ESTIMATE
  */

  const estimatedCalories = Math.round(
    (seconds / 60) * 8.4
  );

  /*
    COMPLETE SET
  */

  const completeSet = (
    exerciseIndex,
    setIndex
  ) => {
    setCompletedSets((previous) => {
      const currentSets =
        previous[exerciseIndex] || [];

      if (currentSets.includes(setIndex)) {
        return previous;
      }

      return {
        ...previous,
        [exerciseIndex]: [
          ...currentSets,
          setIndex,
        ],
      };
    });

    setIsRunning(true);
  };

  /*
    COMPLETE EXERCISE
  */

  const completeExercise = (
    exerciseIndex
  ) => {
    setCompletedExercises((previous) => {
      if (previous.includes(exerciseIndex)) {
        return previous;
      }

      return [
        ...previous,
        exerciseIndex,
      ];
    });

    if (
      exerciseIndex <
      exercises.length - 1
    ) {
      setCurrentExercise(
        exerciseIndex + 1
      );
    }
  };

  /*
    NEXT EXERCISE
  */

  const handleNextExercise = () => {
    if (
      currentExercise <
      exercises.length - 1
    ) {
      setCurrentExercise(
        currentExercise + 1
      );
    }
  };

  /*
    RESET WORKOUT
  */

  const resetWorkout = () => {
    setCurrentExercise(0);
    setCompletedExercises([]);
    setCompletedSets({});
    setSeconds(0);
    setIsRunning(false);
    setShowFinishModal(false);
  };

  /*
    FINISH WORKOUT
    SAVE TO BACKEND + MONGODB
  */

  const finishWorkout = async () => {
    const durationMinutes = Math.max(
      1,
      Math.round(seconds / 60)
    );

    const fallbackCalories = Number(
      selectedPlan?.calories?.replace(/\D/g, "") || 0
    );

    const workoutHistory = {
      planId: selectedPlan?.id || "",

      title:
        selectedPlan?.title ||
        selectedPlan?.name ||
        "Workout Session",

      planName:
        selectedPlan?.title ||
        selectedPlan?.name ||
        "Workout Session",

      type:
        selectedPlan?.category ||
        "STRENGTH",

      category:
        selectedPlan?.category ||
        "STRENGTH",

      durationMinutes,

      calories:
        estimatedCalories > 0
          ? estimatedCalories
          : fallbackCalories,

      score:
        selectedPlan?.rpe ||
        "8.5",

      rpe:
        selectedPlan?.rpe ||
        "8.5",

      completedExercises:
        completedExercises.length,

      totalExercises:
        exercises.length,

      completedSets:
        completedSetCount,

      totalSets,

      status: "COMPLETED",

      completedAt:
        new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem(
        "fitpulse_token"
      );

      if (!token) {
        alert(
          "Please login again before saving your workout."
        );
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/workouts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(workoutHistory),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save workout."
        );
      }

      const savedWorkout =
        data.workout || workoutHistory;

      /*
        KEEP LOCAL CACHE IN SYNC
        FOR EXISTING HISTORY / ANALYTICS UI
      */
      const existingHistory = JSON.parse(
        localStorage.getItem(
          "fitpulse_workout_history"
        ) || "[]"
      );

      const updatedHistory = [
        savedWorkout,
        ...existingHistory,
      ];

      localStorage.setItem(
        "fitpulse_workout_history",
        JSON.stringify(updatedHistory)
      );

      window.dispatchEvent(
        new Event(
          "fitpulse-workout-history-updated"
        )
      );

      console.log(
        "WORKOUT SAVED TO MONGODB:",
        savedWorkout
      );

      setIsRunning(false);
      setShowFinishModal(true);
    } catch (error) {
      console.error(
        "WORKOUT SAVE ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to save workout. Make sure the backend is running."
      );
    }
  };

  if (!selectedPlan) {
    return (
      <div className="app-shell">

        <Sidebar
          navigate={navigate}
          active="workout-tracking"
        />

        <main className="workout-tracking-main">

          <div className="workout-loading">
            LOADING WORKOUT...
          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="app-shell">

      <Sidebar
        navigate={navigate}
        active="workout-tracking"
      />

      <main className="workout-tracking-main">

        {/* HEADER */}

        <header className="workout-tracking-header">

          <button
            className="workout-back-button"
            onClick={() =>
              navigate("workout-plans")
            }
          >
            <ArrowLeft size={16} />
            EXIT WORKOUT
          </button>

          <div className="workout-header-status">

            <span className="live-dot" />

            WORKOUT IN PROGRESS

          </div>

        </header>


        {/* TITLE */}

        <section className="workout-title-section">

          <div>

            <p>
              ACTIVE TRAINING SESSION
            </p>

            <h1>
              {selectedPlan.title}
            </h1>

            <span>
              {selectedPlan.category} ·{" "}
              {selectedPlan.level}
            </span>

          </div>


          <div className="workout-timer-card">

            <Clock3 size={18} />

            <div>

              <span>
                SESSION TIME
              </span>

              <strong>
                {formatTime(seconds)}
              </strong>

            </div>

          </div>

        </section>


        {/* OVERVIEW */}

        <section className="workout-overview-grid">

          <div className="workout-overview-card">

            <div className="overview-icon">
              <Dumbbell size={18} />
            </div>

            <span>
              EXERCISES
            </span>

            <strong>
              {exercises.length}
            </strong>

          </div>


          <div className="workout-overview-card">

            <div className="overview-icon">
              <Target size={18} />
            </div>

            <span>
              SETS
            </span>

            <strong>
              {completedSetCount}
              <small>
                /{totalSets}
              </small>
            </strong>

          </div>


          <div className="workout-overview-card">

            <div className="overview-icon">
              <Flame size={18} />
            </div>

            <span>
              CALORIES
            </span>

            <strong>
              {estimatedCalories}
              <small>
                KCAL
              </small>
            </strong>

          </div>


          <div className="workout-overview-card">

            <div className="overview-icon">
              <Zap size={18} />
            </div>

            <span>
              RPE TARGET
            </span>

            <strong>
              {selectedPlan.rpe || "8.5"}
            </strong>

          </div>

        </section>


        {/* PROGRESS */}

        <section className="workout-progress-section">

          <div className="workout-progress-heading">

            <div>

              <p>
                SESSION PROGRESS
              </p>

              <strong>
                {progress}% COMPLETE
              </strong>

            </div>

            <span>
              {completedExercises.length}/
              {exercises.length} EXERCISES
            </span>

          </div>


          <div className="workout-progress-track">

            <div
              className="workout-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </section>


        {/* CURRENT EXERCISE */}

        {current && (

          <section className="active-exercise-card">

            <div className="active-exercise-top">

              <div>

                <p>
                  CURRENT EXERCISE
                </p>

                <h2>
                  {current.name}
                </h2>

                <span>
                  {current.muscle} ·{" "}
                  {current.load}
                </span>

              </div>


              <div className="exercise-number-large">

                {String(
                  currentExercise + 1
                ).padStart(2, "0")}

              </div>

            </div>


            <div className="active-exercise-stats">

              <div>

                <span>
                  SETS
                </span>

                <strong>
                  {current.sets}
                </strong>

              </div>


              <div>

                <span>
                  REPS
                </span>

                <strong>
                  {current.reps}
                </strong>

              </div>


              <div>

                <span>
                  LOAD
                </span>

                <strong>
                  {current.load}
                </strong>

              </div>


              <div>

                <span>
                  REST
                </span>

                <strong>
                  {current.rest} SEC
                </strong>

              </div>

            </div>


            {/* SET TRACKER */}

            <div className="set-tracker">

              <div className="set-tracker-heading">

                <span>
                  SET TRACKER
                </span>

                <strong>
                  {(
                    completedSets[
                      currentExercise
                    ] || []
                  ).length}
                  /{current.sets} COMPLETED
                </strong>

              </div>


              <div className="set-buttons">

                {Array.from(
                  {
                    length: current.sets,
                  },
                  (_, index) => {

                    const isCompleted =
                      (
                        completedSets[
                          currentExercise
                        ] || []
                      ).includes(index);

                    return (
                      <button
                        key={index}
                        type="button"
                        className={
                          isCompleted
                            ? "set-button completed"
                            : "set-button"
                        }
                        onClick={() =>
                          completeSet(
                            currentExercise,
                            index
                          )
                        }
                      >

                        {isCompleted ? (
                          <Check size={16} />
                        ) : (
                          index + 1
                        )}

                      </button>
                    );
                  }
                )}

              </div>

            </div>


            <div className="active-exercise-actions">

              <button
                className="workout-control-button"
                type="button"
                onClick={() =>
                  setIsRunning(
                    (previous) =>
                      !previous
                  )
                }
              >

                {isRunning ? (
                  <>
                    <Pause size={16} />
                    PAUSE
                  </>
                ) : (
                  <>
                    <Play
                      size={16}
                      fill="currentColor"
                    />
                    START
                  </>
                )}

              </button>


              <button
                className="workout-complete-button"
                type="button"
                onClick={() =>
                  completeExercise(
                    currentExercise
                  )
                }
              >

                <CheckCircle2 size={16} />

                COMPLETE EXERCISE

              </button>

            </div>

          </section>

        )}


        {/* EXERCISE QUEUE */}

        <section className="workout-exercise-section">

          <div className="workout-section-heading">

            <div>

              <p>
                TRAINING QUEUE
              </p>

              <h2>
                EXERCISE SEQUENCE
              </h2>

            </div>

            <span>
              {exercises.length} EXERCISES
            </span>

          </div>


          <div className="workout-exercise-list">

            {exercises.map(
              (exercise, index) => {

                const isCompleted =
                  completedExercises.includes(
                    index
                  );

                const isCurrent =
                  index === currentExercise;

                return (
                  <button
                    key={exercise.name}
                    type="button"
                    className={`workout-exercise-row ${
                      isCurrent
                        ? "current"
                        : ""
                    } ${
                      isCompleted
                        ? "completed"
                        : ""
                    }`}
                    onClick={() =>
                      setCurrentExercise(
                        index
                      )
                    }
                  >

                    <div className="queue-number">

                      {isCompleted ? (
                        <Check size={15} />
                      ) : (
                        String(
                          index + 1
                        ).padStart(2, "0")
                      )}

                    </div>


                    <div className="queue-info">

                      <strong>
                        {exercise.name}
                      </strong>

                      <span>
                        {exercise.muscle} ·{" "}
                        {exercise.sets} SETS ·{" "}
                        {exercise.reps} REPS
                      </span>

                    </div>


                    <div className="queue-load">

                      <span>
                        LOAD
                      </span>

                      <strong>
                        {exercise.load}
                      </strong>

                    </div>


                    <ChevronRight
                      size={17}
                    />

                  </button>
                );
              }
            )}

          </div>

        </section>


        {/* BOTTOM ACTIONS */}

        <section className="workout-bottom-actions">

          <button
            type="button"
            className="workout-reset-button"
            onClick={resetWorkout}
          >

            <RotateCcw size={15} />

            RESET SESSION

          </button>


          <div className="workout-bottom-right">

            <button
              type="button"
              className="workout-next-button"
              onClick={
                handleNextExercise
              }
              disabled={
                currentExercise >=
                exercises.length - 1
              }
            >

              NEXT EXERCISE

              <ArrowRight size={16} />

            </button>


            <button
              type="button"
              className="workout-finish-button"
              onClick={finishWorkout}
            >

              FINISH WORKOUT

              <CheckCircle2 size={16} />

            </button>

          </div>

        </section>


        {/* FINISH MODAL */}

        {showFinishModal && (

          <div className="workout-modal-overlay">

            <div className="workout-finish-modal">

              <button
                className="workout-modal-close"
                type="button"
                onClick={() =>
                  setShowFinishModal(false)
                }
              >
                <X size={18} />
              </button>


              <div className="finish-success-icon">

                <CheckCircle2 size={34} />

              </div>


              <p>
                SESSION COMPLETE
              </p>


              <h2>
                GREAT WORK,
                <span> ATHLETE.</span>
              </h2>


              <span className="finish-description">
                Your workout has been recorded
                successfully.
              </span>


              <div className="finish-stats">

                <div>

                  <strong>
                    {formatTime(seconds)}
                  </strong>

                  <span>
                    DURATION
                  </span>

                </div>


                <div>

                  <strong>
                    {completedSetCount}
                  </strong>

                  <span>
                    SETS
                  </span>

                </div>


                <div>

                  <strong>
                    {estimatedCalories}
                  </strong>

                  <span>
                    KCAL
                  </span>

                </div>

              </div>


              <div className="finish-modal-actions">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "workout-history"
                    )
                  }
                >
                  VIEW HISTORY
                </button>


                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "dashboard"
                    )
                  }
                >
                  BACK TO DASHBOARD
                </button>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default WorkoutTracking;