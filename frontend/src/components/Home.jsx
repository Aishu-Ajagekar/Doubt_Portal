import React from "react";
import { Link } from "react-router-dom";
import "../../public/css/Home.css";

const Home = () => {
  const isLoggedIn = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  return (
    <div className="page-wrapper d-flex flex-column min-vh-100">
      {/* Main Content */}
      <main className="home-container flex-grow-1">
        {/* Hero */}
        <section className="hero-section text-center">
          <h1 className="hero-title">💬 DoubtPortal</h1>
          <p className="hero-subtitle">
            Real-Time Doubt Solving Platform for Students and Mentors.
          </p>

          {!isLoggedIn ? (
            <div className="hero-buttons mt-4">
              <Link to="/register" className="btn btn-lg btn-primary me-3">
                Register
              </Link>
              <Link to="/login" className="btn btn-lg btn-outline-light">
                Login
              </Link>
            </div>
          ) : role === "student" ? (
            <Link to="/student/chat" className="btn btn-success btn-lg mt-4">
              🚀 Start Chatting Now
            </Link>
          ) : (
            <Link
              to="/mentor/dashboard"
              className="btn btn-warning btn-lg mt-4"
            >
              🧑‍🏫 Go to Dashboard
            </Link>
          )}
        </section>

        {/* Features */}
        <section className="features-section mt-5">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="feature-box shadow-sm">
                <h4>⚡ Instant Chat</h4>
                <p>
                  Students connect with mentors in real-time using smooth chat
                  UI.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-box shadow-sm">
                <h4>👨‍🏫 One-on-One Sessions</h4>
                <p>
                  Mentors handle one student at a time for better focus and
                  support.
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-box shadow-sm">
                <h4>🔔 Smart Notifications</h4>
                <p>
                  Real-time updates for chat requests, availability & responses.
                  <br />
                  <br />
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="site-footer bg-dark text-white text-center  py-3 mt-auto">
        <p className="mb-1">
          © {new Date().getFullYear()} DoubtPortal. All rights reserved.
        </p>
        <div className="d-flex justify-content-center gap-3 small">
          <Link to="/" className="text-white text-decoration-none">
            About
          </Link>
          <Link to="/" className="text-white text-decoration-none">
            Contact
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-decoration-none"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
