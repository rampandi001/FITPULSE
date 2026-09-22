import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Flame,
  Trophy,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function WorkoutHistory({ navigate }) {
  const workouts = [
    {
      date: "SEP 14",
      day: "MONDAY",
      title: "Upper Push Power",
      type: "STRENGTH",
      duration: "52 min",
      calories: "486 kcal",
      score: "92",
      status: "COMPLETED",
    },
    {
      date: "SEP 12",
      day: "SATURDAY",
      title: "Lower Body Strength",
      type: "STRENGTH",
      duration: "61 min",
      calories: "574 kcal",
      score: "88",
      status: "COMPLETED",
    },
    {
      date: "SEP 10",
      day: "THURSDAY",
      title: "Conditioning Protocol",
      type: "CARDIO",
      duration: "44 min",
      calories: "521 kcal",
      score: "94",
      status: "COMPLETED",
    },
    {
      date: "SEP 08",
      day: "TUESDAY",
      title: "Pull Strength",
      type: "STRENGTH",
      duration: "56 min",
      calories: "498 kcal",
      score: "86",
      status: "COMPLETED",
    },
  ];

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="workout-history"
      />

      <main className="history-main">
        <header className="history-header">
          <div>
            <p>TRAINING RECORD</p>
            <h1>WORKOUT HISTORY</h1>
            <span>
              Review your completed training sessions and performance.
            </span>
          </div>

          <button className="history-filter">
            LAST 30 DAYS
          </button>
        </header>

        <section className="history-summary">
          <div className="history-summary-card">
            <div className="history-summary-icon">
              <Trophy size={18} />
            </div>

            <span>COMPLETED WORKOUTS</span>
            <strong>24</strong>
          </div>

          <div className="history-summary-card">
            <div className="history-summary-icon">
              <Clock3 size={18} />
            </div>

            <span>TOTAL TRAINING TIME</span>
            <strong>21h 42m</strong>
          </div>

          <div className="history-summary-card">
            <div className="history-summary-icon">
              <Flame size={18} />
            </div>

            <span>TOTAL CALORIES</span>
            <strong>12,842</strong>
          </div>
        </section>

        <section className="history-section">
          <div className="history-section-heading">
            <div>
              <p>SESSION LOG</p>
              <h2>RECENT WORKOUTS</h2>
            </div>

            <span>{workouts.length} SESSIONS</span>
          </div>

          <div className="history-list">
            {workouts.map((workout) => (
              <div
                className="history-item"
                key={workout.date}
              >
                <div className="history-date">
                  <strong>{workout.date}</strong>
                  <span>{workout.day}</span>
                </div>

                <div className="history-workout">
                  <span>{workout.type}</span>
                  <h3>{workout.title}</h3>
                </div>

                <div className="history-stat">
                  <span>DURATION</span>
                  <strong>{workout.duration}</strong>
                </div>

                <div className="history-stat">
                  <span>CALORIES</span>
                  <strong>{workout.calories}</strong>
                </div>

                <div className="history-score">
                  <span>LOAD SCORE</span>
                  <strong>{workout.score}</strong>
                </div>

                <div className="history-status">
                  <b>{workout.status}</b>

                  <button
                    onClick={() =>
                      navigate("workout-tracking")
                    }
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="history-calendar">
          <div className="history-section-heading">
            <div>
              <p>CONSISTENCY</p>
              <h2>TRAINING CALENDAR</h2>
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
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {Array.from({ length: 28 }).map((_, index) => {
              const activeDays = [
                0,
                1,
                3,
                5,
                7,
                9,
                10,
                12,
                14,
                16,
                17,
                19,
                21,
                23,
                24,
                26,
              ];

              return (
                <div
                  key={index}
                  className={
                    activeDays.includes(index)
                      ? "calendar-cell active"
                      : "calendar-cell"
                  }
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export default WorkoutHistory;