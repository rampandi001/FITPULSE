import {
  Activity,
  ArrowRight,
  Heart,
  MessageCircle,
  Send,
  Users,
  Zap,
} from "lucide-react";

import { useEffect, useState } from "react";

function Community({ navigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  const [likingPostId, setLikingPostId] = useState(null);

  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [commentingPostId, setCommentingPostId] = useState(null);

  /*
    TOKEN
  */
  const getToken = () => {
    return localStorage.getItem("fitpulse_token");
  };

  /*
    UNAUTHORIZED
  */
  const handleUnauthorized = () => {
    localStorage.removeItem("fitpulse_token");
    localStorage.removeItem("fitpulse_user");

    navigate("signin");
  };

  /*
    LOAD COMMUNITY POSTS
  */
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("signin");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/community",
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
          data.message || "Failed to load community."
        );
      }

      const loadedPosts = Array.isArray(data)
        ? data
        : Array.isArray(data.posts)
        ? data.posts
        : [];

      setPosts(loadedPosts);
    } catch (err) {
      console.error("COMMUNITY LOAD ERROR:", err);

      setError(
        err.message ||
          "Unable to connect to FITPULSE backend."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
    INITIAL LOAD
  */
  useEffect(() => {
    loadPosts();
  }, []);

  /*
    SCROLL TO COMMUNITY FEED
  */
  const scrollToCommunityFeed = () => {
    const element =
      document.getElementById("community-feed");

    if (!element) {
      return;
    }

    const elementTop =
      element.getBoundingClientRect().top +
      window.scrollY;

    const navbarOffset = 80;

    window.scrollTo({
      top: Math.max(
        0,
        elementTop - navbarOffset
      ),
      behavior: "smooth",
    });
  };

  /*
    CREATE POST
  */
  const handleCreatePost = async (event) => {
    event.preventDefault();

    const content = newPost.trim();

    if (!content) {
      return;
    }

    try {
      setPosting(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("signin");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/community",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content,
            workout: "Workout Session",
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
          data.message || "Failed to create post."
        );
      }

      if (data.post) {
        setPosts((previousPosts) => [
          data.post,
          ...previousPosts,
        ]);
      }

      setNewPost("");
    } catch (err) {
      console.error("CREATE POST ERROR:", err);

      setError(
        err.message || "Failed to create post."
      );
    } finally {
      setPosting(false);
    }
  };

  /*
    LIKE / UNLIKE POST
  */
  const handleLike = async (postId) => {
    try {
      setLikingPostId(postId);

      const token = getToken();

      if (!token) {
        navigate("signin");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/community/${postId}/like`,
        {
          method: "POST",
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
            "Failed to update like."
        );
      }

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes:
                  typeof data.likes === "number"
                    ? data.likes
                    : post.likes || 0,
                liked: data.liked === true,
              }
            : post
        )
      );
    } catch (err) {
      console.error("LIKE POST ERROR:", err);

      setError(
        err.message ||
          "Failed to update like."
      );
    } finally {
      setLikingPostId(null);
    }
  };

  /*
    LOAD COMMENTS
  */
  const loadComments = async (postId) => {
    try {
      setLoadingComments((previous) => ({
        ...previous,
        [postId]: true,
      }));

      const token = getToken();

      if (!token) {
        navigate("signin");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/community/${postId}/comments`,
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
            "Failed to load comments."
        );
      }

      const loadedComments = Array.isArray(data)
        ? data
        : Array.isArray(data.comments)
        ? data.comments
        : [];

      setComments((previous) => ({
        ...previous,
        [postId]: loadedComments,
      }));
    } catch (err) {
      console.error(
        "LOAD COMMENTS ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to load comments."
      );
    } finally {
      setLoadingComments((previous) => ({
        ...previous,
        [postId]: false,
      }));
    }
  };

  /*
    TOGGLE COMMENTS
  */
  const toggleComments = async (postId) => {
    const isOpen =
      openComments[postId] === true;

    setOpenComments((previous) => ({
      ...previous,
      [postId]: !isOpen,
    }));

    if (
      !isOpen &&
      comments[postId] === undefined
    ) {
      await loadComments(postId);
    }
  };

  /*
    ADD COMMENT
  */
  const handleAddComment = async (postId) => {
    const content =
      commentText[postId]?.trim() || "";

    if (!content) {
      return;
    }

    try {
      setCommentingPostId(postId);

      const token = getToken();

      if (!token) {
        navigate("signin");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/community/${postId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content,
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
            "Failed to add comment."
        );
      }

      if (data.comment) {
        setComments((previous) => ({
          ...previous,
          [postId]: [
            ...(previous[postId] || []),
            data.comment,
          ],
        }));
      }

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments:
                  typeof data.comments === "number"
                    ? data.comments
                    : (post.comments || 0) + 1,
              }
            : post
        )
      );

      setCommentText((previous) => ({
        ...previous,
        [postId]: "",
      }));
    } catch (err) {
      console.error(
        "ADD COMMENT ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to add comment."
      );
    } finally {
      setCommentingPostId(null);
    }
  };

  /*
    ENTER KEY FOR COMMENT
  */
  const handleCommentKeyDown = (
    event,
    postId
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleAddComment(postId);
    }
  };

  /*
    FORMAT DATE
  */
  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "Just now";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    const diff =
      Date.now() - date.getTime();

    const minutes = Math.floor(
      diff / 60000
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    return `${days}d ago`;
  };

  /*
    STATS
  */
  const totalLikes = posts.reduce(
    (total, post) =>
      total + (post.likes || 0),
    0
  );

  const totalComments = posts.reduce(
    (total, post) =>
      total + (post.comments || 0),
    0
  );

  return (
    <div className="community-page">

      {/* ================================
          NAVBAR
      ================================= */}

      <nav className="community-nav">
        <div className="community-logo">
          FITPULSE
        </div>

        <div className="community-nav-links">
          <button
            onClick={() =>
              navigate("landing")
            }
          >
            Overview
          </button>

          <button
            onClick={() =>
              navigate("features")
            }
          >
            Features
          </button>

          <button
            onClick={() =>
              navigate("workout-plans")
            }
          >
            Workout Plans
          </button>

          <button
            onClick={() =>
              navigate("pricing")
            }
          >
            Pricing
          </button>

          <button className="active">
            Community
          </button>
        </div>

        <div className="community-nav-actions">
          <button
            onClick={() =>
              navigate("signin")
            }
          >
            Login
          </button>

          <button
            onClick={() =>
              navigate("register")
            }
          >
            JOIN FREE
          </button>
        </div>
      </nav>

      {/* ================================
          HERO
      ================================= */}

      <section className="community-hero">
        <div>
          <span className="community-pill">
            FITPULSE COMMUNITY
          </span>

          <h1>
            TRAIN TOGETHER.
            <br />
            <span>
              GROW TOGETHER.
            </span>
          </h1>

          <p>
            Share your journey, take on
            challenges, get inspired, and be
            part of a community that pushes
            you further.
          </p>

          <button
            type="button"
            className="community-primary-button"
            onClick={scrollToCommunityFeed}
          >
            EXPLORE COMMUNITY
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="community-hero-visual">
          <div className="community-hero-overlay">
            Stronger
            <br />
            Together
          </div>
        </div>
      </section>

      {/* ================================
          QUICK STATS
      ================================= */}

      <section className="community-stats">

        <div className="community-stat-card">
          <Users size={22} />

          <strong>
            {posts.length}
          </strong>

          <span>
            COMMUNITY POSTS
          </span>
        </div>

        <div className="community-stat-card">
          <Heart size={22} />

          <strong>
            {totalLikes}
          </strong>

          <span>
            TOTAL LIKES
          </span>
        </div>

        <div className="community-stat-card">
          <MessageCircle size={22} />

          <strong>
            {totalComments}
          </strong>

          <span>
            COMMENTS
          </span>
        </div>

        <div className="community-stat-card">
          <Zap size={22} />

          <strong>
            LIVE
          </strong>

          <span>
            COMMUNITY ACTIVITY
          </span>
        </div>

      </section>

      {/* ================================
          CREATE POST
      ================================= */}

      <section
        id="community-feed"
        className="community-feed-section"
      >

        <div className="community-section-heading">
          <div>
            <p>
              SHARE YOUR JOURNEY
            </p>

            <h2>
              CREATE A POST
            </h2>
          </div>

          <Activity size={22} />
        </div>

        {error && (
          <div
            className="settings-error"
            style={{
              marginBottom: "18px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleCreatePost}
          style={{
            background:
              "rgba(255,255,255,0.03)",
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "40px",
          }}
        >
          <textarea
            value={newPost}
            onChange={(event) =>
              setNewPost(
                event.target.value
              )
            }
            maxLength={500}
            placeholder="Share your workout, progress or motivation..."
            style={{
              width: "100%",
              minHeight: "110px",
              resize: "vertical",
              background:
                "rgba(0,0,0,0.25)",
              border:
                "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "15px",
              color: "#fff",
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginTop: "12px",
              gap: "15px",
            }}
          >
            <span
              style={{
                color:
                  "rgba(255,255,255,0.45)",
                fontSize: "12px",
              }}
            >
              {newPost.length}/500
            </span>

            <button
              type="submit"
              disabled={
                posting ||
                !newPost.trim()
              }
              className="community-primary-button"
              style={{
                opacity:
                  posting ||
                  !newPost.trim()
                    ? 0.5
                    : 1,
              }}
            >
              {posting
                ? "POSTING..."
                : "SHARE POST"}

              <Send size={15} />
            </button>
          </div>
        </form>

        {/* ================================
            RECENT POSTS
        ================================= */}

        <div className="community-section-heading">
          <div>
            <p>
              COMMUNITY ACTIVITY
            </p>

            <h2>
              RECENT POSTS
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="settings-loading">
            LOADING COMMUNITY...
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              padding: "45px 20px",
              textAlign: "center",
              border:
                "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              color:
                "rgba(255,255,255,0.55)",
            }}
          >
            <MessageCircle
              size={34}
              style={{
                marginBottom: "10px",
              }}
            />

            <p>
              No community posts yet.
            </p>

            <span>
              Be the first athlete to
              share your journey.
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            {posts.map((post) => {
              const postUser =
                post.user || {};

              const postComments =
                comments[post._id] || [];

              return (
                <article
                  key={post._id}
                  style={{
                    background:
                      "rgba(255,255,255,0.03)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    padding: "20px",
                  }}
                >

                  {/* USER */}

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "12px",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius:
                          "50%",
                        overflow: "hidden",
                        background:
                          "rgba(255,255,255,0.08)",
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        fontWeight: 700,
                      }}
                    >
                      {postUser
                        .profilePicture ? (
                        <img
                          src={
                            postUser.profilePicture
                          }
                          alt={
                            postUser.name ||
                            "Athlete"
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit:
                              "cover",
                          }}
                        />
                      ) : (
                        (
                          postUser.name ||
                          "A"
                        )
                          .charAt(0)
                          .toUpperCase()
                      )}
                    </div>

                    <div>
                      <strong
                        style={{
                          display:
                            "block",
                        }}
                      >
                        {postUser.name ||
                          "Athlete"}
                      </strong>

                      <span
                        style={{
                          fontSize:
                            "12px",
                          color:
                            "rgba(255,255,255,0.45)",
                        }}
                      >
                        {formatTime(
                          post.createdAt
                        )}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}

                  <p
                    style={{
                      lineHeight: 1.6,
                      color:
                        "rgba(255,255,255,0.82)",
                      marginBottom:
                        "16px",
                      whiteSpace:
                        "pre-wrap",
                      wordBreak:
                        "break-word",
                    }}
                  >
                    {post.content}
                  </p>

                  {post.workout && (
                    <span
                      style={{
                        display:
                          "inline-block",
                        padding:
                          "6px 10px",
                        borderRadius:
                          "20px",
                        background:
                          "rgba(130,255,70,0.08)",
                        border:
                          "1px solid rgba(130,255,70,0.18)",
                        fontSize:
                          "11px",
                        marginBottom:
                          "16px",
                      }}
                    >
                      {post.workout}
                    </span>
                  )}

                  {/* ACTIONS */}

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "18px",
                      borderTop:
                        "1px solid rgba(255,255,255,0.07)",
                      paddingTop: "14px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleLike(
                          post._id
                        )
                      }
                      disabled={
                        likingPostId ===
                        post._id
                      }
                      style={{
                        background:
                          "transparent",
                        border: "none",
                        color: post.liked
                          ? "#9cff57"
                          : "rgba(255,255,255,0.65)",
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "7px",
                        cursor:
                          "pointer",
                      }}
                    >
                      <Heart
                        size={17}
                        fill={
                          post.liked
                            ? "currentColor"
                            : "none"
                        }
                      />

                      {post.likes || 0}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleComments(
                          post._id
                        )
                      }
                      style={{
                        background:
                          "transparent",
                        border: "none",
                        color:
                          "rgba(255,255,255,0.65)",
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "7px",
                        cursor:
                          "pointer",
                      }}
                    >
                      <MessageCircle
                        size={17}
                      />

                      {post.comments ||
                        0}
                    </button>
                  </div>

                  {/* COMMENTS */}

                  {openComments[
                    post._id
                  ] && (
                    <div
                      style={{
                        marginTop:
                          "18px",
                        paddingTop:
                          "18px",
                        borderTop:
                          "1px solid rgba(255,255,255,0.07)",
                      }}
                    >

                      {loadingComments[
                        post._id
                      ] ? (
                        <p
                          style={{
                            color:
                              "rgba(255,255,255,0.45)",
                            fontSize:
                              "13px",
                          }}
                        >
                          Loading comments...
                        </p>
                      ) : postComments.length ===
                        0 ? (
                        <p
                          style={{
                            color:
                              "rgba(255,255,255,0.45)",
                            fontSize:
                              "13px",
                          }}
                        >
                          No comments yet.
                          Be the first to
                          comment.
                        </p>
                      ) : (
                        <div
                          style={{
                            display:
                              "grid",
                            gap: "14px",
                            marginBottom:
                              "15px",
                          }}
                        >
                          {postComments.map(
                            (comment) => {
                              const user =
                                comment.user ||
                                {};

                              return (
                                <div
                                  key={
                                    comment._id
                                  }
                                  style={{
                                    display:
                                      "flex",
                                    gap: "10px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width:
                                        "32px",
                                      height:
                                        "32px",
                                      minWidth:
                                        "32px",
                                      borderRadius:
                                        "50%",
                                      overflow:
                                        "hidden",
                                      background:
                                        "rgba(255,255,255,0.08)",
                                      display:
                                        "flex",
                                      alignItems:
                                        "center",
                                      justifyContent:
                                        "center",
                                      fontSize:
                                        "12px",
                                      fontWeight:
                                        700,
                                    }}
                                  >
                                    {user.profilePicture ? (
                                      <img
                                        src={
                                          user.profilePicture
                                        }
                                        alt={
                                          user.name ||
                                          "User"
                                        }
                                        style={{
                                          width:
                                            "100%",
                                          height:
                                            "100%",
                                          objectFit:
                                            "cover",
                                        }}
                                      />
                                    ) : (
                                      (
                                        user.name ||
                                        "A"
                                      )
                                        .charAt(
                                          0
                                        )
                                        .toUpperCase()
                                    )}
                                  </div>

                                  <div
                                    style={{
                                      flex: 1,
                                      background:
                                        "rgba(255,255,255,0.025)",
                                      borderRadius:
                                        "10px",
                                      padding:
                                        "9px 12px",
                                    }}
                                  >
                                    <strong
                                      style={{
                                        fontSize:
                                          "13px",
                                      }}
                                    >
                                      {user.name ||
                                        "Athlete"}
                                    </strong>

                                    <p
                                      style={{
                                        margin:
                                          "4px 0 0",
                                        fontSize:
                                          "13px",
                                        lineHeight:
                                          1.5,
                                        color:
                                          "rgba(255,255,255,0.7)",
                                        whiteSpace:
                                          "pre-wrap",
                                      }}
                                    >
                                      {
                                        comment.content
                                      }
                                    </p>

                                    <span
                                      style={{
                                        display:
                                          "block",
                                        marginTop:
                                          "5px",
                                        fontSize:
                                          "10px",
                                        color:
                                          "rgba(255,255,255,0.35)",
                                      }}
                                    >
                                      {formatTime(
                                        comment.createdAt
                                      )}
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}

                      {/* ADD COMMENT */}

                      <div
                        style={{
                          display:
                            "flex",
                          gap: "8px",
                          alignItems:
                            "center",
                        }}
                      >
                        <input
                          type="text"
                          value={
                            commentText[
                              post._id
                            ] || ""
                          }
                          onChange={(
                            event
                          ) =>
                            setCommentText(
                              (
                                previous
                              ) => ({
                                ...previous,
                                [post._id]:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                          onKeyDown={(
                            event
                          ) =>
                            handleCommentKeyDown(
                              event,
                              post._id
                            )
                          }
                          maxLength={300}
                          placeholder="Write a comment..."
                          style={{
                            flex: 1,
                            minWidth: 0,
                            background:
                              "rgba(0,0,0,0.25)",
                            border:
                              "1px solid rgba(255,255,255,0.1)",
                            borderRadius:
                              "10px",
                            padding:
                              "11px 13px",
                            color: "#fff",
                            outline:
                              "none",
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleAddComment(
                              post._id
                            )
                          }
                          disabled={
                            commentingPostId ===
                              post._id ||
                            !(
                              commentText[
                                post._id
                              ] || ""
                            ).trim()
                          }
                          style={{
                            width:
                              "42px",
                            height:
                              "42px",
                            borderRadius:
                              "10px",
                            border: "none",
                            background:
                              "#9cff57",
                            color:
                              "#071008",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            cursor:
                              "pointer",
                            opacity:
                              commentingPostId ===
                                post._id ||
                              !(
                                commentText[
                                  post._id
                                ] || ""
                              ).trim()
                                ? 0.45
                                : 1,
                          }}
                        >
                          <Send
                            size={16}
                          />
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

      </section>

      {/* ================================
          BOTTOM CTA
      ================================= */}

      <section className="community-cta">
        <div>
          <p>
            MORE THAN A WORKOUT
          </p>

          <h2>
            REAL PEOPLE.
            <br />
            <span>
              REAL PROGRESS.
            </span>
          </h2>

          <p>
            Join the community and be part
            of something bigger.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("register")
          }
        >
          JOIN COMMUNITY
          <ArrowRight size={17} />
        </button>
      </section>

    </div>
  );
}

export default Community;