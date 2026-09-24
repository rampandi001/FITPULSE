import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Flame,
  Trophy,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function WorkoutHistory({ navigate }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const loadHistory = () => {
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

        if (Array.isArray(parsedHistory)) {
          setWorkouts(parsedHistory);
        } else {
          setWorkouts([]);
        }
      } catch (error) {
        console.error(
          "WORKOUT HISTORY ERROR:",
          error
        );

        setWorkouts([]);
      }
    };

    loadHistory();

    window.addEventListener(
      "fitpulse-workout-history-updated",
      loadHistory
    );

    window.addEventListener(
      "storage",
      loadHistory
    );

    return () => {
      window.removeEventListener(
        "fitpulse-workout-history-updated",
        loadHistory
      );

      window.removeEventListener(
        "storage",
        loadHistory
      );
    };
  }, []);

  /* =====================================================
     FORMAT DATE
     ===================================================== */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return {
        date: "--",
        day: "UNKNOWN",
      };
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return {
        date: "--",
        day: "UNKNOWN",
      };
    }

    return {
      date: date
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        })
        .toUpperCase(),

      day: date
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toUpperCase(),
    };
  };

  /* =====================================================
     SUMMARY DATA
     ===================================================== */

  const summary = useMemo(() => {
    const completedWorkouts = workouts.filter(
      (workout) =>
        workout.status === "COMPLETED"
    );

    let totalMinutes = 0;
    let totalCalories = 0;

    completedWorkouts.forEach((workout) => {
      const duration =
        Number(workout.durationMinutes) || 0;

      const calories =
        Number(workout.calories) || 0;

      totalMinutes += duration;
      totalCalories += calories;
    });

    const hours = Math.floor(
      totalMinutes / 60
    );

    const minutes = totalMinutes % 60;

    return {
      completed: completedWorkouts.length,
      trainingTime:
        `${hours}h ${minutes}m`,
      calories: totalCalories.toLocaleString(),
    };
  }, [workouts]);

  /* =====================================================
     CALENDAR DATA
     ===================================================== */

  const activeDates = useMemo(() => {
    return workouts
      .filter(
        (workout) =>
          workout.status === "COMPLETED" &&
          workout.completedAt
      )
      .map((workout) => {
        const date = new Date(
          workout.completedAt
        );

        if (Number.isNaN(date.getTime())) {
          return "";
        }

        return date.toISOString().split("T")[0];
      })
      .filter(Boolean);
  }, [workouts]);

  const calendarDays = useMemo(() => {
    const today = new Date();

    const days = [];

    for (let i = 27; i >= 0; i--) {
      const date = new Date(today);

      date.setHours(0, 0, 0, 0);

      date.setDate(
        today.getDate() - i
      );

      days.push(date);
    }

    return days;
  }, []);

  const isActiveDate = (date) => {
    const key = date
      .toISOString()
      .split("T")[0];

    return activeDates.includes(key);
  };

  /* =====================================================
     OPEN WORKOUT
     ===================================================== */

  const handleWorkoutClick = (workout) => {
    try {
      if (workout.plan) {
        localStorage.setItem(
          "fitpulse_selected_plan",
          JSON.stringify(workout.plan)
        );
      }

      if (workout.exercise) {
        localStorage.setItem(
          "fitpulse_selected_exercise",
          JSON.stringify(workout.exercise)
        );
      }

      navigate("workout-tracking");
    } catch (error) {
      console.error(
        "HISTORY WORKOUT OPEN ERROR:",
        error
      );

      navigate("workout-tracking");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="workout-history"
      />

      <main className="history-main">

        {/* =================================================
            HEADER
            ================================================= */}

        <header className="history-header">
          <div>
            <p>TRAINING RECORD</p>

            <h1>
              WORKOUT HISTORY
            </h1>

            <span>
              Review your completed training
              sessions and performance.
            </span>
          </div>

          <button
            type="button"
            className="history-filter"
          >
            LAST 30 DAYS
          </button>
        </header>


        {/* =================================================
            SUMMARY
            ================================================= */}

        <section className="history-summary">

          <div className="history-summary-card">
            <div className="history-summary-icon">
              <Trophy size={18} />
            </div>

            <span>
              COMPLETED WORKOUTS
            </span>

            <strong>
              {summary.completed}
            </strong>
          </div>


          <div className="history-summary-card">
            <div className="history-summary-icon">
              <Clock3 size={18} />
            </div>

            <span>
              TOTAL TRAINING TIME
            </span>

            <strong>
              {summary.trainingTime}
            </strong>
          </div>


          <div className="history-summary-card">
            <div className="history-summary-icon">
              <Flame size={18} />
            </div>

            <span>
              TOTAL CALORIES
            </span>

            <strong>
              {summary.calories}
            </strong>
          </div>

        </section>


        {/* =================================================
            RECENT WORKOUTS
            ================================================= */}

        <section className="history-section">

          <div className="history-section-heading">
            <div>
              <p>SESSION LOG</p>

              <h2>
                RECENT WORKOUTS
              </h2>
            </div>

            <span>
              {workouts.length} SESSIONS
            </span>
          </div>


          {workouts.length === 0 ? (

            <div className="history-empty">

              <div className="history-empty-icon">
                <CalendarDays size={26} />
              </div>

              <h3>
                NO WORKOUTS YET
              </h3>

              <p>
                Complete your first workout and
                your training session will appear
                here automatically.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("workout-plans")
                }
              >
                BROWSE WORKOUT PLANS
                <ChevronRight size={15} />
              </button>

            </div>

          ) : (

            <div className="history-list">

              {workouts.map(
                (workout, index) => {

                  const formattedDate =
                    formatDate(
                      workout.completedAt ||
                        workout.date
                    );

                  return (
                    <div
                      className="history-item"
                      key={
                        workout.id ||
                        workout.completedAt ||
                        index
                      }
                    >

                      {/* DATE */}

                      <div className="history-date">

                        <strong>
                          {
                            formattedDate.date
                          }
                        </strong>

                        <span>
                          {
                            formattedDate.day
                          }
                        </span>

                      </div>


                      {/* WORKOUT */}

                      <div className="history-workout">

                        <span>
                          {
                            workout.type ||
                            workout.category ||
                            "WORKOUT"
                          }
                        </span>

                        <h3>
                          {
                            workout.title ||
                            workout.name ||
                            "Training Session"
                          }
                        </h3>

                      </div>


                      {/* DURATION */}

                      <div className="history-stat">

                        <span>
                          DURATION
                        </span>

                        <strong>
                          {workout.duration ||
                            `${
                              workout.durationMinutes ||
                              0
                            } min`}
                        </strong>

                      </div>


                      {/* CALORIES */}

                      <div className="history-stat">

                        <span>
                          CALORIES
                        </span>

                        <strong>
                          {workout.calories
                            ? `${workout.calories} kcal`
                            : "0 kcal"}
                        </strong>

                      </div>


                      {/* SCORE */}

                      <div className="history-score">

                        <span>
                          LOAD SCORE
                        </span>

                        <strong>
                          {workout.score ||
                            workout.rpe ||
                            "--"}
                        </strong>

                      </div>


                      {/* STATUS */}

                      <div className="history-status">

                        <b>
                          {
                            workout.status ||
                            "COMPLETED"
                          }
                        </b>

                        <button
                          type="button"
                          onClick={() =>
                            handleWorkoutClick(
                              workout
                            )
                          }
                          aria-label="Open workout"
                        >
                          <ChevronRight
                            size={17}
                          />
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>


        {/* =================================================
            TRAINING CALENDAR
            ================================================= */}

        <section className="history-calendar">

          <div className="history-section-heading">

            <div>
              <p>
                CONSISTENCY
              </p>

              <h2>
                TRAINING CALENDAR
              </h2>
            </div>

          </div>


          <div className="calendar-days">

            {[
              "MON",
              "TUE",
              "WED",
              "THU",
              "FRI",
              "SAT",
              "SUN",
            ].map((day) => (
              <span key={day}>
                {day}
              </span>
            ))}

          </div>


          <div className="calendar-grid">

            {calendarDays.map(
              (date, index) => {

                const active =
                  isActiveDate(date);

                return (
                  <div
                    key={index}
                    className={
                      active
                        ? "calendar-cell active"
                        : "calendar-cell"
                    }
                    title={date.toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  />
                );
              }
            )}

          </div>

        </section>

      </main>
    </div>
  );
}

export default WorkoutHistory;