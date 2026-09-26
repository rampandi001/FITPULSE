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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------------------------------------
  // LOAD WORKOUT HISTORY
  // ----------------------------------------

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("fitpulse_token");

      if (!token) {
        navigate("signin");
        return;
      }

      const response = await fetch(
        "https://fitpulse-feid.onrender.com/api/workouts/history",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // ----------------------------------------
      // INVALID / EXPIRED TOKEN
      // ----------------------------------------

      if (response.status === 401) {
        localStorage.removeItem("fitpulse_token");
        localStorage.removeItem("fitpulse_user");

        navigate("signin");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load workout analytics."
        );
      }

      // ----------------------------------------
      // SUPPORT BACKEND RESPONSE
      // ----------------------------------------

      const history = Array.isArray(data)
        ? data
        : Array.isArray(data.workouts)
        ? data.workouts
        : Array.isArray(data.history)
        ? data.history
        : [];

      setWorkouts(history);
    } catch (err) {
      console.error(
        "ANALYTICS HISTORY ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to FITPULSE backend."
      );

      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // INITIAL LOAD + WORKOUT UPDATES
  // ----------------------------------------

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
  }, [navigate]);

  // ----------------------------------------
  // LAST 7 DAYS
  // ----------------------------------------

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

  // ----------------------------------------
  // WORKOUT DATE
  // ----------------------------------------

  const getWorkoutDate = (workout) => {
    const workoutDate =
      workout?.completedAt ||
      workout?.date ||
      workout?.createdAt;

    if (!workoutDate) {
      return null;
    }

    const date = new Date(workoutDate);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  };

  // ----------------------------------------
  // SAME DATE CHECK
  // ----------------------------------------

  const isSameDate = (
    workoutDate,
    targetDate
  ) => {
    if (!workoutDate || !targetDate) {
      return false;
    }

    const date =
      workoutDate instanceof Date
        ? workoutDate
        : new Date(workoutDate);

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

  // ----------------------------------------
  // COMPLETED WORKOUTS FROM LAST 7 DAYS
  // ----------------------------------------

  const recentWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      if (
        workout?.status &&
        String(workout.status).toUpperCase() !==
          "COMPLETED"
      ) {
        return false;
      }

      const workoutDate =
        getWorkoutDate(workout);

      return lastSevenDays.some((day) =>
        isSameDate(workoutDate, day)
      );
    });
  }, [workouts, lastSevenDays]);

  // ----------------------------------------
  // TOTAL CALORIES
  // ----------------------------------------

  const totalCalories = useMemo(() => {
    return recentWorkouts.reduce(
      (total, workout) => {
        return (
          total +
          (Number(workout?.calories) || 0)
        );
      },
      0
    );
  }, [recentWorkouts]);

  // ----------------------------------------
  // TOTAL TRAINING TIME
  // ----------------------------------------

  const totalMinutes = useMemo(() => {
    return recentWorkouts.reduce(
      (total, workout) => {
        return (
          total +
          (Number(
            workout?.durationMinutes
          ) || 0)
        );
      },
      0
    );
  }, [recentWorkouts]);

  // ----------------------------------------
  // TOTAL EXERCISES
  // ----------------------------------------

  const totalExercises = useMemo(() => {
    return recentWorkouts.reduce(
      (total, workout) => {
        return (
          total +
          (Number(
            workout?.completedExercises
          ) || 0)
        );
      },
      0
    );
  }, [recentWorkouts]);

  // ----------------------------------------
  // TOTAL SETS
  // ----------------------------------------

  const totalSets = useMemo(() => {
    return recentWorkouts.reduce(
      (total, workout) => {
        return (
          total +
          (Number(
            workout?.completedSets
          ) || 0)
        );
      },
      0
    );
  }, [recentWorkouts]);

  // ----------------------------------------
  // WEEKLY PERFORMANCE
  // ----------------------------------------

  const weeklyData = useMemo(() => {
    return lastSevenDays.map((date) => {
      const dayWorkouts =
        recentWorkouts.filter((workout) =>
          isSameDate(
            getWorkoutDate(workout),
            date
          )
        );

      const calories =
        dayWorkouts.reduce(
          (total, workout) => {
            return (
              total +
              (Number(workout?.calories) || 0)
            );
          },
          0
        );

      const duration =
        dayWorkouts.reduce(
          (total, workout) => {
            return (
              total +
              (Number(
                workout?.durationMinutes
              ) || 0)
            );
          },
          0
        );

      const workoutCount =
        dayWorkouts.length;

      /*
        Relative training-load calculation.

        Available backend data:
        - workout count
        - calories
        - duration

        This is NOT a medical readiness score.
      */

      let value = 0;

      if (workoutCount > 0) {
        value =
          30 +
          workoutCount * 20 +
          Math.min(
            25,
            Math.round(calories / 30)
          ) +
          Math.min(
            25,
            Math.round(duration / 10)
          );
      }

      value = Math.min(
        100,
        Math.round(value)
      );

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

  // ----------------------------------------
  // AVERAGE BIO LOAD
  // ----------------------------------------

  const averageBioLoad = useMemo(() => {
    if (!weeklyData.length) {
      return 0;
    }

    const total = weeklyData.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

    return (
      Math.round(
        (total /
          weeklyData.length) *
          10
      ) / 10
    );
  }, [weeklyData]);

  // ----------------------------------------
  // HAS WORKOUTS
  // ----------------------------------------

  const hasWorkouts =
    recentWorkouts.length > 0;

  // ----------------------------------------
  // LOADING STATE
  // ----------------------------------------

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar
          navigate={navigate}
          active="analytics"
        />

        <main className="analytics-main">
          <div className="settings-loading">
            LOADING ANALYTICS...
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------
  // MAIN UI
  // ----------------------------------------

  return (
    <div className="app-shell">

      <Sidebar
        navigate={navigate}
        active="analytics"
      />

      <main className="analytics-main">

        {/* HEADER */}

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

        {/* ERROR */}

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

        {/* METRICS */}

        <section className="analytics-metrics">

          {/* AVG BIO LOAD */}

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

          {/* TRAINING TIME */}

          <div className="analytics-metric">

            <div className="analytics-icon">
              <HeartPulse size={18} />
            </div>

            <span>
              TRAINING TIME
            </span>

            <strong>
              {totalMinutes}{" "}
              <small>
                min
              </small>
            </strong>

            <small>
              <TrendingUp size={12} />
              Last 7 days
            </small>

          </div>

          {/* CALORIES */}

          <div className="analytics-metric">

            <div className="analytics-icon">
              <Flame size={18} />
            </div>

            <span>
              CALORIES BURNED
            </span>

            <strong>
              {totalCalories.toLocaleString()}{" "}
              <small>
                kcal
              </small>
            </strong>

            <small>
              <TrendingUp size={12} />
              Last 7 days
            </small>

          </div>

        </section>

        {/* WEEKLY PERFORMANCE + READINESS */}

        <section className="analytics-grid">

          {/* WEEKLY PERFORMANCE */}

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

          {/* BODY READINESS */}

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
                —
              </strong>

              <span>
                %
              </span>

            </div>

            <div className="readiness-label">
              HEALTH DATA NOT AVAILABLE
            </div>

            <div className="readiness-line">
              <div
                style={{
                  width: "0%",
                }}
              />
            </div>

            <div className="readiness-details">

              <div>

                <span>
                  Sleep
                </span>

                <strong>
                  —
                </strong>

              </div>

              <div>

                <span>
                  HRV
                </span>

                <strong>
                  —
                </strong>

              </div>

              <div>

                <span>
                  Stress
                </span>

                <strong>
                  —
                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* WORKOUT DISTRIBUTION */}

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

            {/* WORKOUTS */}

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

            {/* TRAINING TIME */}

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

            {/* CALORIES */}

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

            {/* EXERCISES */}

            <div className="zone-row">

              <span>
                EXERCISES
              </span>

              <div className="zone-track">

                <div
                  style={{
                    width: `${Math.min(
                      100,
                      totalExercises * 5
                    )}%`,
                  }}
                />

              </div>

              <strong>
                {totalExercises}
              </strong>

            </div>

            {/* SETS */}

            <div className="zone-row">

              <span>
                SETS
              </span>

              <div className="zone-track">

                <div
                  style={{
                    width: `${Math.min(
                      100,
                      totalSets * 4
                    )}%`,
                  }}
                />

              </div>

              <strong>
                {totalSets}
              </strong>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Analytics;