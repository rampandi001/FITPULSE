import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  HeartPulse,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";

function Register({ navigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please complete all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!form.terms.checked) {
      setError("Please accept the Terms of Service.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      alert("FITPULSE account created successfully! 🎉");

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
    <div className="register-page">
      <section className="register-visual">
        <div className="register-overlay" />

        <div className="register-visual-content">
          <div className="register-brand">
            <div className="register-logo">
              <HeartPulse size={18} strokeWidth={3} />
            </div>
            <span>FITPULSE</span>
          </div>

          <div className="register-message">
            <div className="register-line" />

            <p>START YOUR JOURNEY</p>

            <h1>
              BUILD.
              <br />
              <span>TRACK.</span>
              <br />
              DOMINATE.
            </h1>

            <div className="register-points">
              <div>
                <Check size={15} />
                <span>Personalized workout tracking</span>
              </div>

              <div>
                <Check size={15} />
                <span>Advanced performance analytics</span>
              </div>

              <div>
                <Check size={15} />
                <span>Smart fitness insights</span>
              </div>
            </div>
          </div>

          <div className="register-footer">
            <span>FITPULSE PERFORMANCE SYSTEM</span>
            <span>V2.0</span>
          </div>
        </div>
      </section>

      <section className="register-panel">
        <button
          className="register-back"
          onClick={() => navigate("landing")}
        >
          <ArrowLeft size={16} />
          BACK TO HOME
        </button>

        <div className="register-form-wrapper">
          <div className="register-heading">
            <p>CREATE YOUR ACCOUNT</p>
            <h2>JOIN FITPULSE</h2>
            <span>Start building your performance profile today.</span>
          </div>

          <form onSubmit={handleRegister}>
            <div className="register-field">
              <label>FULL NAME</label>

              <div className="register-input">
                <UserRound size={17} />

                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="register-field">
              <label>EMAIL ADDRESS</label>

              <div className="register-input">
                <Mail size={17} />

                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="register-field">
              <label>PASSWORD</label>

              <div className="register-input">
                <LockKeyhole size={17} />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
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

            <div className="register-field">
              <label>CONFIRM PASSWORD</label>

              <div className="register-input">
                <LockKeyhole size={17} />

                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {error && <div className="register-error">{error}</div>}

            <label className="register-terms">
              <input name="terms" type="checkbox" />

              <span>
                I agree to the FITPULSE <b>Terms of Service</b> and{" "}
                <b>Privacy Policy</b>.
              </span>
            </label>

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE FITPULSE ACCOUNT"}

              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="register-login">
            <span>ALREADY HAVE AN ACCOUNT?</span>

            <button onClick={() => navigate("signin")}>
              LOGIN <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;