import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";

function Dashboard({ navigate }) {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ----------------------------------------
  // LOAD USER + WORKOUT HISTORY
  // ----------------------------------------

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("fitpulse_token");

        if (!token) {
          navigate("signin");
          return;
        }

        // ----------------------------------------
        // LOAD USER
        // ----------------------------------------

        const storedUser =
          localStorage.getItem("fitpulse_user");

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (userError) {
            console.error(
              "DASHBOARD USER PARSE ERROR:",
              userError
            );
          }
        }

        // ----------------------------------------
        // LOAD WORKOUT HISTORY
        // ----------------------------------------

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

        if (response.status === 401) {
          localStorage.removeItem("fitpulse_token");
          localStorage.removeItem("fitpulse_user");

          navigate("signin");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load workout history."
          );
        }

        // ----------------------------------------
        // HANDLE DIFFERENT BACKEND RESPONSE SHAPES
        // ----------------------------------------

        const workoutData =
          Array.isArray(data)
            ? data
            : Array.isArray(data.workouts)
            ? data.workouts
            : Array.isArray(data.history)
            ? data.history
            : [];

        setWorkouts(workoutData);
      } catch (err) {
        console.error(
          "DASHBOARD LOAD ERROR:",
          err
        );

        setError(
          err.message ||
            "Unable to connect to FITPULSE backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // ----------------------------------------
    // UPDATE DASHBOARD WHEN PROFILE CHANGES
    // ----------------------------------------

    const handleUserUpdate = () => {
      const storedUser =
        localStorage.getItem("fitpulse_user");

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error(
            "DASHBOARD USER UPDATE ERROR:",
            error
          );
        }
      }
    };

    window.addEventListener(
      "fitpulse-user-updated",
      handleUserUpdate
    );

    window.addEventListener(
      "storage",
      handleUserUpdate
    );

    return () => {
      window.removeEventListener(
        "fitpulse-user-updated",
        handleUserUpdate
      );

      window.removeEventListener(
        "storage",
        handleUserUpdate
      );
    };
  }, [navigate]);

  // ----------------------------------------
  // CURRENT DATE
  // ----------------------------------------

  const today = new Date();

  const formattedDate = today
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();

  // ----------------------------------------
  // USER NAME
  // ----------------------------------------

  const userName = user?.name || "Athlete";

  // ----------------------------------------
  // NORMALIZE WORKOUT DATE
  // ----------------------------------------

  const getWorkoutDate = (workout) => {
    const date =
      workout?.completedAt ||
      workout?.createdAt;

    if (!date) {
      return null;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate;
  };

  // ----------------------------------------
  // TODAY'S WORKOUTS
  // ----------------------------------------

  const todaysWorkouts = useMemo(() => {
    const currentDate = new Date();

    return workouts.filter((workout) => {
      const workoutDate =
        getWorkoutDate(workout);

      if (!workoutDate) {
        return false;
      }

      return (
        workoutDate.getFullYear() ===
          currentDate.getFullYear() &&
        workoutDate.getMonth() ===
          currentDate.getMonth() &&
        workoutDate.getDate() ===
          currentDate.getDate()
      );
    });
  }, [workouts]);

  // ----------------------------------------
  // TOTAL CALORIES
  // ----------------------------------------

  const totalCalories = useMemo(() => {
    return workouts.reduce((total, workout) => {
      const calories =
        Number(workout?.calories) || 0;

      return total + calories;
    }, 0);
  }, [workouts]);

  // ----------------------------------------
  // TOTAL WORKOUTS
  // ----------------------------------------

  const totalWorkouts = workouts.length;

  // ----------------------------------------
  // ACTIVE ZONE TIME
  //
  // Using durationMinutes because actual
  // wearable zone-time data is not currently
  // available in the Workout model.
  // ----------------------------------------

  const activeZoneTime = useMemo(() => {
    return workouts.reduce((total, workout) => {
      const duration =
        Number(workout?.durationMinutes) || 0;

      return total + duration;
    }, 0);
  }, [workouts]);

  // ----------------------------------------
  // WEEKLY LOAD
  // ----------------------------------------

  const weeklyLoad = useMemo(() => {
    const now = new Date();

    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);

      date.setHours(0, 0, 0, 0);

      date.setDate(
        now.getDate() - i
      );

      days.push(date);
    }

    const dayNames = days.map((date) =>
      date.toLocaleDateString("en-US", {
        weekday: "short",
      })
    );

    const rawValues = days.map((day) => {
      return workouts.reduce(
        (total, workout) => {
          const workoutDate =
            getWorkoutDate(workout);

          if (!workoutDate) {
            return total;
          }

          const sameDay =
            workoutDate.getFullYear() ===
              day.getFullYear() &&
            workoutDate.getMonth() ===
              day.getMonth() &&
            workoutDate.getDate() ===
              day.getDate();

          if (!sameDay) {
            return total;
          }

          const duration =
            Number(
              workout?.durationMinutes
            ) || 0;

          const calories =
            Number(workout?.calories) || 0;

          const score =
            Number(workout?.score) || 0;

          // Combine available workout metrics
          // to create a relative daily load.
          return (
            total +
            duration +
            calories / 20 +
            score / 2
          );
        },
        0
      );
    });

    const maxValue =
      Math.max(...rawValues, 1);

    return days.map((date, index) => ({
      day: dayNames[index],
      value:
        rawValues[index] > 0
          ? Math.max(
              8,
              Math.round(
                (rawValues[index] /
                  maxValue) *
                  100
              )
            )
          : 4,
      active:
        date.toDateString() ===
        now.toDateString(),
    }));
  }, [workouts]);

  // ----------------------------------------
  // TODAY'S FOCUS
  // ----------------------------------------

  const todayWorkout =
    todaysWorkouts.length > 0
      ? todaysWorkouts[0]
      : null;

  const focusTitle =
    todayWorkout?.title ||
    todayWorkout?.planName ||
    "NO ACTIVE WORKOUT";

  const focusType =
    todayWorkout?.type ||
    todayWorkout?.category ||
    "WORKOUT";

  const focusRpe =
    todayWorkout?.rpe !== undefined &&
    todayWorkout?.rpe !== null
      ? todayWorkout.rpe
      : "—";

  const completedExercises =
    Number(
      todayWorkout?.completedExercises
    ) || 0;

  const totalExercises =
    Number(
      todayWorkout?.totalExercises
    ) || 0;

  // ----------------------------------------
  // LOADING STATE
  // ----------------------------------------

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar
          navigate={navigate}
          active="dashboard"
        />

        <main className="dashboard-main">
          <div className="settings-loading">
            LOADING DASHBOARD...
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------
  // DASHBOARD
  // ----------------------------------------

  return (
    <div className="app-shell">

      <Sidebar
        navigate={navigate}
        active="dashboard"
      />

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <h1>
              {formattedDate}
            </h1>

            <p>
              Keep the biological load high today,{" "}
              {userName}.
            </p>

          </div>

          <div className="wearable-status">

            <span></span>

            Wearable Connected

          </div>

        </header>

        {/* ERROR */}

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

        {/* METRICS */}

        <section className="metric-grid">

          {/* CALORIES */}

          <div className="metric-card selected">

            <span>
              Total Calories Burned
            </span>

            <div>

              <strong>
                {totalCalories.toLocaleString()}
              </strong>

              <small>
                kcal
              </small>

            </div>

          </div>

          {/* HEART RATE */}

          <div className="metric-card">

            <span>
              Avg Active Heart Rate
            </span>

            <div>

              <strong>
                —
              </strong>

              <small>
                bpm
              </small>

            </div>

          </div>

          {/* ACTIVE TIME */}

          <div className="metric-card">

            <span>
              Active Zone Time
            </span>

            <div>

              <strong>
                {activeZoneTime}
              </strong>

              <small>
                mins
              </small>

            </div>

          </div>

        </section>

        {/* MAIN DASHBOARD CARDS */}

        <section className="dashboard-grid">

          {/* WEEKLY BIO LOAD */}

          <div className="dashboard-card bio-load-card">

            <div className="card-title">

              <h2>
                WEEKLY BIO LOAD
              </h2>

            </div>

            <div className="bio-chart">

              {weeklyLoad.map((item) => (

                <div
                  className="chart-column"
                  key={item.day}
                >

                  <div className="chart-bar-area">

                    <div
                      className={`chart-bar ${
                        item.active
                          ? "today"
                          : ""
                      }`}
                      style={{
                        height: `${item.value}%`,
                      }}
                    />

                  </div>

                  <span>
                    {item.day}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* METABOLIC FOCUS */}

          <div className="dashboard-card metabolic-card">

            <div className="metabolic-heading">

              <h2>
                TODAY'S METABOLIC FOCUS
              </h2>

              <span>
                RPE Target: {focusRpe}
              </span>

            </div>

            <div className="focus-tag">
              {focusType}
            </div>

            <div className="exercise-list">

              {todayWorkout ? (
                <>
                  <div>
                    <span>•</span>

                    {focusTitle}
                  </div>

                  <div>
                    <span>•</span>

                    Exercises Completed:{" "}
                    {completedExercises}
                    {totalExercises > 0
                      ? ` / ${totalExercises}`
                      : ""}
                  </div>

                  <div>
                    <span>•</span>

                    Duration:{" "}
                    {Number(
                      todayWorkout.durationMinutes
                    ) || 0}{" "}
                    mins
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span>•</span>

                    No workout completed today.
                  </div>

                  <div>
                    <span>•</span>

                    Start a workout to track
                    today's performance.
                  </div>

                  <div>
                    <span>•</span>

                    Your completed workout data
                    will appear here.
                  </div>
                </>
              )}

            </div>

            <button
              className="lime-button"
              onClick={() =>
                navigate(
                  "workout-tracking"
                )
              }
            >
              START ACTIVE SESSION
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;