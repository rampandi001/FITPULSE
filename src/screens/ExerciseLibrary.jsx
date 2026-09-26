import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Dumbbell,
  Search,
  Target,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function ExerciseLibrary({ navigate }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filters = [
    "ALL",
    "CHEST",
    "BACK",
    "LEGS",
    "SHOULDERS",
    "ARMS",
  ];

  // ----------------------------------------
  // LOAD EXERCISES FROM BACKEND
  // ----------------------------------------

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("fitpulse_token");

        if (!token) {
          navigate("signin");
          return;
        }

        const response = await fetch(
          "https://fitpulse-feid.onrender.com/api/exercises",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        // ----------------------------------------
        // AUTHENTICATION ERROR
        // ----------------------------------------

        if (response.status === 401) {
          localStorage.removeItem(
            "fitpulse_token"
          );

          localStorage.removeItem(
            "fitpulse_user"
          );

          navigate("signin");
          return;
        }

        // ----------------------------------------
        // BACKEND ERROR
        // ----------------------------------------

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load exercises."
          );
        }

        // ----------------------------------------
        // HANDLE RESPONSE
        // ----------------------------------------

        const exerciseData =
          Array.isArray(data)
            ? data
            : Array.isArray(data.exercises)
            ? data.exercises
            : [];

        setExercises(exerciseData);
      } catch (err) {
        console.error(
          "EXERCISE LIBRARY LOAD ERROR:",
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

    loadExercises();
  }, [navigate]);

  // ----------------------------------------
  // FILTER + SEARCH
  // ----------------------------------------

  const filteredExercises = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return exercises.filter((exercise) => {
      const name =
        exercise?.name?.toLowerCase() || "";

      const category =
        exercise?.category?.toLowerCase() || "";

      const equipment =
        exercise?.equipment?.toLowerCase() || "";

      const matchesFilter =
        activeFilter === "ALL" ||
        exercise.category === activeFilter;

      const matchesSearch =
        !query ||
        name.includes(query) ||
        category.includes(query) ||
        equipment.includes(query);

      return (
        matchesFilter &&
        matchesSearch
      );
    });
  }, [
    exercises,
    search,
    activeFilter,
  ]);

  // ----------------------------------------
  // LOADING STATE
  // ----------------------------------------

  if (loading) {
    return (
      <div className="app-shell">
        <Sidebar
          navigate={navigate}
          active="exercise-library"
        />

        <main className="exercise-library-main">
          <div className="settings-loading">
            LOADING EXERCISE LIBRARY...
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------
  // PAGE
  // ----------------------------------------

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="exercise-library"
      />

      <main className="exercise-library-main">
        {/* HEADER */}

        <header className="exercise-library-header">
          <div>
            <p className="exercise-library-kicker">
              PERFORMANCE DATABASE
            </p>

            <h1>
              EXERCISE <span>LIBRARY</span>
            </h1>

            <p className="exercise-library-description">
              Explore movements, training
              techniques and exercises built
              for your performance goals.
            </p>
          </div>

          <div className="exercise-library-count">
            <strong>
              {filteredExercises.length}
            </strong>

            <span>EXERCISES</span>
          </div>
        </header>

        {/* ERROR */}

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

        {/* SEARCH */}

        <section className="exercise-library-toolbar">
          <div className="exercise-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="exercise-filters">
            {filters.map((filter) => (
              <button
                key={filter}
                className={
                  activeFilter === filter
                    ? "exercise-filter active"
                    : "exercise-filter"
                }
                onClick={() =>
                  setActiveFilter(filter)
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* EXERCISE GRID */}

        <section className="exercise-library-grid">
          {filteredExercises.map(
            (exercise, index) => (
              <article
                className="exercise-library-card"
                key={exercise._id}
              >
                <div className="exercise-card-image">
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                  />

                  <div className="exercise-card-image-overlay" />

                  <div className="exercise-card-number">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="exercise-card-category">
                    {exercise.category}
                  </div>
                </div>

                <div className="exercise-card-content">
                  <div className="exercise-card-top">
                    <div>
                      <p>
                        STRENGTH MOVEMENT
                      </p>

                      <h2>
                        {exercise.name}
                      </h2>
                    </div>

                    <Dumbbell size={17} />
                  </div>

                  <div className="exercise-card-meta">
                    <span>
                      {exercise.level}
                    </span>

                    <span>
                      {exercise.equipment}
                    </span>
                  </div>

                  <button
                    className="exercise-card-button"
                    onClick={() => {
                      localStorage.setItem(
                        "fitpulse_selected_exercise",
                        JSON.stringify(
                          exercise
                        )
                      );

                      navigate(
                        "exercise-details"
                      );
                    }}
                  >
                    VIEW EXERCISE

                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            )
          )}
        </section>

        {/* EMPTY STATE */}

        {filteredExercises.length === 0 && (
          <div className="exercise-empty-state">
            <Target size={28} />

            <h2>
              NO EXERCISES FOUND
            </h2>

            <p>
              {error
                ? "Unable to load exercises from the backend."
                : "Try another exercise name or select a different muscle group."}
            </p>

            <button
              onClick={() => {
                setSearch("");
                setActiveFilter("ALL");
              }}
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ExerciseLibrary;