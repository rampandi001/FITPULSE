import { useMemo, useState } from "react";
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

  const filters = [
    "ALL",
    "CHEST",
    "BACK",
    "LEGS",
    "SHOULDERS",
    "ARMS",
  ];

  const exercises = [
    {
      id: 1,
      name: "Barbell Bench Press",
      category: "CHEST",
      level: "INTERMEDIATE",
      equipment: "BARBELL",
      image: "/images/bench-press.jpg",
    },
    {
      id: 2,
      name: "Dumbbell Incline Press",
      category: "CHEST",
      level: "INTERMEDIATE",
      equipment: "DUMBBELLS",
      image: "/images/incline-press.jpg",
    },
    {
      id: 3,
      name: "Weighted Dips",
      category: "CHEST",
      level: "INTERMEDIATE",
      equipment: "DIP BARS",
      image: "/images/dips.jpg",
    },
    {
      id: 4,
      name: "Barbell Squat",
      category: "LEGS",
      level: "INTERMEDIATE",
      equipment: "BARBELL",
      image: "/images/squat.jpg",
    },
    {
      id: 5,
      name: "Conventional Deadlift",
      category: "BACK",
      level: "ADVANCED",
      equipment: "BARBELL",
      image: "/images/deadlift.jpg",
    },
    {
      id: 6,
      name: "Pull Ups",
      category: "BACK",
      level: "INTERMEDIATE",
      equipment: "BODYWEIGHT",
      image: "/images/pull-up.jpg",
    },
    {
      id: 7,
      name: "Barbell Row",
      category: "BACK",
      level: "INTERMEDIATE",
      equipment: "BARBELL",
      image: "/images/barbell-row.jpg",
    },
    {
      id: 8,
      name: "Dumbbell Shoulder Press",
      category: "SHOULDERS",
      level: "INTERMEDIATE",
      equipment: "DUMBBELLS",
      image: "/images/shoulder-press.jpg",
    },
    {
      id: 9,
      name: "Barbell Bicep Curl",
      category: "ARMS",
      level: "BEGINNER",
      equipment: "BARBELL",
      image: "/images/bicep-curl.jpg",
    },
    {
      id: 10,
      name: "Tricep Pushdown",
      category: "ARMS",
      level: "BEGINNER",
      equipment: "CABLE",
      image: "/images/tricep-pushdown.jpg",
    },
    {
      id: 11,
      name: "Leg Press",
      category: "LEGS",
      level: "INTERMEDIATE",
      equipment: "MACHINE",
      image: "/images/leg-press.jpg",
    },
    {
      id: 12,
      name: "Dumbbell Lunges",
      category: "LEGS",
      level: "BEGINNER",
      equipment: "DUMBBELLS",
      image: "/images/lunges.jpg",
    },
  ];

  const filteredExercises = useMemo(() => {
    const query = search.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesFilter =
        activeFilter === "ALL" ||
        exercise.category === activeFilter;

      const matchesSearch =
        !query ||
        exercise.name.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query) ||
        exercise.equipment.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [search, activeFilter]);

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
              Explore movements, training techniques and
              exercises built for your performance goals.
            </p>
          </div>

          <div className="exercise-library-count">
            <strong>{filteredExercises.length}</strong>
            <span>EXERCISES</span>
          </div>
        </header>

        {/* SEARCH */}
        <section className="exercise-library-toolbar">
          <div className="exercise-search">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search exercises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* EXERCISE GRID */}
        <section className="exercise-library-grid">
          {filteredExercises.map((exercise) => (
            <article
              className="exercise-library-card"
              key={exercise.id}
            >
              <div className="exercise-card-image">
                <img
                  src={exercise.image}
                  alt={exercise.name}
                />

                <div className="exercise-card-image-overlay" />

                <div className="exercise-card-number">
                  {String(exercise.id).padStart(2, "0")}
                </div>

                <div className="exercise-card-category">
                  {exercise.category}
                </div>
              </div>

              <div className="exercise-card-content">
                <div className="exercise-card-top">
                  <div>
                    <p>STRENGTH MOVEMENT</p>

                    <h2>{exercise.name}</h2>
                  </div>

                  <Dumbbell size={17} />
                </div>

                <div className="exercise-card-meta">
                  <span>{exercise.level}</span>
                  <span>{exercise.equipment}</span>
                </div>

                <button
                  className="exercise-card-button"
                  onClick={() =>
                    navigate("exercise-details")
                  }
                >
                  VIEW EXERCISE
                  <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* EMPTY STATE */}
        {filteredExercises.length === 0 && (
          <div className="exercise-empty-state">
            <Target size={28} />

            <h2>NO EXERCISES FOUND</h2>

            <p>
              Try another exercise name or select a
              different muscle group.
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