import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import "../styles/landing.css";

const Landing = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate("/app");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="landing-hero">
          <h1 className="landing-title">GitHub Clone</h1>
          <p className="landing-subtitle">
            Collaborate, Code, and Create with your team
          </p>
          <p className="landing-description">
            A modern platform for version control, issue tracking, and team
            collaboration. Build amazing things together.
          </p>

          <div className="landing-buttons">
            <button className="btn-primary" onClick={handleGetStarted}>
              {currentUser ? "Go to Dashboard" : "Get Started"}
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate(currentUser ? "/app" : "/signup")}
            >
              {currentUser ? "View Profile" : "Sign Up"}
            </button>
          </div>
        </div>

        <div className="landing-features">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Repository Management</h3>
              <p>
                Create and manage repositories with ease. Track all your
                projects in one place.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🐛</div>
              <h3>Issue Tracking</h3>
              <p>
                Keep track of bugs, features, and improvements with our powerful
                issue system.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Collaboration</h3>
              <p>
                Work together seamlessly with your team. Create pull requests
                and review code.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Activity Dashboard</h3>
              <p>
                Visualize your contributions with heatmaps and activity
                tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
