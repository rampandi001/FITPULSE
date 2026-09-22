import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

function SignIn({ navigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // Save login token
      localStorage.setItem("fitpulse_token", data.token);

      // Save user information
      localStorage.setItem(
        "fitpulse_user",
        JSON.stringify(data.user)
      );

      navigate("dashboard");
    } catch (error) {
      console.error(error);

      setError(
        "Cannot connect to FITPULSE server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <section className="signin-visual">
        <div className="signin-overlay" />

        <div className="signin-visual-content">
          <div className="signin-brand">
            <div className="signin-logo">
              <HeartPulse size={18} strokeWidth={3} />
            </div>

            <span>FITPULSE</span>
          </div>

          <div className="signin-quote">
            <div className="signin-line" />

            <h1>
              TRAIN
              <br />
              <span>BEYOND</span>
              <br />
              LIMITS.
            </h1>

            <p>
              Your performance journey starts with one session.
              Track smarter. Train harder. Become better.
            </p>
          </div>

          <div className="signin-visual-footer">
            <span>PERFORMANCE INTELLIGENCE PLATFORM</span>
            <span>V2.0</span>
          </div>
        </div>
      </section>

      <section className="signin-panel">
        <button
          className="signin-back"
          onClick={() => navigate("landing")}
        >
          <ArrowLeft size={16} />
          BACK TO HOME
        </button>

        <div className="signin-form-wrapper">
          <div className="signin-heading">
            <p>WELCOME BACK</p>
            <h2>LOGIN TO FITPULSE</h2>
            <span>Continue your performance journey.</span>
          </div>

          <form onSubmit={handleLogin}>
            <div className="signin-field">
              <label>EMAIL ADDRESS</label>

              <div className="signin-input">
                <Mail size={17} />

                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="signin-field">
              <div className="password-label">
                <label>PASSWORD</label>

                <button
                  type="button"
                  onClick={() =>
                    setError(
                      "Password recovery is available in the full version."
                    )
                  }
                >
                  FORGOT PASSWORD?
                </button>
              </div>

              <div className="signin-input">
                <LockKeyhole size={17} />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="signin-error">
                {error}
              </div>
            )}

            <label className="remember-row">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button
              type="submit"
              className="signin-submit"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN TO FITPULSE"}

              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="signin-security">
            <ShieldCheck size={16} />

            <div>
              <strong>SECURE LOGIN</strong>
              <span>
                Your account information is protected.
              </span>
            </div>
          </div>

          <div className="signin-register">
            <span>DON'T HAVE AN ACCOUNT?</span>

            <button onClick={() => navigate("register")}>
              CREATE ACCOUNT <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SignIn;