import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  Camera,
  Check,
  Edit3,
  Mail,
  Save,
  UserRound,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Profile({ navigate }) {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
    height: "",
    targetWeight: "",
    trainingFocus: "",
    frequencyPreference: "",
    fitnessGoal: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("fitpulse_token");

      if (!token) {
        navigate("signin");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "https://fitpulse-feid.onrender.com/api/profile",
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
            data.message || "Failed to load profile."
          );
        }

        const loadedProfile = {
          name: data.name || "",
          email: data.email || "",
          profilePicture: data.profilePicture || "",
          height: data.height ?? "",
          targetWeight: data.targetWeight ?? "",
          trainingFocus: data.trainingFocus || "",
          frequencyPreference:
            data.frequencyPreference || "",
          fitnessGoal: data.fitnessGoal || "",
        };

        setProfile(loadedProfile);

        const existingUser = JSON.parse(
          localStorage.getItem("fitpulse_user") || "{}"
        );

        localStorage.setItem(
          "fitpulse_user",
          JSON.stringify({
            ...existingUser,
            ...loadedProfile,
            id: data._id || existingUser.id,
          })
        );

        window.dispatchEvent(
          new Event("fitpulse-user-updated")
        );
      } catch (err) {
        console.error(
          "PROFILE LOAD ERROR:",
          err
        );

        setError(
          err.message || "Unable to connect to backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleProfilePicture = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");

        const maxSize = 400;

        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          setError("Unable to process the selected image.");
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        const compressedImage = canvas.toDataURL(
          "image/jpeg",
          0.8
        );

        setProfile((previous) => ({
          ...previous,
          profilePicture: compressedImage,
        }));

        setMessage("Profile picture selected.");
        setError("");
      };

      image.onerror = () => {
        setError("Unable to read the selected image.");
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleSave = async () => {
    const token = localStorage.getItem("fitpulse_token");

    if (!token) {
      navigate("signin");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "https://fitpulse-feid.onrender.com/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: profile.name,
            profilePicture: profile.profilePicture,
            height:
              profile.height === ""
                ? undefined
                : Number(profile.height),
            targetWeight:
              profile.targetWeight === ""
                ? undefined
                : Number(profile.targetWeight),
            trainingFocus: profile.trainingFocus,
            frequencyPreference:
              profile.frequencyPreference,
            fitnessGoal: profile.fitnessGoal,
          }),
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
          data.message || "Failed to update profile."
        );
      }

      const user = data.user || {};

      const updatedProfile = {
        name: user.name || "",
        email: user.email || "",
        profilePicture: user.profilePicture || "",
        height: user.height ?? "",
        targetWeight: user.targetWeight ?? "",
        trainingFocus: user.trainingFocus || "",
        frequencyPreference:
          user.frequencyPreference || "",
        fitnessGoal: user.fitnessGoal || "",
      };

      setProfile(updatedProfile);

      localStorage.setItem(
        "fitpulse_user",
        JSON.stringify({
          id: user.id || user._id,
          ...updatedProfile,
        })
      );

      window.dispatchEvent(
        new Event("fitpulse-user-updated")
      );

      setEditMode(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(
        "PROFILE SAVE ERROR:",
        err
      );

      setError(
        err.message || "Unable to connect to backend."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar
          navigate={navigate}
          active="profile"
        />

        <main className="profile-main">
          <div className="profile-loading">
            LOADING PROFILE...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="profile"
      />

      <main className="profile-main">
        {/* HEADER */}
        <header className="profile-header">
          <button
            type="button"
            className="profile-back-button"
            onClick={() => navigate("dashboard")}
          >
            <ArrowLeft size={16} />
            BACK TO DASHBOARD
          </button>

          <button
            type="button"
            className="profile-edit-button"
            onClick={() => {
              setEditMode(!editMode);
              setMessage("");
              setError("");
            }}
            disabled={saving}
          >
            <Edit3 size={15} />

            {editMode
              ? "CANCEL EDIT"
              : "EDIT PROFILE"}
          </button>
        </header>

        {/* TITLE */}
        <section className="profile-title-section">
          <p>ATHLETE PROFILE</p>

          <h1>
            YOUR <span>PROFILE</span>
          </h1>

          <span>
            Manage your personal information
            and training preferences.
          </span>
        </section>

        {/* SUCCESS */}
        {message && (
          <div className="profile-success">
            <Check size={16} />
            {message}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {/* PROFILE GRID */}
        <section className="profile-grid">
          {/* PROFILE CARD */}
          <div className="profile-card profile-main-card">
            <div className="profile-avatar-large">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name || "Profile"}
                />
              ) : (
                <UserRound size={38} />
              )}

              {editMode && (
                <>
                  <button
                    type="button"
                    className="profile-camera-button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    aria-label="Change profile picture"
                  >
                    <Camera size={15} />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicture}
                    style={{
                      display: "none",
                    }}
                  />
                </>
              )}
            </div>

            <h2>
              {profile.name || "Athlete"}
            </h2>

            <div className="profile-email">
              <Mail size={14} />
              {profile.email}
            </div>

            <div className="profile-level">
              <span>ATHLETE LEVEL</span>
              <strong>14</strong>
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <div className="profile-card">
            <div className="profile-card-heading">
              <div>
                <p>PERSONAL INFORMATION</p>
                <h2>ATHLETE DETAILS</h2>
              </div>
            </div>

            <div className="profile-form-grid">
              <label>
                <span>FULL NAME</span>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!editMode || saving}
                />
              </label>

              <label>
                <span>EMAIL ADDRESS</span>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                />
              </label>

              <label>
                <span>HEIGHT</span>

                <div className="profile-input-unit">
                  <input
                    type="number"
                    name="height"
                    value={profile.height}
                    onChange={handleChange}
                    disabled={!editMode || saving}
                    min="0"
                  />

                  <small>CM</small>
                </div>
              </label>

              <label>
                <span>TARGET WEIGHT</span>

                <div className="profile-input-unit">
                  <input
                    type="number"
                    name="targetWeight"
                    value={profile.targetWeight}
                    onChange={handleChange}
                    disabled={!editMode || saving}
                    min="0"
                  />

                  <small>KG</small>
                </div>
              </label>
            </div>
          </div>

          {/* TRAINING PROFILE */}
          <div className="profile-card profile-preferences-card">
            <div className="profile-card-heading">
              <div>
                <p>TRAINING PROFILE</p>
                <h2>YOUR PREFERENCES</h2>
              </div>
            </div>

            <div className="profile-form-grid">
              <label>
                <span>TRAINING FOCUS</span>

                <input
                  type="text"
                  name="trainingFocus"
                  value={profile.trainingFocus}
                  onChange={handleChange}
                  disabled={!editMode || saving}
                />
              </label>

              <label>
                <span>FREQUENCY</span>

                <input
                  type="text"
                  name="frequencyPreference"
                  value={profile.frequencyPreference}
                  onChange={handleChange}
                  disabled={!editMode || saving}
                />
              </label>

              <label className="profile-full-width">
                <span>FITNESS GOAL</span>

                <input
                  type="text"
                  name="fitnessGoal"
                  value={profile.fitnessGoal}
                  onChange={handleChange}
                  disabled={!editMode || saving}
                />
              </label>
            </div>
          </div>
        </section>

        {/* SAVE */}
        {editMode && (
          <div className="profile-save-area">
            <button
              type="button"
              className="profile-save-button"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={16} />

              {saving
                ? "SAVING..."
                : "SAVE PROFILE"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;