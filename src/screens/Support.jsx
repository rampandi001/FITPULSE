import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Mail,
  MessageCircle,
  Search,
  ShieldCheck,
  Send,
  X,
} from "lucide-react";
import { useState } from "react";

import Sidebar from "../components/Sidebar";

function Support({ navigate }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [search, setSearch] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState("");

  const faqs = [
    {
      question: "How do I start a workout?",
      answer:
        "Open Workout Plans, choose a training program and select Start Workout to begin an active session.",
    },
    {
      question: "How does workout tracking work?",
      answer:
        "During an active workout, FITPULSE tracks session time, calories, RPE and your completed sets.",
    },
    {
      question: "Where can I view my performance?",
      answer:
        "Open Analytics to review your training load, training time, calories and weekly performance data.",
    },
    {
      question: "How can I manage my subscription?",
      answer:
        "Open Subscription from the sidebar to view your current plan and available membership options.",
    },
    {
      question: "How do I change my account settings?",
      answer:
        "Open Settings from the sidebar to manage your profile, preferences, security and notifications.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  const showSupportMessage = (message) => {
    setSupportMessage(message);

    setTimeout(() => {
      setSupportMessage("");
    }, 3000);
  };

  const handleHelpArticles = () => {
    document
      .querySelector(".support-faq-section")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const handleLiveSupport = () => {
    setShowTicketForm(true);
  };

  const handleEmailSupport = () => {
    window.location.href =
      "mailto:support@fitpulse.com?subject=FITPULSE Support Request";
  };

  const handleContactSupport = () => {
    setShowTicketForm(true);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("fitpulse_token");

    if (!token) {
      localStorage.removeItem("fitpulse_token");
      localStorage.removeItem("fitpulse_user");
      navigate("signin");
      return;
    }

    if (!ticketSubject.trim()) {
      showSupportMessage("Please enter a subject.");
      return;
    }

    if (!ticketMessage.trim()) {
      showSupportMessage("Please enter your message.");
      return;
    }

    try {
      setTicketLoading(true);
      setTicketSuccess("");
      setSupportMessage("");

      const response = await fetch(
        "https://fitpulse-feid.onrender.com/api/support",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subject: ticketSubject.trim(),
            message: ticketMessage.trim(),
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
          data.message || "Failed to create support ticket."
        );
      }

      setTicketSuccess(
        `Support ticket created successfully. Ticket ID: ${
          data.ticket?.ticketId || "Created"
        }`
      );

      setTicketSubject("");
      setTicketMessage("");

      setTimeout(() => {
        setShowTicketForm(false);
        setTicketSuccess("");
      }, 3500);
    } catch (error) {
      console.error("SUPPORT TICKET ERROR:", error);

      setSupportMessage(
        error.message || "Failed to create support ticket."
      );
    } finally {
      setTicketLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar navigate={navigate} active="support" />

      <main className="support-main">
        {/* HEADER */}
        <header className="support-header">
          <div>
            <p>HELP CENTER</p>
            <h1>SUPPORT DESK</h1>
            <span>
              Find answers, explore guides or contact the FITPULSE support
              team.
            </span>
          </div>

          <div className="support-status">
            <span />
            SUPPORT CENTER
          </div>
        </header>

        {/* SUPPORT MESSAGE */}
        {supportMessage && (
          <div className="settings-error">
            {supportMessage}
          </div>
        )}

        {/* TICKET SUCCESS */}
        {ticketSuccess && (
          <div className="settings-success">
            {ticketSuccess}
          </div>
        )}

        {/* SEARCH */}
        <section className="support-search-section">
          <div className="support-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search help articles and questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </section>

        {/* QUICK HELP */}
        <section className="support-section">
          <div className="support-section-heading">
            <div>
              <p>QUICK ACCESS</p>
              <h2>HOW CAN WE HELP?</h2>
            </div>

            <span>SUPPORT CENTER</span>
          </div>

          <div className="support-help-grid">
            <button
              type="button"
              className="support-help-card"
              onClick={handleHelpArticles}
            >
              <div className="support-help-icon">
                <BookOpen size={19} />
              </div>

              <div>
                <strong>HELP ARTICLES</strong>
                <span>
                  Browse guides and useful FITPULSE information.
                </span>
              </div>

              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              className="support-help-card"
              onClick={handleLiveSupport}
            >
              <div className="support-help-icon">
                <MessageCircle size={19} />
              </div>

              <div>
                <strong>LIVE SUPPORT</strong>
                <span>
                  Connect with our support team for assistance.
                </span>
              </div>

              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              className="support-help-card"
              onClick={handleEmailSupport}
            >
              <div className="support-help-icon">
                <Mail size={19} />
              </div>

              <div>
                <strong>EMAIL SUPPORT</strong>
                <span>
                  Send us your question and we'll get back to you.
                </span>
              </div>

              <ArrowRight size={15} />
            </button>
          </div>
        </section>

        {/* FAQ + CONTACT */}
        <section className="support-content-grid">
          <div className="support-faq-section">
            <div className="support-section-heading">
              <div>
                <p>COMMON QUESTIONS</p>
                <h2>FREQUENTLY ASKED</h2>
              </div>

              <CircleHelp size={18} />
            </div>

            <div className="support-faq-list">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const faqIndex = faqs.indexOf(faq);
                  const isOpen = openFaq === faqIndex;

                  return (
                    <div
                      className={`support-faq ${
                        isOpen ? "open" : ""
                      }`}
                      key={faq.question}
                    >
                      <button
                        type="button"
                        className="support-faq-question"
                        onClick={() =>
                          setOpenFaq(
                            isOpen ? -1 : faqIndex
                          )
                        }
                      >
                        <span>{faq.question}</span>

                        <ChevronDown
                          size={17}
                          className={isOpen ? "rotate" : ""}
                        />
                      </button>

                      {isOpen && (
                        <div className="support-faq-answer">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="support-no-results">
                  <Search size={20} />

                  <strong>No results found</strong>

                  <span>
                    Try searching with a different keyword.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CONTACT CARD */}
          <aside className="support-contact-card">
            <div className="support-contact-icon">
              <ShieldCheck size={21} />
            </div>

            <p>NEED MORE HELP?</p>

            <h2>
              TALK TO
              <br />
              <span>SUPPORT.</span>
            </h2>

            <span className="support-contact-description">
              Our support team is available to help you with account,
              workout and performance questions.
            </span>

            <div className="support-contact-status">
              <span />
              Support ticket available
            </div>

            <button
              type="button"
              className="support-contact-button"
              onClick={handleContactSupport}
            >
              CONTACT SUPPORT
              <ArrowRight size={15} />
            </button>
          </aside>
        </section>

        {/* SYSTEM STATUS */}
        <section className="support-system">
          <div className="support-system-icon">
            <Activity size={19} />
          </div>

          <div className="support-system-content">
            <p>SYSTEM STATUS</p>
            <h2>BACKEND STATUS</h2>

            <span>
              FITPULSE backend availability can be checked from the
              application environment.
            </span>
          </div>

          <div className="support-system-check">
            <CheckCircle2 size={18} />
            READY
          </div>
        </section>

        {/* FOOTER */}
        <footer className="support-footer">
          <span>FITPULSE PERFORMANCE SYSTEM</span>
          <span>SUPPORT CENTER · V2.0</span>
        </footer>
      </main>

      {/* SUPPORT TICKET MODAL */}
      {showTicketForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "28px",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => {
                if (!ticketLoading) {
                  setShowTicketForm(false);
                }
              }}
              style={{
                position: "absolute",
                top: "18px",
                right: "18px",
                border: "none",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: "22px" }}>
              <p
                style={{
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                  opacity: 0.6,
                  marginBottom: "7px",
                }}
              >
                FITPULSE SUPPORT
              </p>

              <h2
                style={{
                  margin: 0,
                  fontSize: "24px",
                }}
              >
                CREATE SUPPORT TICKET
              </h2>
            </div>

            <form onSubmit={handleSubmitTicket}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    marginBottom: "8px",
                    opacity: 0.7,
                  }}
                >
                  SUBJECT
                </label>

                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) =>
                    setTicketSubject(e.target.value)
                  }
                  placeholder="What do you need help with?"
                  maxLength={150}
                  disabled={ticketLoading}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "13px 14px",
                    borderRadius: "9px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "#181818",
                    color: "#fff",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    marginBottom: "8px",
                    opacity: 0.7,
                  }}
                >
                  MESSAGE
                </label>

                <textarea
                  value={ticketMessage}
                  onChange={(e) =>
                    setTicketMessage(e.target.value)
                  }
                  placeholder="Describe your issue..."
                  maxLength={1000}
                  rows={6}
                  disabled={ticketLoading}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "13px 14px",
                    borderRadius: "9px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "#181818",
                    color: "#fff",
                    outline: "none",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={ticketLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "none",
                  borderRadius: "9px",
                  background: "#fff",
                  color: "#000",
                  fontWeight: 700,
                  cursor: ticketLoading
                    ? "not-allowed"
                    : "pointer",
                  opacity: ticketLoading ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {ticketLoading ? (
                  "SUBMITTING..."
                ) : (
                  <>
                    SUBMIT TICKET
                    <Send size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Support;