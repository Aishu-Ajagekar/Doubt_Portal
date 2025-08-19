import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <div className="container">
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
      </div>
    </footer>
  );
};

export default Footer;
