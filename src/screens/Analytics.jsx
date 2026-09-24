import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  Flame,
  HeartPulse,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Analytics({ navigate }) {
  const [workouts, setWorkouts] = useState([]);

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem(
        "fitpulse_token"
      );

      if (!token) {
        console.warn(
          "ANALYTICS: No authentication token found."
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
            "Failed to load workout analytics."
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
        "ANALYTICS HISTORY ERROR:",
        error
      );

      // Fallback to the existing local cache if
      // the backend is temporarily unavailable.
      try {
        const storedHistory = localStorage.getItem(
          "fitpulse_workout_history"
        );

        if (storedHistory) {
          const parsedHistory = JSON.parse(
            storedHistory
          );

          setWorkouts(
            Array.isArray(parsedHistory)
              ? parsedHistory
              : []
          );
        } else {
          setWorkouts([]);
        }
      } catch (cacheError) {
        console.error(
          "ANALYTICS CACHE ERROR:",
          cacheError
        );
        setWorkouts([]);
      }
    }
  };

  useEffect(() => {
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
    LAST 7 DAYS
  */
  const lastSevenDays = useMemo(() => {
    const days = [];

    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);

      date.setHours(0, 0, 0, 0);

      date.setDate(
        today.getDate() - i
      );

      days.push(date);
    }

    return days;
  }, []);

  /*
    CHECK WHETHER WORKOUT BELONGS TO A DATE
  */
  const isSameDate = (workoutDate, targetDate) => {
    if (!workoutDate) {
      return false;
    }

    const date = new Date(workoutDate);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    return (
      date.getFullYear() ===
        targetDate.getFullYear() &&
      date.getMonth() ===
        targetDate.getMonth() &&
      date.getDate() ===
        targetDate.getDate()
    );
  };

  /*
    WORKOUTS FROM LAST 7 DAYS
  */
  const recentWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      if (
        workout.status &&
        workout.status !== "COMPLETED"
      ) {
        return false;
      }

      const workoutDate =
        workout.completedAt ||
        workout.date;

      return lastSevenDays.some((day) =>
        isSameDate(workoutDate, day)
      );
    });
  }, [workouts, lastSevenDays]);

  /*
    TOTAL CALORIES
  */
  const totalCalories = useMemo(() => {
    return recentWorkouts.reduce(
      (total, workout) => {
        return (
          total +
          (Number(workout.calories) || 0)
        );
      },
      0
    );
  }, [recentWorkouts]);

  /*
    TOTAL TRAINING TIME
  */
  const totalMinutes = useMemo(() => {
    return recentWorkouts.reduce(
      (total, workout) => {
        return (
          total +
          (Number(
            workout.durationMinutes
          ) || 0)
        );
      },
      0
    );
  }, [recentWorkouts]);

  /*
    WEEKLY PERFORMANCE DATA
  */
  const weeklyData = useMemo(() => {
    return lastSevenDays.map((date) => {
      const dayWorkouts =
        recentWorkouts.filter((workout) =>
          isSameDate(
            workout.completedAt ||
              workout.date,
            date
          )
        );

      const calories = dayWorkouts.reduce(
        (total, workout) =>
          total +
          (Number(workout.calories) || 0),
        0
      );

      const workoutCount =
        dayWorkouts.length;

      /*
        Performance is calculated from
        completed workout activity.

        1 workout = baseline load.
        Calories increase the daily load.
      */
      let value = 0;

      if (workoutCount > 0) {
        value =
          35 +
          workoutCount * 20 +
          Math.min(
            30,
            Math.round(calories / 25)
          );
      }

      value = Math.min(100, value);

      return {
        day: date
          .toLocaleDateString("en-US", {
            weekday: "short",
          })
          .toUpperCase(),

        value,
      };
    });
  }, [lastSevenDays, recentWorkouts]);

  /*
    AVERAGE BIO LOAD
  */
  const averageBioLoad = useMemo(() => {
    if (weeklyData.length === 0) {
      return 0;
    }

    const total = weeklyData.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

    return (
      Math.round(
        (total / weeklyData.length) *
          10
      ) / 10
    );
  }, [weeklyData]);

  /*
    EMPTY STATE
  */
  const hasWorkouts =
    recentWorkouts.length > 0;

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="analytics"
      />

      <main className="analytics-main">
        <header className="analytics-header">
          <div>
            <p>
              PERFORMANCE OVERVIEW
            </p>

            <h1>
              ANALYTICS
            </h1>

            <span>
              Track your biological performance
              and training load.
            </span>
          </div>

          <button
            type="button"
            className="analytics-period"
          >
            LAST 7 DAYS
          </button>
        </header>

        <section className="analytics-metrics">
          <div className="analytics-metric">
            <div className="analytics-icon">
              <Activity size={18} />
            </div>

            <span>
              AVG BIO LOAD
            </span>

            <strong>
              {averageBioLoad}
            </strong>

            <small>
              <TrendingUp size={12} />

              {hasWorkouts
                ? `${recentWorkouts.length} completed session${
                    recentWorkouts.length !==
                    1
                      ? "s"
                      : ""
                  }`
                : "No sessions yet"}
            </small>
          </div>

          <div className="analytics-metric">
            <div className="analytics-icon">
              <HeartPulse size={18} />
            </div>

            <span>
              TRAINING TIME
            </span>

            <strong>
              {totalMinutes}{" "}
              <small>min</small>
            </strong>

            <small>
              <TrendingUp size={12} />

              Last 7 days
            </small>
          </div>

          <div className="analytics-metric">
            <div className="analytics-icon">
              <Flame size={18} />
            </div>

            <span>
              CALORIES BURNED
            </span>

            <strong>
              {totalCalories.toLocaleString()}{" "}
              <small>kcal</small>
            </strong>

            <small>
              <TrendingUp size={12} />

              Last 7 days
            </small>
          </div>
        </section>

        <section className="analytics-grid">
          <div className="analytics-card performance-card">
            <div className="analytics-card-heading">
              <div>
                <p>
                  TRAINING LOAD
                </p>

                <h2>
                  WEEKLY PERFORMANCE
                </h2>
              </div>

              <span>
                0 — 100
              </span>
            </div>

            <div className="analytics-chart">
              {weeklyData.map(
                (item) => (
                  <div
                    className="analytics-column"
                    key={item.day}
                  >
                    <div className="analytics-bar-area">
                      <div
                        className="analytics-bar"
                        style={{
                          height: `${item.value}%`,
                        }}
                      />
                    </div>

                    <span>
                      {item.day}
                    </span>
                  </div>
                )
              )}
            </div>

            {!hasWorkouts && (
              <div
                style={{
                  marginTop: "18px",
                  fontSize: "12px",
                  color: "var(--muted)",
                }}
              >
                Complete a workout to start
                building your performance
                analytics.
              </div>
            )}
          </div>

          <div className="analytics-card recovery-card">
            <div className="analytics-card-heading">
              <div>
                <p>
                  RECOVERY STATUS
                </p>

                <h2>
                  BODY READINESS
                </h2>
              </div>
            </div>

            <div className="readiness-score">
              <strong>
                82
              </strong>

              <span>
                %
              </span>
            </div>

            <div className="readiness-label">
              OPTIMAL READINESS
            </div>

            <div className="readiness-line">
              <div />
            </div>

            <div className="readiness-details">
              <div>
                <span>
                  Sleep
                </span>

                <strong>
                  86%
                </strong>
              </div>

              <div>
                <span>
                  HRV
                </span>

                <strong>
                  79%
                </strong>
              </div>

              <div>
                <span>
                  Stress
                </span>

                <strong>
                  21%
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="analytics-card zones-card">
          <div className="analytics-card-heading">
            <div>
              <p>
                TRAINING ANALYSIS
              </p>

              <h2>
                WORKOUT DISTRIBUTION
              </h2>
            </div>

            <span>
              THIS WEEK
            </span>
          </div>

          <div className="zone-list">
            <div className="zone-row">
              <span>
                WORKOUTS
              </span>

              <div className="zone-track">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      recentWorkouts.length *
                        20
                    )}%`,
                  }}
                />
              </div>

              <strong>
                {recentWorkouts.length}
              </strong>
            </div>

            <div className="zone-row">
              <span>
                TRAINING TIME
              </span>

              <div className="zone-track">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (totalMinutes /
                          300) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>

              <strong>
                {totalMinutes}m
              </strong>
            </div>

            <div className="zone-row">
              <span>
                CALORIES
              </span>

              <div className="zone-track">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (totalCalories /
                          2500) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>

              <strong>
                {totalCalories}
              </strong>
            </div>

            <div className="zone-row">
              <span>
                EXERCISES
              </span>

              <div className="zone-track">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      recentWorkouts.reduce(
                        (
                          total,
                          workout
                        ) =>
                          total +
                          (Number(
                            workout.completedExercises
                          ) || 0),
                        0
                      ) * 5
                    )}%`,
                  }}
                />
              </div>

              <strong>
                {recentWorkouts.reduce(
                  (
                    total,
                    workout
                  ) =>
                    total +
                    (Number(
                      workout.completedExercises
                    ) || 0),
                  0
                )}
              </strong>
            </div>

            <div className="zone-row">
              <span>
                SETS
              </span>

              <div className="zone-track">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      recentWorkouts.reduce(
                        (
                          total,
                          workout
                        ) =>
                          total +
                          (Number(
                            workout.completedSets
                          ) || 0),
                        0
                      ) * 4
                    )}%`,
                  }}
                />
              </div>

              <strong>
                {recentWorkouts.reduce(
                  (
                    total,
                    workout
                  ) =>
                    total +
                    (Number(
                      workout.completedSets
                    ) || 0),
                  0
                )}
              </strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Analytics;