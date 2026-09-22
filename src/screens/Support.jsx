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
} from "lucide-react";
import { useState } from "react";

import Sidebar from "../components/Sidebar";

function Support({ navigate }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [search, setSearch] = useState("");

  const faqs = [
    {
      question: "How do I start a workout?",
      answer:
        "Open Workout Plans, choose a training program and select Start Workout to begin an active session.",
    },
    {
      question: "How does workout tracking work?",
      answer:
        "During an active workout, FITPULSE tracks session time, calories, heart rate, RPE and your completed sets.",
    },
    {
      question: "Where can I view my performance?",
      answer:
        "Open Analytics to review your training load, heart rate, readiness and weekly performance data.",
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
              Find answers, explore guides or contact the FITPULSE support team.
            </span>
          </div>

          <div className="support-status">
            <span />
            SUPPORT ONLINE
          </div>
        </header>

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

            <button className="support-help-card">
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

            <button className="support-help-card">
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

            <button className="support-help-card">
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
                filteredFaqs.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <div
                      className={`support-faq ${
                        isOpen ? "open" : ""
                      }`}
                      key={faq.question}
                    >

                      <button
                        className="support-faq-question"
                        onClick={() =>
                          setOpenFaq(isOpen ? -1 : index)
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
              Average response time: under 10 min
            </div>

            <button className="support-contact-button">
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
            <h2>ALL SYSTEMS OPERATIONAL</h2>
            <span>
              FITPULSE services are currently running normally.
            </span>
          </div>

          <div className="support-system-check">
            <CheckCircle2 size={18} />
            OPERATIONAL
          </div>

        </section>

        {/* FOOTER */}
        <footer className="support-footer">
          <span>FITPULSE PERFORMANCE SYSTEM</span>
          <span>SUPPORT CENTER · V2.0</span>
        </footer>

      </main>
    </div>
  );
}

export default Support;