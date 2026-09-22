import { useState } from "react";
import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function WorkoutTracking({ navigate }) {
  const [paused, setPaused] = useState(false);
  const [setNumber, setSetNumber] = useState(3);

  const completeSet = () => {
    if (setNumber < 5) {
      setSetNumber(setNumber + 1);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="workout-tracking"
      />

      <main className="tracking-main">
        <header className="tracking-header">
          <button
            className="back-button"
            onClick={() => navigate("dashboard")}
          >
            <ArrowLeft size={18} />
            BACK TO DASHBOARD
          </button>

          <div className="tracking-status">
            <span></span>
            {paused ? "SESSION PAUSED" : "ACTIVE SESSION"}
          </div>
        </header>

        <div className="tracking-content">
          <div className="tracking-title">
            <p>UPPER PUSH POWER</p>

            <h1>ACTIVE WORKOUT</h1>

            <span>
              Monday, Sept 14 · Strength Session
            </span>
          </div>

          <section className="tracking-stats">
            <div className="tracking-stat">
              <span>SESSION TIME</span>
              <strong>00:24:18</strong>
            </div>

            <div className="tracking-stat">
              <span>CALORIES</span>
              <strong>
                486 <small>kcal</small>
              </strong>
            </div>

            <div className="tracking-stat">
              <span>HEART RATE</span>
              <strong>
                142 <small>bpm</small>
              </strong>
            </div>

            <div className="tracking-stat">
              <span>RPE</span>
              <strong>8.5</strong>
            </div>
          </section>

          <section className="current-exercise">
            <div className="exercise-top">
              <div>
                <p>CURRENT EXERCISE</p>

                <h2>BARBELL BENCH PRESS</h2>
              </div>

              <div className="set-progress">
                <span>SET</span>

                <strong>
                  {setNumber} / 5
                </strong>
              </div>
            </div>

            <div className="exercise-values">
              <div>
                <span>WEIGHT</span>

                <strong>
                  80 <small>KG</small>
                </strong>
              </div>

              <div>
                <span>REPS</span>

                <strong>5</strong>
              </div>

              <div>
                <span>REST</span>

                <strong>01:42</strong>
              </div>
            </div>

            <div className="progress-line">
              <div
                style={{
                  width: `${(setNumber / 5) * 100}%`,
                }}
              />
            </div>

            <button
              className="complete-set-button"
              onClick={completeSet}
              disabled={setNumber === 5}
            >
              {setNumber === 5
                ? "ALL SETS COMPLETE"
                : "COMPLETE SET"}
            </button>
          </section>

          <section className="exercise-queue">
            <div className="queue-heading">
              <h2>SESSION EXERCISES</h2>

              <span>3 EXERCISES</span>
            </div>

            <div className="queue-item active">
              <div>
                <span>01</span>

                <strong>
                  Barbell Bench Press
                </strong>
              </div>

              <p>5 × 5</p>

              <b>IN PROGRESS</b>
            </div>

            <div className="queue-item">
              <div>
                <span>02</span>

                <strong>
                  Dumbbell Incline Press
                </strong>
              </div>

              <p>4 × 8</p>

              <b>UP NEXT</b>
            </div>

            <div className="queue-item">
              <div>
                <span>03</span>

                <strong>
                  Weighted Dips
                </strong>
              </div>

              <p>3 × MAX</p>

              <b>UP NEXT</b>
            </div>
          </section>

          <div className="tracking-controls">
            <button
              className="control-button"
              onClick={() => setSetNumber(1)}
            >
              <RotateCcw size={17} />
              RESET SET
            </button>

            <button
              className="pause-button"
              onClick={() => setPaused(!paused)}
            >
              {paused ? (
                <Play size={18} />
              ) : (
                <Pause size={18} />
              )}

              {paused
                ? "RESUME SESSION"
                : "PAUSE SESSION"}
            </button>

            <button
              className="finish-button"
              onClick={() => navigate("dashboard")}
            >
              <Square size={16} />
              FINISH WORKOUT
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WorkoutTracking;