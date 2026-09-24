import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  Flame,
  Footprints,
  HeartPulse,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Calories({ navigate }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem(
          "fitpulse_token"
        );

        if (!token) {
          console.warn(
            "CALORIES: No authentication token found."
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
              "Failed to load calorie data."
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
          "CALORIES HISTORY ERROR:",
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

          const parsedHistory =
            JSON.parse(storedHistory);

          setWorkouts(
            Array.isArray(parsedHistory)
              ? parsedHistory
              : []
          );
        } catch (cacheError) {
          console.error(
            "CALORIES CACHE ERROR:",
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
    TODAY
  */
  const today = useMemo(() => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

  /*
    TODAY'S WORKOUTS
  */
  const todayWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      if (
        workout.status &&
        workout.status !== "COMPLETED"
      ) {
        return false;
      }

      const workoutDate = new Date(
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

      workoutDate.setHours(0, 0, 0, 0);

      return (
        workoutDate.getTime() ===
        today.getTime()
      );
    });
  }, [workouts, today]);

  /*
    TODAY'S CALORIES
  */
  const todayCalories = useMemo(() => {
    return todayWorkouts.reduce(
      (total, workout) =>
        total +
        (Number(workout.calories) || 0),
      0
    );
  }, [todayWorkouts]);

  /*
    TODAY'S ACTIVE MINUTES
  */
  const todayActiveMinutes =
    useMemo(() => {
      return todayWorkouts.reduce(
        (total, workout) =>
          total +
          (Number(
            workout.durationMinutes
          ) || 0),
        0
      );
    }, [todayWorkouts]);

  /*
    DAILY CALORIE TARGET
  */
  const calorieTarget = 2500;

  const calorieProgress =
    Math.min(
      100,
      Math.round(
        (todayCalories /
          calorieTarget) *
          100
      )
    );

  /*
    ACTIVE MINUTE TARGET
  */
  const activeMinuteTarget = 90;

  const remainingMinutes =
    Math.max(
      0,
      activeMinuteTarget -
        todayActiveMinutes
    );

  /*
    LAST 7 DAYS
  */
  const weeklyDays = useMemo(() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);

      date.setDate(
        date.getDate() - i
      );

      days.push(date);
    }

    return days;
  }, []);

  /*
    WEEKLY CALORIE DATA
  */
  const activityData = useMemo(() => {
    return weeklyDays.map((date) => {
      const dayWorkouts =
        workouts.filter((workout) => {
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

          workoutDate.setHours(
            0,
            0,
            0,
            0
          );

          return (
            workoutDate.getTime() ===
            date.getTime()
          );
        });

      const calories =
        dayWorkouts.reduce(
          (total, workout) =>
            total +
            (Number(
              workout.calories
            ) || 0),
          0
        );

      return {
        day: date
          .toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            }
          )
          .toUpperCase(),

        calories,
      };
    });
  }, [weeklyDays, workouts]);

  /*
    SCALE WEEKLY BARS
  */
  const maxWeeklyCalories =
    Math.max(
      ...activityData.map(
        (item) => item.calories
      ),
      1
    );

  /*
    WEEKLY TOTAL
  */
  const weeklyCalories =
    activityData.reduce(
      (total, item) =>
        total + item.calories,
      0
    );

  /*
    TODAY'S WORKOUT CALORIES
  */
  const workoutCalories =
    todayCalories;

  /*
    TODAY'S ACTIVE MINUTES
  */
  const workoutMinutes =
    todayActiveMinutes;

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="calories"
      />

      <main className="calories-main">
        <header className="calories-header">
          <div>
            <p>
              ENERGY & ACTIVITY MONITOR
            </p>

            <h1>
              CALORIE & ACTIVITY
            </h1>

            <span>
              Monitor your daily energy
              expenditure and movement.
            </span>
          </div>

          <button
            type="button"
            className="calories-period"
          >
            TODAY ·{" "}
            {today
              .toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              )
              .toUpperCase()}
          </button>
        </header>

        <section className="calorie-overview">
          <div className="calorie-card highlight">
            <div className="calorie-icon">
              <Flame size={19} />
            </div>

            <span>
              CALORIES BURNED
            </span>

            <strong>
              {todayCalories.toLocaleString()}
            </strong>

            <small>
              kcal
            </small>

            <div className="calorie-progress">
              <div
                style={{
                  width: `${calorieProgress}%`,
                }}
              />
            </div>

            <p>
              {calorieProgress}% of
              daily target
            </p>
          </div>

          <div className="calorie-card">
            <div className="calorie-icon">
              <Footprints size={19} />
            </div>

            <span>
              WORKOUT SESSIONS
            </span>

            <strong>
              {todayWorkouts.length}
            </strong>

            <small>
              sessions
            </small>

            <p>
              <TrendingUp size={12} />
              Completed today
            </p>
          </div>

          <div className="calorie-card">
            <div className="calorie-icon">
              <HeartPulse size={19} />
            </div>

            <span>
              WORKOUT CALORIES
            </span>

            <strong>
              {workoutCalories.toLocaleString()}
            </strong>

            <small>
              kcal
            </small>

            <p>
              From completed workouts
            </p>
          </div>

          <div className="calorie-card">
            <div className="calorie-icon">
              <Activity size={19} />
            </div>

            <span>
              ACTIVE MINUTES
            </span>

            <strong>
              {todayActiveMinutes}
            </strong>

            <small>
              mins
            </small>

            <p>
              {remainingMinutes > 0
                ? `${remainingMinutes} mins remaining`
                : "Daily target reached"}
            </p>
          </div>
        </section>

        <section className="calories-grid">
          <div className="calories-card activity-chart-card">
            <div className="calories-card-heading">
              <div>
                <p>
                  ACTIVITY HISTORY
                </p>

                <h2>
                  WEEKLY CALORIE BURN
                </h2>
              </div>

              <span>
                kcal
              </span>
            </div>

            <div className="calories-chart">
              {activityData.map(
                (item) => {
                  const height =
                    item.calories === 0
                      ? 0
                      : Math.max(
                          8,
                          Math.round(
                            (item.calories /
                              maxWeeklyCalories) *
                              100
                          )
                        );

                  return (
                    <div
                      className="calories-column"
                      key={item.day}
                    >
                      <div className="calories-bar-area">
                        <div
                          className="calories-bar"
                          style={{
                            height: `${height}%`,
                          }}
                        />
                      </div>

                      <span>
                        {item.day}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            <div
              style={{
                marginTop: "16px",
                fontSize: "12px",
                color:
                  "var(--muted)",
              }}
            >
              Weekly total:{" "}
              <strong
                style={{
                  color:
                    "var(--text)",
                }}
              >
                {weeklyCalories.toLocaleString()}{" "}
                kcal
              </strong>
            </div>
          </div>

          <div className="calories-card nutrition-card">
            <div className="calories-card-heading">
              <div>
                <p>
                  ENERGY BALANCE
                </p>

                <h2>
                  TODAY'S INTAKE
                </h2>
              </div>
            </div>

            <div className="intake-number">
              <strong>
                --
              </strong>

              <span>
                kcal
              </span>
            </div>

            <div className="intake-row">
              <span>
                Protein
              </span>

              <strong>
                --
              </strong>
            </div>

            <div className="intake-row">
              <span>
                Carbohydrates
              </span>

              <strong>
                --
              </strong>
            </div>

            <div className="intake-row">
              <span>
                Fats
              </span>

              <strong>
                --
              </strong>
            </div>

            <div className="energy-balance">
              <span>
                WORKOUT ENERGY EXPENDITURE
              </span>

              <strong>
                {todayCalories.toLocaleString()}{" "}
                kcal
              </strong>
            </div>
          </div>
        </section>

        <section className="calories-card zones-activity">
          <div className="calories-card-heading">
            <div>
              <p>
                DAILY ACTIVITY
              </p>

              <h2>
                ACTIVITY BREAKDOWN
              </h2>
            </div>

            <span>
              {today
                .toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  }
                )
                .toUpperCase()}
            </span>
          </div>

          <div className="activity-breakdown">
            <div className="activity-item">
              <div className="activity-item-icon">
                <Footprints size={17} />
              </div>

              <div>
                <span>
                  WORKOUT SESSIONS
                </span>

                <strong>
                  {todayWorkouts.length}{" "}
                  completed
                </strong>
              </div>

              <b>
                {todayCalories.toLocaleString()}{" "}
                kcal
              </b>
            </div>

            <div className="activity-item">
              <div className="activity-item-icon">
                <Activity size={17} />
              </div>

              <div>
                <span>
                  WORKOUT
                </span>

                <strong>
                  {workoutMinutes} active
                  mins
                </strong>
              </div>

              <b>
                {workoutCalories.toLocaleString()}{" "}
                kcal
              </b>
            </div>

            <div className="activity-item">
              <div className="activity-item-icon">
                <HeartPulse size={17} />
              </div>

              <div>
                <span>
                  TRAINING LOAD
                </span>

                <strong>
                  {todayWorkouts.length > 0
                    ? "Active"
                    : "No workout yet"}
                </strong>
              </div>

              <b>
                {todayWorkouts.reduce(
                  (
                    total,
                    workout
                  ) =>
                    total +
                    (Number(
                      workout.completedExercises
                    ) || 0),
                  0
                )}{" "}
                exercises
              </b>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Calories;
