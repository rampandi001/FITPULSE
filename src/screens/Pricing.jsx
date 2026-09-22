import {
  Check,
  Crown,
  Zap,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Pricing({ navigate }) {
  const plans = [
    {
      name: "CORE",
      price: "FREE",
      description: "Essential fitness tracking for every athlete.",
      features: [
        "Basic workout tracking",
        "Exercise library",
        "Daily activity tracking",
        "Basic analytics",
      ],
      current: true,
    },
    {
      name: "PRO",
      price: "₹499",
      period: "/ month",
      description: "Advanced tools for serious performance.",
      features: [
        "Everything in Core",
        "Advanced analytics",
        "Personalized workout plans",
        "Recovery insights",
        "Unlimited workout history",
      ],
      popular: true,
    },
    {
      name: "ELITE",
      price: "₹999",
      period: "/ month",
      description: "Maximum performance intelligence.",
      features: [
        "Everything in Pro",
        "AI performance coaching",
        "Advanced recovery metrics",
        "Priority support",
        "Custom performance goals",
      ],
    },
  ];

  return (
    <div className="app-shell">
      <Sidebar
        navigate={navigate}
        active="pricing"
      />

      <main className="pricing-main">
        <header className="pricing-header">
          <div>
            <p>MEMBERSHIP</p>
            <h1>SUBSCRIPTION</h1>
            <span>
              Choose the performance level that fits your training.
            </span>
          </div>

          <div className="billing-status">
            <span className="status-dot" />
            CURRENT PLAN: CORE
          </div>
        </header>

        <section className="pricing-plans">
          {plans.map((plan) => (
            <div
              className={`pricing-card ${
                plan.popular ? "popular" : ""
              }`}
              key={plan.name}
            >
              {plan.popular && (
                <div className="popular-label">
                  MOST POPULAR
                </div>
              )}

              <div className="pricing-icon">
                {plan.name === "ELITE" ? (
                  <Crown size={19} />
                ) : (
                  <Zap size={19} />
                )}
              </div>

              <p className="pricing-plan-name">
                {plan.name}
              </p>

              <h2>{plan.price}</h2>

              {plan.period && (
                <span className="pricing-period">
                  {plan.period}
                </span>
              )}

              <p className="pricing-description">
                {plan.description}
              </p>

              <div className="pricing-divider" />

              <div className="pricing-features">
                {plan.features.map((feature) => (
                  <div
                    className="pricing-feature"
                    key={feature}
                  >
                    <Check size={14} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={
                  plan.current
                    ? "pricing-button current"
                    : "pricing-button"
                }
                disabled={plan.current}
              >
                {plan.current
                  ? "CURRENT PLAN"
                  : "UPGRADE PLAN"}
              </button>
            </div>
          ))}
        </section>

        <section className="subscription-details">
          <div>
            <p>YOUR CURRENT SUBSCRIPTION</p>
            <h2>CORE PLAN</h2>
            <span>
              Active since September 01, 2026
            </span>
          </div>

          <div className="subscription-info">
            <div>
              <span>RENEWAL</span>
              <strong>FREE PLAN</strong>
            </div>

            <div>
              <span>STATUS</span>
              <strong className="active-text">
                ACTIVE
              </strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Pricing;