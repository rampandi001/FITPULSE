import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

function Dashboard({ navigate }) {
  const [user, setUser] = useState(null);

  const weeklyLoad = [
    { day: "Mon", value: 90, active: true },
    { day: "Tue", value: 52 },
    { day: "Wed", value: 68 },
    { day: "Thu", value: 38 },
    { day: "Fri", value: 78 },
    { day: "Sat", value: 44 },
    { day: "Sun", value: 61 },
  ];

  // ----------------------------------------
  // LOAD LOGGED-IN USER
  // ----------------------------------------

  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem("fitpulse_token");

        if (!token) {
          navigate("signin");
          return;
        }

        const storedUser =
          localStorage.getItem("fitpulse_user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error(
          "DASHBOARD USER ERROR:",
          error
        );
      }
    };

    loadUser();

    // Update dashboard when profile changes
    const handleUserUpdate = () => {
      loadUser();
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

        {/* METRICS */}

        <section className="metric-grid">

          <div className="metric-card selected">

            <span>
              Target Caloric Out
            </span>

            <div>

              <strong>
                3,250
              </strong>

              <small>
                kcal
              </small>

            </div>

          </div>

          <div className="metric-card">

            <span>
              Avg Active Heart Rate
            </span>

            <div>

              <strong>
                142
              </strong>

              <small>
                bpm
              </small>

            </div>

          </div>

          <div className="metric-card">

            <span>
              Active Zone Time
            </span>

            <div>

              <strong>
                45
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
                RPE Target: 8.5
              </span>

            </div>

            <div className="focus-tag">
              UPPER PUSH POWER
            </div>

            <div className="exercise-list">

              <div>

                <span>•</span>

                Barbell Bench Press
                (5 x 5)

              </div>

              <div>

                <span>•</span>

                Dumbbell Incline Press
                (4 x 8)

              </div>

              <div>

                <span>•</span>

                Weighted Dips
                (3 x max reps)

              </div>

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