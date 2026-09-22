import {
  Bell,
  ChevronRight,
  Eye,
  Globe,
  Lock,
  LogOut,
  Moon,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import Sidebar from "../components/Sidebar";

function Settings({ navigate }) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar navigate={navigate} active="settings" />

      <main className="settings-main">

        {/* HEADER */}
        <header className="settings-header">
          <div>
            <p>ACCOUNT CONTROL</p>
            <h1>SETTINGS</h1>
            <span>
              Manage your account, preferences and FITPULSE experience.
            </span>
          </div>
        </header>

        {/* PROFILE */}
        <section className="settings-section">

          <div className="settings-section-heading">
            <div>
              <p>ACCOUNT</p>
              <h2>PROFILE SETTINGS</h2>
            </div>

            <span>PERSONAL INFO</span>
          </div>

          <div className="settings-profile-card">

            <div className="settings-avatar">
              <UserRound size={27} />
            </div>

            <div className="settings-profile-info">
              <strong>Karthik</strong>
              <span>karthik@fitpulse.com</span>
              <small>ATHLETE LVL 14</small>
            </div>

            <button className="settings-edit-button">
              EDIT PROFILE
              <ChevronRight size={15} />
            </button>

          </div>

        </section>

        {/* PREFERENCES */}
        <section className="settings-section">

          <div className="settings-section-heading">
            <div>
              <p>EXPERIENCE</p>
              <h2>APP PREFERENCES</h2>
            </div>

            <span>3 OPTIONS</span>
          </div>

          <div className="settings-list">

            {/* DARK MODE */}
            <div className="settings-row">

              <div className="settings-row-icon">
                <Moon size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Dark Interface</strong>
                <span>
                  Use the dark FITPULSE performance interface.
                </span>
              </div>

              <button
                className={`settings-toggle ${
                  darkMode ? "active" : ""
                }`}
                onClick={() => setDarkMode(!darkMode)}
              >
                <span />
              </button>

            </div>

            {/* NOTIFICATIONS */}
            <div className="settings-row">

              <div className="settings-row-icon">
                <Bell size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Push Notifications</strong>
                <span>
                  Receive workout reminders and performance alerts.
                </span>
              </div>

              <button
                className={`settings-toggle ${
                  notifications ? "active" : ""
                }`}
                onClick={() =>
                  setNotifications(!notifications)
                }
              >
                <span />
              </button>

            </div>

            {/* PRIVACY */}
            <div className="settings-row">

              <div className="settings-row-icon">
                <Eye size={18} />
              </div>

              <div className="settings-row-content">
                <strong>Private Activity</strong>
                <span>
                  Keep your workout activity visible only to you.
                </span>
              </div>

              <button
                className={`settings-toggle ${
                  privacy ? "active" : ""
                }`}
                onClick={() => setPrivacy(!privacy)}
              >
                <span />
              </button>

            </div>

          </div>

        </section>

        {/* SECURITY */}
        <section className="settings-section">

          <div className="settings-section-heading">
            <div>
              <p>ACCOUNT PROTECTION</p>
              <h2>SECURITY & PRIVACY</h2>
            </div>

            <ShieldCheck size={18} />
          </div>

          <div className="settings-security-grid">

            <button className="settings-security-card">
              <div className="settings-security-icon">
                <Lock size={18} />
              </div>

              <div>
                <strong>CHANGE PASSWORD</strong>
                <span>
                  Update your account password.
                </span>
              </div>

              <ChevronRight size={16} />
            </button>

            <button className="settings-security-card">
              <div className="settings-security-icon">
                <Smartphone size={18} />
              </div>

              <div>
                <strong>CONNECTED DEVICES</strong>
                <span>
                  Manage devices connected to your account.
                </span>
              </div>

              <ChevronRight size={16} />
            </button>

            <button className="settings-security-card">
              <div className="settings-security-icon">
                <Globe size={18} />
              </div>

              <div>
                <strong>LANGUAGE</strong>
                <span>
                  English · United States
                </span>
              </div>

              <ChevronRight size={16} />
            </button>

          </div>

        </section>

        {/* LOGOUT */}
        <section className="settings-logout-section">

          <div>
            <p>SESSION CONTROL</p>
            <h2>SIGN OUT OF FITPULSE</h2>
            <span>
              You can sign back in anytime using your account credentials.
            </span>
          </div>

          <button
            className="settings-logout-button"
            onClick={() => navigate("landing")}
          >
            <LogOut size={16} />
            LOG OUT
          </button>

        </section>

        {/* FOOTER */}
        <footer className="settings-footer">
          <span>FITPULSE PERFORMANCE SYSTEM</span>
          <span>VERSION 2.0</span>
        </footer>

      </main>
    </div>
  );
}

export default Settings;