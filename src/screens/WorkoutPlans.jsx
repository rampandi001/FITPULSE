import {
  ArrowRight,
  Dumbbell,
  Flame,
  HeartPulse,
  Target,
  Zap,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function WorkoutPlans({ navigate }) {
  const plans = [
    {
      title: "UPPER PUSH POWER",
      category: "STRENGTH",
      level: "INTERMEDIATE",
      duration: "52 MIN",
      calories: "486 KCAL",
      exercises: "08 EXERCISES",
      icon: Dumbbell,
      description:
        "Build upper-body strength with a focused push training protocol.",
      accent: true,
    },
    {
      title: "LOWER BODY STRENGTH",
      category: "STRENGTH",
      level: "ADVANCED",
      duration: "61 MIN",
      calories: "574 KCAL",
      exercises: "09 EXERCISES",
      icon: Target,
      description:
        "A high-load lower-body session designed for power and stability.",
    },
    {
      title: "CONDITIONING PROTOCOL",
      category: "CARDIO",
      level: "INTERMEDIATE",
      duration: "44 MIN",
      calories: "521 KCAL",
      exercises: "06 EXERCISES",
      icon: Zap,
      description:
        "Improve cardiovascular capacity with high-intensity conditioning.",
    },
    {
      title: "PULL STRENGTH",
      category: "STRENGTH",
      level: "INTERMEDIATE",
      duration: "56 MIN",
      calories: "498 KCAL",
      exercises: "08 EXERCISES",
      icon: Dumbbell,
      description:
        "Develop back and pulling strength through progressive resistance.",
    },
    {
      title: "ATHLETIC PERFORMANCE",
      category: "PERFORMANCE",
      level: "ADVANCED",
      duration: "48 MIN",
      calories: "536 KCAL",
      exercises: "07 EXERCISES",
      icon: Flame,
      description:
        "Explosive movements and athletic drills for peak performance.",
    },
    {
      title: "RECOVERY FLOW",
      category: "RECOVERY",
      level: "BEGINNER",
      duration: "32 MIN",
      calories: "214 KCAL",
      exercises: "05 EXERCISES",
      icon: HeartPulse,
      description:
        "Low-intensity mobility and recovery work for better readiness.",
    },
  ];

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="workout-plans"
      />

      <main className="plans-main">

        {/* HEADER */}
        <header className="plans-header">
          <div>
            <p>TRAINING SYSTEM</p>

            <h1>WORKOUT PLANS</h1>

            <span>
              Structured training programs built around your
              performance goals.
            </span>
          </div>

          <button className="plans-filter">
            ALL PROGRAMS
          </button>
        </header>


        {/* FEATURED PLAN */}
        <section className="featured-plan">

          <div className="featured-content">

            <div className="featured-label">
              RECOMMENDED FOR YOU
            </div>

            <h2>
              UPPER PUSH
              <br />
              <span>POWER</span>
            </h2>

            <p>
              Your current performance focus. A high-intensity
              strength session targeting chest, shoulders and
              triceps.
            </p>

            <div className="featured-stats">
              <div>
                <span>DURATION</span>
                <strong>52 MIN</strong>
              </div>

              <div>
                <span>CALORIES</span>
                <strong>486 KCAL</strong>
              </div>

              <div>
                <span>RPE TARGET</span>
                <strong>8.5</strong>
              </div>
            </div>

            <button
              className="featured-button"
              onClick={() => navigate("workout-tracking")}
            >
              START WORKOUT
              <ArrowRight size={17} />
            </button>

          </div>

          <div className="featured-visual">
            <Dumbbell size={130} strokeWidth={0.7} />
          </div>

        </section>


        {/* PLAN LIST */}
        <section className="plans-section">

          <div className="plans-section-heading">
            <div>
              <p>TRAINING LIBRARY</p>
              <h2>ALL WORKOUT PLANS</h2>
            </div>

            <span>{plans.length} PROGRAMS</span>
          </div>


          <div className="plans-grid">

            {plans.map((plan) => {
              const Icon = plan.icon;

              return (
                <div
                  className={`plan-card ${
                    plan.accent ? "featured-card" : ""
                  }`}
                  key={plan.title}
                >

                  <div className="plan-card-top">

                    <div className="plan-icon">
                      <Icon size={19} />
                    </div>

                    <span className="plan-category">
                      {plan.category}
                    </span>

                  </div>


                  <h3>{plan.title}</h3>

                  <p className="plan-description">
                    {plan.description}
                  </p>


                  <div className="plan-meta">

                    <div>
                      <span>LEVEL</span>
                      <strong>{plan.level}</strong>
                    </div>

                    <div>
                      <span>TIME</span>
                      <strong>{plan.duration}</strong>
                    </div>

                    <div>
                      <span>LOAD</span>
                      <strong>{plan.calories}</strong>
                    </div>

                  </div>


                  <div className="plan-card-bottom">

                    <span>
                      {plan.exercises}
                    </span>

                    <button
                      onClick={() =>
                        navigate("plan-details")
                      }
                    >
                      VIEW PLAN
                      <ArrowRight size={14} />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        </section>

      </main>
    </div>
  );
}

export default WorkoutPlans;