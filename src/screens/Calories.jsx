import {
  Activity,
  Flame,
  Footprints,
  HeartPulse,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Calories({ navigate }) {
  const activityData = [
    { day: "MON", value: 72 },
    { day: "TUE", value: 86 },
    { day: "WED", value: 64 },
    { day: "THU", value: 91 },
    { day: "FRI", value: 78 },
    { day: "SAT", value: 58 },
    { day: "SUN", value: 82 },
  ];

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="calories"
      />

      <main className="calories-main">
        <header className="calories-header">
          <div>
            <p>ENERGY & ACTIVITY MONITOR</p>
            <h1>CALORIE & ACTIVITY</h1>
            <span>
              Monitor your daily energy expenditure and movement.
            </span>
          </div>

          <button className="calories-period">
            TODAY · SEPT 14
          </button>
        </header>

        <section className="calorie-overview">
          <div className="calorie-card highlight">
            <div className="calorie-icon">
              <Flame size={19} />
            </div>

            <span>CALORIES BURNED</span>

            <strong>2,486</strong>

            <small>kcal</small>

            <div className="calorie-progress">
              <div style={{ width: "76%" }} />
            </div>

            <p>
              76% of daily target
            </p>
          </div>

          <div className="calorie-card">
            <div className="calorie-icon">
              <Footprints size={19} />
            </div>

            <span>STEPS</span>

            <strong>8,642</strong>

            <small>steps</small>

            <p>
              <TrendingUp size={12} />
              +12% from yesterday
            </p>
          </div>

          <div className="calorie-card">
            <div className="calorie-icon">
              <HeartPulse size={19} />
            </div>

            <span>AVG HEART RATE</span>

            <strong>138</strong>

            <small>bpm</small>

            <p>
              Resting · 62 bpm
            </p>
          </div>

          <div className="calorie-card">
            <div className="calorie-icon">
              <Activity size={19} />
            </div>

            <span>ACTIVE MINUTES</span>

            <strong>74</strong>

            <small>mins</small>

            <p>
              18 mins remaining
            </p>
          </div>
        </section>

        <section className="calories-grid">
          <div className="calories-card activity-chart-card">
            <div className="calories-card-heading">
              <div>
                <p>ACTIVITY HISTORY</p>
                <h2>WEEKLY CALORIE BURN</h2>
              </div>

              <span>kcal</span>
            </div>

            <div className="calories-chart">
              {activityData.map((item) => (
                <div
                  className="calories-column"
                  key={item.day}
                >
                  <div className="calories-bar-area">
                    <div
                      className="calories-bar"
                      style={{
                        height: `${item.value}%`,
                      }}
                    />
                  </div>

                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="calories-card nutrition-card">
            <div className="calories-card-heading">
              <div>
                <p>ENERGY BALANCE</p>
                <h2>TODAY'S INTAKE</h2>
              </div>
            </div>

            <div className="intake-number">
              <strong>1,842</strong>
              <span>kcal</span>
            </div>

            <div className="intake-row">
              <span>Protein</span>
              <strong>142g</strong>
            </div>

            <div className="intake-row">
              <span>Carbohydrates</span>
              <strong>184g</strong>
            </div>

            <div className="intake-row">
              <span>Fats</span>
              <strong>58g</strong>
            </div>

            <div className="energy-balance">
              <span>NET ENERGY BALANCE</span>
              <strong>-644 kcal</strong>
            </div>
          </div>
        </section>

        <section className="calories-card zones-activity">
          <div className="calories-card-heading">
            <div>
              <p>DAILY ACTIVITY</p>
              <h2>ACTIVITY BREAKDOWN</h2>
            </div>

            <span>SEPT 14</span>
          </div>

          <div className="activity-breakdown">
            <div className="activity-item">
              <div className="activity-item-icon">
                <Footprints size={17} />
              </div>

              <div>
                <span>WALKING</span>
                <strong>8,642 steps</strong>
              </div>

              <b>412 kcal</b>
            </div>

            <div className="activity-item">
              <div className="activity-item-icon">
                <Activity size={17} />
              </div>

              <div>
                <span>WORKOUT</span>
                <strong>74 active mins</strong>
              </div>

              <b>486 kcal</b>
            </div>

            <div className="activity-item">
              <div className="activity-item-icon">
                <HeartPulse size={17} />
              </div>

              <div>
                <span>CARDIO ZONE</span>
                <strong>42 active mins</strong>
              </div>

              <b>368 kcal</b>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Calories;