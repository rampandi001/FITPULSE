import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Crown,
  CreditCard,
  Smartphone,
  Zap,
} from "lucide-react";

import Sidebar from "../components/Sidebar";

function Pricing({ navigate }) {
  const plans = [
    {
      name: "CORE",
      price: 0,
      priceText: "FREE",
      description:
        "Essential fitness tracking for every athlete.",
      features: [
        "Basic workout tracking",
        "Exercise library",
        "Daily activity tracking",
        "Basic analytics",
      ],
    },
    {
      name: "PRO",
      price: 499,
      priceText: "₹499",
      period: "/ month",
      description:
        "Advanced tools for serious performance.",
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
      price: 999,
      priceText: "₹999",
      period: "/ month",
      description:
        "Maximum performance intelligence.",
      features: [
        "Everything in Pro",
        "AI performance coaching",
        "Advanced recovery metrics",
        "Priority support",
        "Custom performance goals",
      ],
    },
  ];

  const [currentPlan, setCurrentPlan] =
    useState("CORE");

  const [paymentPlan, setPaymentPlan] =
    useState(null);

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [paymentStep, setPaymentStep] =
    useState("method");

  const [processing, setProcessing] =
    useState(false);

  useEffect(() => {
    try {
      const savedPlan =
        localStorage.getItem(
          "fitpulse_subscription"
        );

      if (savedPlan) {
        setCurrentPlan(savedPlan);
      }
    } catch (error) {
      console.error(
        "SUBSCRIPTION LOAD ERROR:",
        error
      );
    }
  }, []);

  const openPayment = (plan) => {
    if (plan.name === "CORE") {
      return;
    }

    if (plan.name === currentPlan) {
      return;
    }

    setPaymentPlan(plan);
    setPaymentMethod("UPI");
    setPaymentStep("method");
    setProcessing(false);
  };

  const closePayment = () => {
    if (processing) {
      return;
    }

    setPaymentPlan(null);
  };

  const handlePayment = () => {
    if (!paymentPlan) {
      return;
    }

    setProcessing(true);
    setPaymentStep("processing");

    setTimeout(() => {
      try {
        localStorage.setItem(
          "fitpulse_subscription",
          paymentPlan.name
        );

        localStorage.setItem(
          "fitpulse_subscription_updated",
          new Date().toISOString()
        );

        localStorage.setItem(
          "fitpulse_last_transaction",
          JSON.stringify({
            id: `FP-${Date.now()}`,
            plan: paymentPlan.name,
            amount: paymentPlan.price,
            method: paymentMethod,
            status: "SUCCESS",
            paidAt:
              new Date().toISOString(),
          })
        );

        setCurrentPlan(
          paymentPlan.name
        );

        window.dispatchEvent(
          new Event(
            "fitpulse-subscription-updated"
          )
        );

        setPaymentStep("success");
        setProcessing(false);
      } catch (error) {
        console.error(
          "PAYMENT ERROR:",
          error
        );

        setProcessing(false);
        setPaymentStep("method");
      }
    }, 1800);
  };

  const selectedPlan =
    plans.find(
      (plan) =>
        plan.name === currentPlan
    );

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
              Choose the performance level
              that fits your training.
            </span>
          </div>

          <div className="billing-status">
            <span className="status-dot" />

            CURRENT PLAN: {currentPlan}
          </div>
        </header>

        <section className="pricing-plans">
          {plans.map((plan) => {
            const isCurrent =
              plan.name === currentPlan;

            return (
              <div
                className={`pricing-card ${
                  plan.popular
                    ? "popular"
                    : ""
                } ${
                  isCurrent
                    ? "selected-plan"
                    : ""
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

                <h2>
                  {plan.priceText}
                </h2>

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
                  {plan.features.map(
                    (feature) => (
                      <div
                        className="pricing-feature"
                        key={feature}
                      >
                        <Check size={14} />

                        <span>
                          {feature}
                        </span>
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  className={
                    isCurrent
                      ? "pricing-button current"
                      : "pricing-button"
                  }
                  disabled={isCurrent}
                  onClick={() =>
                    openPayment(plan)
                  }
                >
                  {isCurrent
                    ? "CURRENT PLAN"
                    : "UPGRADE PLAN"}
                </button>
              </div>
            );
          })}
        </section>

        <section className="subscription-details">
          <div>
            <p>
              YOUR CURRENT SUBSCRIPTION
            </p>

            <h2>
              {selectedPlan?.name ||
                "CORE"}{" "}
              PLAN
            </h2>

            <span>
              {currentPlan === "CORE"
                ? "Free membership active"
                : `${currentPlan} membership active`}
            </span>
          </div>

          <div className="subscription-info">
            <div>
              <span>PLAN</span>

              <strong>
                {currentPlan}
              </strong>
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

      {/* PAYMENT MODAL */}

      {paymentPlan && (
        <div className="payment-overlay">
          <div className="payment-modal">
            {paymentStep !==
              "success" && (
              <button
                type="button"
                className="payment-close"
                onClick={
                  closePayment
                }
                disabled={processing}
              >
                ×
              </button>
            )}

            {paymentStep ===
              "method" && (
              <>
                <div className="payment-header">
                  <div className="payment-title-icon">
                    <CreditCard
                      size={20}
                    />
                  </div>

                  <div>
                    <p>
                      SECURE CHECKOUT
                    </p>

                    <h2>
                      PAYMENT METHOD
                    </h2>
                  </div>
                </div>

                <div className="payment-plan-summary">
                  <div>
                    <span>
                      SELECTED PLAN
                    </span>

                    <strong>
                      {paymentPlan.name}
                    </strong>
                  </div>

                  <div>
                    <span>
                      AMOUNT
                    </span>

                    <strong>
                      ₹
                      {paymentPlan.price}
                    </strong>
                  </div>
                </div>

                <div className="payment-methods">
                  <button
                    type="button"
                    className={
                      paymentMethod ===
                      "UPI"
                        ? "payment-method active"
                        : "payment-method"
                    }
                    onClick={() =>
                      setPaymentMethod(
                        "UPI"
                      )
                    }
                  >
                    <Smartphone
                      size={19}
                    />

                    <div>
                      <strong>
                        UPI
                      </strong>

                      <span>
                        Google Pay · PhonePe
                        · Paytm
                      </span>
                    </div>

                    <span className="payment-radio">
                      {paymentMethod ===
                        "UPI" && "✓"}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={
                      paymentMethod ===
                      "CARD"
                        ? "payment-method active"
                        : "payment-method"
                    }
                    onClick={() =>
                      setPaymentMethod(
                        "CARD"
                      )
                    }
                  >
                    <CreditCard
                      size={19}
                    />

                    <div>
                      <strong>
                        CREDIT / DEBIT CARD
                      </strong>

                      <span>
                        Visa · Mastercard ·
                        RuPay
                      </span>
                    </div>

                    <span className="payment-radio">
                      {paymentMethod ===
                        "CARD" && "✓"}
                    </span>
                  </button>
                </div>

                <div className="payment-total">
                  <span>
                    TOTAL PAYABLE
                  </span>

                  <strong>
                    ₹{paymentPlan.price}
                  </strong>
                </div>

                <button
                  type="button"
                  className="pay-now-button"
                  onClick={
                    handlePayment
                  }
                >
                  PAY ₹
                  {paymentPlan.price}
                </button>

                <p className="payment-note">
                  Demo checkout. No real money
                  will be charged.
                </p>
              </>
            )}

            {paymentStep ===
              "processing" && (
              <div className="payment-processing">
                <div className="payment-loader" />

                <p>
                  PROCESSING PAYMENT
                </p>

                <h2>
                  Please wait...
                </h2>

                <span>
                  Verifying your transaction
                  securely.
                </span>
              </div>
            )}

            {paymentStep ===
              "success" && (
              <div className="payment-success">
                <div className="success-icon">
                  <CheckCircle2
                    size={34}
                  />
                </div>

                <p>
                  PAYMENT SUCCESSFUL
                </p>

                <h2>
                  {paymentPlan.name} PLAN
                  ACTIVATED
                </h2>

                <span>
                  Your FITPULSE subscription
                  has been updated successfully.
                </span>

                <div className="transaction-box">
                  <div>
                    <span>
                      TRANSACTION ID
                    </span>

                    <strong>
                      FP-
                      {JSON.parse(
                        localStorage.getItem(
                          "fitpulse_last_transaction"
                        ) || "{}"
                      ).id?.replace(
                        "FP-",
                        ""
                      ) || "SUCCESS"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      PAYMENT
                    </span>

                    <strong>
                      ₹
                      {paymentPlan.price}
                    </strong>
                  </div>

                  <div>
                    <span>
                      METHOD
                    </span>

                    <strong>
                      {paymentMethod}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="pay-now-button"
                  onClick={() =>
                    setPaymentPlan(null)
                  }
                >
                  <Check size={17} />
                  CONTINUE
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Pricing;