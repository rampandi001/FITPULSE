import {
  Activity,
  ArrowRight,
  Award,
  Dumbbell,
  Flame,
  HeartPulse,
  MessageCircle,
  Trophy,
  Users,
} from "lucide-react";

function Community({ navigate }) {
  const members = [
    {
      name: "ARJUN",
      level: "ATHLETE LVL 18",
      score: "9,842",
    },
    {
      name: "PRIYA",
      level: "ATHLETE LVL 16",
      score: "8,924",
    },
    {
      name: "VIKRAM",
      level: "ATHLETE LVL 14",
      score: "8,642",
    },
    {
      name: "ANANYA",
      level: "ATHLETE LVL 12",
      score: "7,986",
    },
  ];

  const posts = [
    {
      name: "ARJUN",
      time: "12 MIN AGO",
      text: "Just completed my highest-load push session. New personal best today.",
      likes: "42",
      comments: "8",
      icon: Dumbbell,
    },
    {
      name: "PRIYA",
      time: "1 HR AGO",
      text: "30 day training streak completed. Consistency is finally becoming a habit.",
      likes: "67",
      comments: "12",
      icon: Flame,
    },
    {
      name: "VIKRAM",
      time: "3 HRS AGO",
      text: "Recovery score is looking great today. Ready for another heavy session.",
      likes: "31",
      comments: "5",
      icon: HeartPulse,
    },
  ];

  return (
    <div className="community-page">

      {/* NAVBAR */}
      <header className="community-navbar">
        <button
          className="community-brand"
          onClick={() => navigate("landing")}
        >
          <div className="community-brand-icon">
            <Activity size={17} strokeWidth={3} />
          </div>

          <span>FITPULSE</span>
        </button>

        <nav className="community-nav">
          <button onClick={() => navigate("landing")}>
            OVERVIEW
          </button>

          <button onClick={() => navigate("features")}>
            FEATURES
          </button>

          <button onClick={() => navigate("workout-plans")}>
            WORKOUT PLANS
          </button>

          <button onClick={() => navigate("pricing")}>
            PRICING
          </button>

          <button className="active">
            COMMUNITY
          </button>
        </nav>

        <div className="community-actions">
          <button
            className="community-login"
            onClick={() => navigate("signin")}
          >
            LOGIN
          </button>

          <button
            className="community-join"
            onClick={() => navigate("register")}
          >
            JOIN FREE
          </button>
        </div>
      </header>

      {/* HERO */}
      <main>

        <section className="community-hero">

          <div className="community-hero-grid" />

          <div className="community-hero-content">

            <div className="community-label">
              <Users size={13} />
              FITPULSE ATHLETE NETWORK
            </div>

            <h1>
              TRAIN
              <br />
              <span>TOGETHER.</span>
            </h1>

            <p>
              Connect with athletes, share progress, discover challenges
              and push your performance beyond limits.
            </p>

            <button
              className="community-hero-button"
              onClick={() => navigate("register")}
            >
              JOIN THE COMMUNITY
              <ArrowRight size={16} />
            </button>

          </div>

          <div className="community-hero-stats">

            <div>
              <strong>12.8K</strong>
              <span>ACTIVE ATHLETES</span>
            </div>

            <div>
              <strong>48K+</strong>
              <span>WORKOUTS SHARED</span>
            </div>

            <div>
              <strong>2.4K</strong>
              <span>DAILY CHALLENGES</span>
            </div>

          </div>

        </section>

        {/* COMMUNITY CONTENT */}
        <section className="community-content">

          {/* FEED */}
          <div className="community-feed">

            <div className="community-section-heading">

              <div>
                <p>ATHLETE NETWORK</p>
                <h2>COMMUNITY FEED</h2>
              </div>

              <button className="community-sort">
                LATEST
              </button>

            </div>

            <div className="community-post-list">

              {posts.map((post, index) => {

                const Icon = post.icon;

                return (
                  <article
                    className="community-post"
                    key={index}
                  >

                    <div className="post-header">

                      <div className="post-avatar">
                        {post.name.charAt(0)}
                      </div>

                      <div className="post-user">
                        <strong>{post.name}</strong>
                        <span>{post.time}</span>
                      </div>

                      <Icon size={17} />

                    </div>

                    <p className="post-text">
                      {post.text}
                    </p>

                    <div className="post-actions">

                      <button>
                        <HeartPulse size={15} />
                        {post.likes}
                      </button>

                      <button>
                        <MessageCircle size={15} />
                        {post.comments}
                      </button>

                      <button className="post-share">
                        SHARE
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>

          </div>

          {/* LEADERBOARD */}
          <aside className="community-sidebar">

            <div className="community-section-heading">

              <div>
                <p>PERFORMANCE RANKING</p>
                <h2>TOP ATHLETES</h2>
              </div>

              <Trophy size={18} />

            </div>

            <div className="leaderboard">

              {members.map((member, index) => (

                <div
                  className="leaderboard-item"
                  key={member.name}
                >

                  <div className="leaderboard-rank">
                    0{index + 1}
                  </div>

                  <div className="leaderboard-avatar">
                    {member.name.charAt(0)}
                  </div>

                  <div className="leaderboard-user">
                    <strong>{member.name}</strong>
                    <span>{member.level}</span>
                  </div>

                  <strong className="leaderboard-score">
                    {member.score}
                  </strong>

                </div>

              ))}

            </div>

            <button className="leaderboard-button">
              VIEW FULL RANKING
              <ArrowRight size={14} />
            </button>

          </aside>

        </section>

        {/* CHALLENGE */}
        <section className="community-challenge">

          <div className="challenge-icon">
            <Award size={25} />
          </div>

          <div className="challenge-content">
            <p>ACTIVE COMMUNITY CHALLENGE</p>

            <h2>
              30 DAY PERFORMANCE STREAK
            </h2>

            <span>
              Complete at least one workout every day for 30
              consecutive days.
            </span>
          </div>

          <div className="challenge-progress">

            <strong>72%</strong>

            <div>
              <span />
            </div>

            <small>
              8,642 ATHLETES PARTICIPATING
            </small>

          </div>

          <button
            className="challenge-button"
            onClick={() => navigate("register")}
          >
            JOIN CHALLENGE
            <ArrowRight size={15} />
          </button>

        </section>

      </main>

    </div>
  );
}

export default Community;