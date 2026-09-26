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
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";

function Settings({ navigate }) {
  const [user, setUser] = useState(null);

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(false);
  const [language, setLanguage] = useState("English");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD USER + SETTINGS
  // --------------------------------------------------

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("fitpulse_token");

      if (!token) {
        navigate("signin");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const storedUser = localStorage.getItem(
          "fitpulse_user"
        );

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            localStorage.removeItem("fitpulse_user");
          }
        }

        const response = await fetch(
          "https://fitpulse-feid.onrender.com/api/settings",
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
            data.message || "Failed to load settings."
          );
        }

        setDarkMode(
          typeof data.darkMode === "boolean"
            ? data.darkMode
            : true
        );

        setNotifications(
          typeof data.notifications === "boolean"
            ? data.notifications
            : true
        );

        setPrivacy(
          typeof data.privateActivity === "boolean"
            ? data.privateActivity
            : false
        );

        setLanguage(
          data.language || "English"
        );
      } catch (err) {
        console.error(
          "SETTINGS LOAD ERROR:",
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

    loadData();
  }, [navigate]);

  // --------------------------------------------------
  // SAVE SETTINGS
  // --------------------------------------------------

  const saveSettings = async (
    updatedValues = {}
  ) => {
    const token = localStorage.getItem(
      "fitpulse_token"
    );

    if (!token) {
      navigate("signin");
      return false;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const settingsToSave = {
        darkMode,
        notifications,
        privateActivity: privacy,
        language,
        ...updatedValues,
      };

      const response = await fetch(
        "https://fitpulse-feid.onrender.com/api/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settingsToSave),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("fitpulse_token");
        localStorage.removeItem("fitpulse_user");
        navigate("signin");
        return false;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save settings."
        );
      }

      const savedSettings = data.settings || data;

      setDarkMode(
        typeof savedSettings.darkMode === "boolean"
          ? savedSettings.darkMode
          : settingsToSave.darkMode
      );

      setNotifications(
        typeof savedSettings.notifications === "boolean"
          ? savedSettings.notifications
          : settingsToSave.notifications
      );

      setPrivacy(
        typeof savedSettings.privateActivity ===
          "boolean"
          ? savedSettings.privateActivity
          : settingsToSave.privateActivity
      );

      setLanguage(
        savedSettings.language ||
          settingsToSave.language ||
          "English"
      );

      window.dispatchEvent(
        new Event("fitpulse-settings-updated")
      );

      setMessage("Settings saved successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2500);

      return true;
    } catch (err) {
      console.error(
        "SETTINGS SAVE ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to FITPULSE backend."
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // TOGGLE HANDLERS
  // --------------------------------------------------

  const handleDarkMode = async () => {
    const newValue = !darkMode;

    setDarkMode(newValue);

    const success = await saveSettings({
      darkMode: newValue,
    });

    if (!success) {
      setDarkMode(!newValue);
    }
  };

  const handleNotifications = async () => {
    const newValue = !notifications;

    setNotifications(newValue);

    const success = await saveSettings({
      notifications: newValue,
    });

    if (!success) {
      setNotifications(!newValue);
    }
  };

  const handlePrivacy = async () => {
    const newValue = !privacy;

    setPrivacy(newValue);

    const success = await saveSettings({
      privateActivity: newValue,
    });

    if (!success) {
      setPrivacy(!newValue);
    }
  };

  // --------------------------------------------------
  // LANGUAGE
  // --------------------------------------------------

  const handleLanguage = async () => {
    // Only English is currently supported by the UI.
    const newLanguage = "English";

    if (language === newLanguage) {
      setMessage("English is already selected.");

      setTimeout(() => {
        setMessage("");
      }, 2500);

      return;
    }

    setLanguage(newLanguage);

    await saveSettings({
      language: newLanguage,
    });
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem("fitpulse_token");
    localStorage.removeItem("fitpulse_user");

    window.dispatchEvent(
      new Event("fitpulse-user-updated")
    );

    window.dispatchEvent(
      new Event("fitpulse-settings-updated")
    );

    navigate("landing");
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar
          navigate={navigate}
          active="settings"
        />

        <main className="settings-main">
          <div className="settings-loading">
            LOADING SETTINGS...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="settings"
      />

      <main className="settings-main">
        {/* HEADER */}

        <header className="settings-header">
          <div>
            <p>ACCOUNT CONTROL</p>

            <h1>SETTINGS</h1>

            <span>
              Manage your account, preferences and
              FITPULSE experience.
            </span>
          </div>
        </header>

        {/* STATUS MESSAGE */}

        {message && (
          <div className="settings-success">
            <Check size={16} />
            {message}
          </div>
        )}

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

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
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name || "Profile"}
                />
              ) : (
                <UserRound size={27} />
              )}
            </div>

            <div className="settings-profile-info">
              <strong>
                {user?.name || "Athlete"}
              </strong>

              <span>
                {user?.email ||
                  "No email available"}
              </span>

              <small>
                ATHLETE LVL 14
              </small>
            </div>

            <button
              type="button"
              className="settings-edit-button"
              onClick={() =>
                navigate("profile")
              }
            >
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
                <strong>
                  Dark Interface
                </strong>

                <span>
                  Use the dark FITPULSE
                  performance interface.
                </span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  darkMode ? "active" : ""
                }`}
                onClick={handleDarkMode}
                disabled={saving}
                aria-label="Toggle dark mode"
                aria-pressed={darkMode}
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
                <strong>
                  Push Notifications
                </strong>

                <span>
                  Receive workout reminders and
                  performance alerts.
                </span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  notifications ? "active" : ""
                }`}
                onClick={handleNotifications}
                disabled={saving}
                aria-label="Toggle notifications"
                aria-pressed={notifications}
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
                <strong>
                  Private Activity
                </strong>

                <span>
                  Keep your workout activity
                  visible only to you.
                </span>
              </div>

              <button
                type="button"
                className={`settings-toggle ${
                  privacy ? "active" : ""
                }`}
                onClick={handlePrivacy}
                disabled={saving}
                aria-label="Toggle private activity"
                aria-pressed={privacy}
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
            {/* CHANGE PASSWORD */}

            <button
              type="button"
              className="settings-security-card"
              onClick={() => {
                setMessage(
                  "Password management will be available soon."
                );
                setError("");
              }}
            >
              <div className="settings-security-icon">
                <Lock size={18} />
              </div>

              <div>
                <strong>
                  CHANGE PASSWORD
                </strong>

                <span>
                  Update your account password.
                </span>
              </div>

              <ChevronRight size={16} />
            </button>

            {/* DEVICES */}

            <button
              type="button"
              className="settings-security-card"
              onClick={() => {
                setMessage(
                  "Connected device management will be available soon."
                );
                setError("");
              }}
            >
              <div className="settings-security-icon">
                <Smartphone size={18} />
              </div>

              <div>
                <strong>
                  CONNECTED DEVICES
                </strong>

                <span>
                  Manage devices connected to
                  your account.
                </span>
              </div>

              <ChevronRight size={16} />
            </button>

            {/* LANGUAGE */}

            <button
              type="button"
              className="settings-security-card"
              onClick={handleLanguage}
              disabled={saving}
            >
              <div className="settings-security-icon">
                <Globe size={18} />
              </div>

              <div>
                <strong>
                  LANGUAGE
                </strong>

                <span>
                  {language} · United States
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

            <h2>
              SIGN OUT OF FITPULSE
            </h2>

            <span>
              You can sign back in anytime using
              your account credentials.
            </span>
          </div>

          <button
            type="button"
            className="settings-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={16} />

            LOG OUT
          </button>
        </section>

        {/* FOOTER */}

        <footer className="settings-footer">
          <span>
            FITPULSE PERFORMANCE SYSTEM
          </span>

          <span>
            VERSION 2.0
          </span>
        </footer>
      </main>
    </div>
  );
}

export default Settings;