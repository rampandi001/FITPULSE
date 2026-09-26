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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
    LOAD WORKOUT HISTORY FROM BACKEND
  */
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

      /*
        EXPIRED / INVALID TOKEN
      */
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
            "Failed to load calorie data."
        );
      }

      /*
        SUPPORT BACKEND RESPONSE
      */
      const history = Array.isArray(data)
        ? data
        : Array.isArray(data.workouts)
        ? data.workouts
        : Array.isArray(data.history)
        ? data.history
        : [];

      setWorkouts(history);
    } catch (error) {
      console.error(
        "CALORIES HISTORY ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to FITPULSE backend."
      );

      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  /*
    INITIAL LOAD + WORKOUT UPDATES
  */
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

  /*
    TODAY
  */
  const today = useMemo(() => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

  /*
    CHECK COMPLETED WORKOUT
  */
  const isCompletedWorkout = (workout) => {
    if (
      workout?.status &&
      String(workout.status).toUpperCase() !==
        "COMPLETED"
    ) {
      return false;
    }

    return true;
  };

  /*
    GET WORKOUT DATE
  */
  const getWorkoutDate = (workout) => {
    const value =
      workout?.completedAt ||
      workout?.date ||
      workout?.createdAt;

    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    date.setHours(0, 0, 0, 0);

    return date;
  };

  /*
    TODAY'S WORKOUTS
  */
  const todayWorkouts = useMemo(() => {
    return workouts.filter((workout) => {
      if (!isCompletedWorkout(workout)) {
        return false;
      }

      const workoutDate =
        getWorkoutDate(workout);

      if (!workoutDate) {
        return false;
      }

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
        (Number(workout?.calories) || 0),
      0
    );
  }, [todayWorkouts]);

  /*
    TODAY'S ACTIVE MINUTES
  */
  const todayActiveMinutes = useMemo(() => {
    return todayWorkouts.reduce(
      (total, workout) =>
        total +
        (Number(
          workout?.durationMinutes
        ) || 0),
      0
    );
  }, [todayWorkouts]);

  /*
    DAILY CALORIE TARGET
  */
  const calorieTarget = 2500;

  const calorieProgress = Math.min(
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

  const remainingMinutes = Math.max(
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
            !isCompletedWorkout(workout)
          ) {
            return false;
          }

          const workoutDate =
            getWorkoutDate(workout);

          if (!workoutDate) {
            return false;
          }

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
              workout?.calories
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

  /*
    TODAY'S COMPLETED EXERCISES
  */
  const todayExercises =
    todayWorkouts.reduce(
      (total, workout) =>
        total +
        (Number(
          workout?.completedExercises
        ) || 0),
      0
    );

  /*
    LOADING STATE
  */
  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar
          navigate={navigate}
          active="calories"
        />

        <main className="calories-main">
          <div className="settings-loading">
            LOADING CALORIE DATA...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">

      <Sidebar
        navigate={navigate}
        active="calories"
      />

      <main className="calories-main">

        {/* HEADER */}

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

        {/* ERROR */}

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

        {/* OVERVIEW */}

        <section className="calorie-overview">

          {/* CALORIES */}

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

          {/* SESSIONS */}

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

          {/* WORKOUT CALORIES */}

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

          {/* ACTIVE MINUTES */}

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

        {/* CHART + NUTRITION */}

        <section className="calories-grid">

          {/* WEEKLY CALORIE CHART */}

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

          {/* NUTRITION */}

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

        {/* ACTIVITY BREAKDOWN */}

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

            {/* WORKOUT SESSIONS */}

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

            {/* WORKOUT TIME */}

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

            {/* TRAINING LOAD */}

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
                {todayExercises}{" "}
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