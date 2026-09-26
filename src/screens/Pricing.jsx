import { useEffect, useState } from "react";

import {
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

  const [currentPlan, setCurrentPlan] = useState("CORE");
  const [subscriptionStatus, setSubscriptionStatus] =
    useState("ACTIVE");

  const [paymentPlan, setPaymentPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] =
    useState("UPI");
  const [paymentStep, setPaymentStep] =
    useState("method");
  const [processing, setProcessing] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("fitpulse_token");

  const handleUnauthorized = () => {
    localStorage.removeItem("fitpulse_token");
    localStorage.removeItem("fitpulse_user");

    navigate("signin");
  };

  const loadSubscription = async () => {
    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://fitpulse-feid.onrender.com/api/subscription",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load subscription."
        );
      }

      const subscription =
        data.subscription || data;

      const plan =
        subscription.plan ||
        subscription.currentPlan ||
        "CORE";

      setCurrentPlan(plan);

      setSubscriptionStatus(
        subscription.status || "ACTIVE"
      );
    } catch (err) {
      console.error(
        "SUBSCRIPTION LOAD ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to load subscription."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();

    const handleSubscriptionUpdate = () => {
      loadSubscription();
    };

    window.addEventListener(
      "fitpulse-subscription-updated",
      handleSubscriptionUpdate
    );

    return () => {
      window.removeEventListener(
        "fitpulse-subscription-updated",
        handleSubscriptionUpdate
      );
    };
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
    setError("");
  };

  const closePayment = () => {
    if (processing) {
      return;
    }

    setPaymentPlan(null);
    setError("");
  };

  const handlePayment = async () => {
    if (!paymentPlan) {
      return;
    }

    const token = getToken();

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setProcessing(true);
      setPaymentStep("processing");
      setError("");

      /*
       * TEMPORARY BACKEND SUBSCRIPTION ACTIVATION
       *
       * Real Razorpay payment will replace this
       * in the next step.
       */
      const response = await fetch(
        "https://fitpulse-feid.onrender.com/api/subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan: paymentPlan.name,
            amount: paymentPlan.price,
            paymentMethod,
          }),
        }
      );

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Subscription update failed."
        );
      }

      const subscription =
        data.subscription || data;

      setCurrentPlan(
        subscription.plan ||
          paymentPlan.name
      );

      setSubscriptionStatus(
        subscription.status || "ACTIVE"
      );

      /*
       * Keep localStorage only as a local cache.
       * Backend remains the source of truth.
       */
      localStorage.setItem(
        "fitpulse_subscription",
        subscription.plan ||
          paymentPlan.name
      );

      localStorage.setItem(
        "fitpulse_subscription_updated",
        new Date().toISOString()
      );

      if (data.transactionId) {
        localStorage.setItem(
          "fitpulse_last_transaction",
          JSON.stringify({
            id: data.transactionId,
            plan:
              subscription.plan ||
              paymentPlan.name,
            amount:
              paymentPlan.price,
            method: paymentMethod,
            status:
              subscription.status ||
              "ACTIVE",
            paidAt:
              new Date().toISOString(),
          })
        );
      }

      window.dispatchEvent(
        new Event(
          "fitpulse-subscription-updated"
        )
      );

      setPaymentStep("success");
    } catch (err) {
      console.error(
        "SUBSCRIPTION PAYMENT ERROR:",
        err
      );

      setProcessing(false);
      setPaymentStep("method");

      setError(
        err.message ||
          "Unable to update subscription."
      );
    } finally {
      setProcessing(false);
    }
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

            CURRENT PLAN: {loading
              ? "LOADING..."
              : currentPlan}
          </div>
        </header>

        {error && (
          <div className="settings-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="settings-loading">
            Loading subscription...
          </div>
        ) : (
          <>
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
                    {subscriptionStatus}
                  </strong>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {paymentPlan && (
        <div className="payment-overlay">
          <div className="payment-modal">
            {paymentStep !==
              "success" && (
              <button
                type="button"
                className="payment-close"
                onClick={closePayment}
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
                    <CreditCard size={20} />
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
                      ₹{paymentPlan.price}
                    </strong>
                  </div>
                </div>

                <div className="payment-methods">
                  <button
                    type="button"
                    className={
                      paymentMethod === "UPI"
                        ? "payment-method active"
                        : "payment-method"
                    }
                    onClick={() =>
                      setPaymentMethod(
                        "UPI"
                      )
                    }
                  >
                    <Smartphone size={19} />

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
                      paymentMethod === "CARD"
                        ? "payment-method active"
                        : "payment-method"
                    }
                    onClick={() =>
                      setPaymentMethod(
                        "CARD"
                      )
                    }
                  >
                    <CreditCard size={19} />

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
                  onClick={handlePayment}
                >
                  PAY ₹
                  {paymentPlan.price}
                </button>

                <p className="payment-note">
                  Backend subscription activation
                  is connected. Real Razorpay payment
                  will be added next.
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
                  Updating your subscription
                  securely.
                </span>
              </div>
            )}

            {paymentStep ===
              "success" && (
              <div className="payment-success">
                <div className="success-icon">
                  <CheckCircle2 size={34} />
                </div>

                <p>
                  SUBSCRIPTION UPDATED
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
                      {(() => {
                        try {
                          const transaction =
                            JSON.parse(
                              localStorage.getItem(
                                "fitpulse_last_transaction"
                              ) || "{}"
                            );

                          return (
                            transaction.id ||
                            "BACKEND"
                          );
                        } catch {
                          return "BACKEND";
                        }
                      })()}
                    </strong>
                  </div>

                  <div>
                    <span>
                      PAYMENT
                    </span>

                    <strong>
                      ₹{paymentPlan.price}
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

