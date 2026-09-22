import {
  Activity,
  CalendarDays,
  Edit3,
  Flame,
  Target,
  UserRound,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Profile({ navigate }) {
  return (
    <div className="app-shell">
      <Sidebar navigate={navigate} active="profile" />

      <main className="profile-main">

        {/* PROFILE HEADER */}
        <section className="profile-header">

          <div className="profile-user">

            <div className="profile-avatar">
              <UserRound size={34} />
            </div>

            <div className="profile-user-info">
              <div className="profile-name-row">
                <h1>Karthik</h1>
                <span>LVL 14 ATHLETE</span>
              </div>

              <p>
                Chennai, Tamil Nadu · Premium Member since Jan 2026
              </p>
            </div>

          </div>

          <button className="profile-edit-button">
            <Edit3 size={15} />
            EDIT PROFILE
          </button>

        </section>


        {/* STATS */}
        <section className="profile-stats">

          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <Activity size={17} />
            </div>

            <strong>148 hrs</strong>

            <span>Total Active Time</span>
          </div>


          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <Flame size={17} />
            </div>

            <strong>12,450 kcal</strong>

            <span>Energy Expended</span>
          </div>


          <div className="profile-stat-card">
            <div className="profile-stat-icon">
              <Target size={17} />
            </div>

            <strong>84 workouts</strong>

            <span>Completed Sessions</span>
          </div>

        </section>


        {/* INFORMATION */}
        <section className="profile-info-grid">

          {/* PERSONAL INFO */}
          <div className="profile-info-section">

            <div className="profile-section-heading">
              <div>
                <p>PERSONAL INFORMATION</p>
                <h2>Personal Bio Info</h2>
              </div>
            </div>


            <div className="profile-fields">

              <div className="profile-field">
                <label>HEIGHT (cm)</label>

                <div className="profile-input">
                  180 cm
                </div>
              </div>


              <div className="profile-field">
                <label>TARGET WEIGHT (kg)</label>

                <div className="profile-input">
                  82 kg
                </div>
              </div>

            </div>

          </div>


          {/* FITNESS TARGETS */}
          <div className="profile-info-section">

            <div className="profile-section-heading">
              <div>
                <p>TRAINING PROFILE</p>
                <h2>Fitness Targets</h2>
              </div>
            </div>


            <div className="profile-fields">

              <div className="profile-field">
                <label>TRAINING FOCUS</label>

                <div className="profile-input">
                  Hypertrophy &amp; Stamina
                </div>
              </div>


              <div className="profile-field">
                <label>FREQUENCY PREFERENCE</label>

                <div className="profile-input">
                  5 Days / Week
                </div>
              </div>

            </div>

          </div>

        </section>


        {/* ADDITIONAL PROFILE */}
        <section className="profile-extra">

          <div className="profile-extra-card">

            <div className="profile-extra-icon">
              <CalendarDays size={18} />
            </div>

            <div>
              <span>MEMBER SINCE</span>
              <strong>JANUARY 2026</strong>
            </div>

          </div>


          <div className="profile-extra-card">

            <div className="profile-extra-icon">
              <Activity size={18} />
            </div>

            <div>
              <span>CURRENT LEVEL</span>
              <strong>ATHLETE LEVEL 14</strong>
            </div>

          </div>


          <div className="profile-extra-card">

            <div className="profile-extra-icon">
              <Target size={18} />
            </div>

            <div>
              <span>PRIMARY GOAL</span>
              <strong>BUILD PERFORMANCE</strong>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Profile;