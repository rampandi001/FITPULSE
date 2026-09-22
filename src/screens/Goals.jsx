import {
  CheckCircle2,
  Flame,
  Target,
  Trophy,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Goals({ navigate }) {
  const goals = [
    {
      title: "Weekly Calorie Target",
      current: "12,480",
      target: "18,000",
      unit: "kcal",
      progress: 69,
      icon: Flame,
    },
    {
      title: "Workout Sessions",
      current: "4",
      target: "6",
      unit: "sessions",
      progress: 67,
      icon: Target,
    },
    {
      title: "Active Zone Time",
      current: "185",
      target: "300",
      unit: "mins",
      progress: 62,
      icon: Trophy,
    },
  ];

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="goals"
      />

      <main className="goals-main">
        <header className="goals-header">
          <div>
            <p>PERFORMANCE TARGETS</p>
            <h1>GOALS</h1>
            <span>
              Set targets. Track progress. Push beyond your limits.
            </span>
          </div>

          <button className="goal-add-button">
            + CREATE NEW GOAL
          </button>
        </header>

        <section className="goal-summary">
          <div className="goal-summary-card">
            <span>ACTIVE GOALS</span>
            <strong>03</strong>
          </div>

          <div className="goal-summary-card">
            <span>COMPLETED</span>
            <strong>12</strong>
          </div>

          <div className="goal-summary-card">
            <span>SUCCESS RATE</span>
            <strong>86%</strong>
          </div>
        </section>

        <section className="goals-section">
          <div className="section-heading">
            <div>
              <p>CURRENT TARGETS</p>
              <h2>ACTIVE GOALS</h2>
            </div>

            <span>3 ACTIVE</span>
          </div>

          <div className="goal-list">
            {goals.map((goal) => {
              const Icon = goal.icon;

              return (
                <div className="goal-card" key={goal.title}>
                  <div className="goal-card-top">
                    <div className="goal-icon">
                      <Icon size={19} />
                    </div>

                    <div className="goal-info">
                      <span>ACTIVE GOAL</span>
                      <h3>{goal.title}</h3>
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
                      <strong>{goal.current}</strong>
                      <span>
                        / {goal.target} {goal.unit}
                      </span>
                    </div>

                    <button>VIEW DETAILS</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="goal-completed">
          <div className="section-heading">
            <div>
              <p>ACHIEVEMENTS</p>
              <h2>RECENTLY COMPLETED</h2>
            </div>
          </div>

          <div className="completed-card">
            <div className="completed-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <strong>10K CALORIE WEEK</strong>
              <span>
                Completed on Sept 12 · Target exceeded by 8%
              </span>
            </div>

            <b>COMPLETED</b>
          </div>

          <div className="completed-card">
            <div className="completed-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <strong>30 WORKOUT SESSIONS</strong>
              <span>
                Completed on Sept 08 · Consistency maintained
              </span>
            </div>

            <b>COMPLETED</b>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Goals;