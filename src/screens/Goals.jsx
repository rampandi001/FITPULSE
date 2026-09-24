import { useEffect, useMemo, useState } from "react";

import {
  CheckCircle2,
  Flame,
  Target,
  Trophy,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Goals({ navigate }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem(
          "fitpulse_token"
        );

        if (!token) {
          console.warn(
            "GOALS: No authentication token found."
          );
          setWorkouts([]);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/workouts/history",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load workout goals data."
          );
        }

        const history = Array.isArray(data)
          ? data
          : Array.isArray(data.workouts)
          ? data.workouts
          : [];

        setWorkouts(history);

        // Keep the existing local cache synchronized.
        localStorage.setItem(
          "fitpulse_workout_history",
          JSON.stringify(history)
        );
      } catch (error) {
        console.error(
          "GOALS HISTORY ERROR:",
          error
        );

        // Fallback to the existing local cache
        // if the backend is temporarily unavailable.
        try {
          const storedHistory = localStorage.getItem(
            "fitpulse_workout_history"
          );

          if (!storedHistory) {
            setWorkouts([]);
            return;
          }

          const parsedHistory = JSON.parse(
            storedHistory
          );

          setWorkouts(
            Array.isArray(parsedHistory)
              ? parsedHistory
              : []
          );
        } catch (cacheError) {
          console.error(
            "GOALS CACHE ERROR:",
            cacheError
          );

          setWorkouts([]);
        }
      }
    };

    loadHistory();

    const handleWorkoutUpdate = () => {
      loadHistory();
    };

    window.addEventListener(
      "fitpulse-workout-history-updated",
      handleWorkoutUpdate
    );

    window.addEventListener(
      "storage",
      handleWorkoutUpdate
    );

    return () => {
      window.removeEventListener(
        "fitpulse-workout-history-updated",
        handleWorkoutUpdate
      );

      window.removeEventListener(
        "storage",
        handleWorkoutUpdate
      );
    };
  }, []);

  /*
    GET CURRENT WEEK
  */
  const currentWeekWorkouts = useMemo(() => {
    const now = new Date();

    const startOfWeek = new Date(now);

    const day =
      startOfWeek.getDay();

    const difference =
      day === 0 ? 6 : day - 1;

    startOfWeek.setDate(
      startOfWeek.getDate() -
        difference
    );

    startOfWeek.setHours(
      0,
      0,
      0,
      0
    );

    return workouts.filter(
      (workout) => {
        if (
          workout.status &&
          workout.status !==
            "COMPLETED"
        ) {
          return false;
        }

        const workoutDate =
          new Date(
            workout.completedAt ||
              workout.date
          );

        if (
          Number.isNaN(
            workoutDate.getTime()
          )
        ) {
          return false;
        }

        return (
          workoutDate >=
          startOfWeek
        );
      }
    );
  }, [workouts]);

  /*
    WEEKLY CALORIES
  */
  const weeklyCalories = useMemo(() => {
    return currentWeekWorkouts.reduce(
      (total, workout) =>
        total +
        (Number(workout.calories) ||
          0),
      0
    );
  }, [currentWeekWorkouts]);

  /*
    WEEKLY WORKOUT SESSIONS
  */
  const weeklySessions =
    currentWeekWorkouts.length;

  /*
    ACTIVE ZONE / TRAINING TIME
  */
  const activeZoneTime = useMemo(() => {
    return currentWeekWorkouts.reduce(
      (total, workout) =>
        total +
        (Number(
          workout.durationMinutes
        ) || 0),
      0
    );
  }, [currentWeekWorkouts]);

  /*
    GOAL TARGETS
  */
  const calorieTarget = 18000;
  const sessionTarget = 6;
  const activeTimeTarget = 300;

  /*
    PROGRESS CALCULATION
  */
  const getProgress = (
    current,
    target
  ) => {
    if (!target) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (current / target) * 100
      )
    );
  };

  const calorieProgress =
    getProgress(
      weeklyCalories,
      calorieTarget
    );

  const sessionProgress =
    getProgress(
      weeklySessions,
      sessionTarget
    );

  const activeTimeProgress =
    getProgress(
      activeZoneTime,
      activeTimeTarget
    );

  const goals = [
    {
      title: "Weekly Calorie Target",

      current:
        weeklyCalories.toLocaleString(),

      target:
        calorieTarget.toLocaleString(),

      unit: "kcal",

      progress:
        calorieProgress,

      icon: Flame,
    },

    {
      title: "Workout Sessions",

      current:
        weeklySessions.toString(),

      target:
        sessionTarget.toString(),

      unit: "sessions",

      progress:
        sessionProgress,

      icon: Target,
    },

    {
      title: "Active Zone Time",

      current:
        activeZoneTime.toString(),

      target:
        activeTimeTarget.toString(),

      unit: "mins",

      progress:
        activeTimeProgress,

      icon: Trophy,
    },
  ];

  /*
    ACTIVE GOALS
  */
  const activeGoals =
    goals.filter(
      (goal) =>
        goal.progress < 100
    ).length;

  /*
    COMPLETED GOALS
  */
  const completedGoals =
    goals.filter(
      (goal) =>
        goal.progress >= 100
    ).length;

  /*
    SUCCESS RATE
  */
  const successRate =
    goals.length > 0
      ? Math.round(
          (completedGoals /
            goals.length) *
            100
        )
      : 0;

  /*
    VIEW GOAL DETAILS
  */
  const handleGoalDetails = (
    goal
  ) => {
    console.log(
      "GOAL DETAILS:",
      goal
    );
  };

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="goals"
      />

      <main className="goals-main">
        <header className="goals-header">
          <div>
            <p>
              PERFORMANCE TARGETS
            </p>

            <h1>
              GOALS
            </h1>

            <span>
              Set targets. Track progress.
              Push beyond your limits.
            </span>
          </div>

          <button
            type="button"
            className="goal-add-button"
            onClick={() => {
              alert(
                "Create Goal feature coming soon."
              );
            }}
          >
            + CREATE NEW GOAL
          </button>
        </header>

        <section className="goal-summary">
          <div className="goal-summary-card">
            <span>
              ACTIVE GOALS
            </span>

            <strong>
              {String(
                activeGoals
              ).padStart(2, "0")}
            </strong>
          </div>

          <div className="goal-summary-card">
            <span>
              COMPLETED
            </span>

            <strong>
              {String(
                completedGoals
              ).padStart(2, "0")}
            </strong>
          </div>

          <div className="goal-summary-card">
            <span>
              SUCCESS RATE
            </span>

            <strong>
              {successRate}%
            </strong>
          </div>
        </section>

        <section className="goals-section">
          <div className="section-heading">
            <div>
              <p>
                CURRENT TARGETS
              </p>

              <h2>
                ACTIVE GOALS
              </h2>
            </div>

            <span>
              {activeGoals} ACTIVE
            </span>
          </div>

          <div className="goal-list">
            {goals.map((goal) => {
              const Icon =
                goal.icon;

              return (
                <div
                  className="goal-card"
                  key={goal.title}
                >
                  <div className="goal-card-top">
                    <div className="goal-icon">
                      <Icon size={19} />
                    </div>

                    <div className="goal-info">
                      <span>
                        {goal.progress >=
                        100
                          ? "COMPLETED GOAL"
                          : "ACTIVE GOAL"}
                      </span>

                      <h3>
                        {goal.title}
                      </h3>
                    </div>

                    <strong className="goal-percentage">
                      {goal.progress}%
                    </strong>
                  </div>

                  <div className="goal-progress-track">
                    <div
                      style={{
                        width: `${goal.progress}%`,
                      }}
                    />
                  </div>

                  <div className="goal-card-bottom">
                    <div>
                      <strong>
                        {goal.current}
                      </strong>

                      <span>
                        {" "}
                        / {goal.target}{" "}
                        {goal.unit}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleGoalDetails(
                          goal
                        )
                      }
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="goal-completed">
          <div className="section-heading">
            <div>
              <p>
                ACHIEVEMENTS
              </p>

              <h2>
                RECENTLY COMPLETED
              </h2>
            </div>
          </div>

          {completedGoals === 0 ? (
            <div className="completed-card">
              <div className="completed-icon">
                <Target size={20} />
              </div>

              <div>
                <strong>
                  NO GOALS COMPLETED YET
                </strong>

                <span>
                  Keep training this week to
                  complete your active targets.
                </span>
              </div>

              <b>
                IN PROGRESS
              </b>
            </div>
          ) : (
            goals
              .filter(
                (goal) =>
                  goal.progress >= 100
              )
              .map((goal) => (
                <div
                  className="completed-card"
                  key={`completed-${goal.title}`}
                >
                  <div className="completed-icon">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <strong>
                      {goal.title.toUpperCase()}
                    </strong>

                    <span>
                      Weekly target completed
                      successfully.
                    </span>
                  </div>

                  <b>
                    COMPLETED
                  </b>
                </div>
              ))
          )}
        </section>
      </main>
    </div>
  );
}

export default Goals;
