import {
  Activity,
  Flame,
  HeartPulse,
  TrendingUp,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Analytics({ navigate }) {
  const weeklyData = [
    { day: "MON", value: 72 },
    { day: "TUE", value: 88 },
    { day: "WED", value: 61 },
    { day: "THU", value: 94 },
    { day: "FRI", value: 78 },
    { day: "SAT", value: 55 },
    { day: "SUN", value: 82 },
  ];

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="analytics"
      />

      <main className="analytics-main">
        <header className="analytics-header">
          <div>
            <p>PERFORMANCE OVERVIEW</p>
            <h1>ANALYTICS</h1>
            <span>
              Track your biological performance and training load.
            </span>
          </div>

          <button className="analytics-period">
            LAST 7 DAYS
          </button>
        </header>

        <section className="analytics-metrics">
          <div className="analytics-metric">
            <div className="analytics-icon">
              <Activity size={18} />
            </div>

            <span>AVG BIO LOAD</span>

            <strong>76.4</strong>

            <small>
              <TrendingUp size={12} />
              +8.2% vs last week
            </small>
          </div>

          <div className="analytics-metric">
            <div className="analytics-icon">
              <HeartPulse size={18} />
            </div>

            <span>AVG HEART RATE</span>

            <strong>138 <small>bpm</small></strong>

            <small>
              <TrendingUp size={12} />
              +4 bpm
            </small>
          </div>

          <div className="analytics-metric">
            <div className="analytics-icon">
              <Flame size={18} />
            </div>

            <span>CALORIES BURNED</span>

            <strong>14,820 <small>kcal</small></strong>

            <small>
              <TrendingUp size={12} />
              +12.6%
            </small>
          </div>
        </section>

        <section className="analytics-grid">
          <div className="analytics-card performance-card">
            <div className="analytics-card-heading">
              <div>
                <p>TRAINING LOAD</p>
                <h2>WEEKLY PERFORMANCE</h2>
              </div>

              <span>0 — 100</span>
            </div>

            <div className="analytics-chart">
              {weeklyData.map((item) => (
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

                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-card recovery-card">
            <div className="analytics-card-heading">
              <div>
                <p>RECOVERY STATUS</p>
                <h2>BODY READINESS</h2>
              </div>
            </div>

            <div className="readiness-score">
              <strong>82</strong>
              <span>%</span>
            </div>

            <div className="readiness-label">
              OPTIMAL READINESS
            </div>

            <div className="readiness-line">
              <div />
            </div>

            <div className="readiness-details">
              <div>
                <span>Sleep</span>
                <strong>86%</strong>
              </div>

              <div>
                <span>HRV</span>
                <strong>79%</strong>
              </div>

              <div>
                <span>Stress</span>
                <strong>21%</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="analytics-card zones-card">
          <div className="analytics-card-heading">
            <div>
              <p>HEART RATE ANALYSIS</p>
              <h2>ACTIVE ZONE DISTRIBUTION</h2>
            </div>

            <span>THIS WEEK</span>
          </div>

          <div className="zone-list">
            <div className="zone-row">
              <span>ZONE 1</span>

              <div className="zone-track">
                <div style={{ width: "18%" }} />
              </div>

              <strong>18%</strong>
            </div>

            <div className="zone-row">
              <span>ZONE 2</span>

              <div className="zone-track">
                <div style={{ width: "32%" }} />
              </div>

              <strong>32%</strong>
            </div>

            <div className="zone-row">
              <span>ZONE 3</span>

              <div className="zone-track">
                <div style={{ width: "27%" }} />
              </div>

              <strong>27%</strong>
            </div>

            <div className="zone-row">
              <span>ZONE 4</span>

              <div className="zone-track">
                <div style={{ width: "17%" }} />
              </div>

              <strong>17%</strong>
            </div>

            <div className="zone-row">
              <span>ZONE 5</span>

              <div className="zone-track">
                <div style={{ width: "6%" }} />
              </div>

              <strong>6%</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Analytics;