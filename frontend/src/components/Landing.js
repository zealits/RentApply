import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./Landing.css";
import Herovideo from "../assets/videos/hero2.mp4";
import Navbar from "./Navbar";
import AboutUs from "./AboutUs.js";

const Landing = () => {
  // State to manage loading
  const [loading, setLoading] = useState(false);

  // Function to handle button click and simulate loading
  const handleButtonClick = () => {
    setLoading(true);

    // Simulate loading for 1 second
    setTimeout(() => {
      setLoading(false);
      // After loading, navigate to the form page
      window.location.href = "/multiform"; // You can use Link instead, but this works for simulation
    }, 1000); // 1 second
  };

  return (
    <div className="overflow-hidden">
      <Navbar />
      {/* Hero Section */}
      <section className="hero">
        {/* Hero Video Background */}
        <video className="hero-video" autoPlay loop muted>
          <source src={Herovideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="hero-content">
          <h1 className="hero-title">Elevate Your Living Experience</h1>
          <p className="hero-description">Premium apartments and houses for rent in Cincinnati, OH</p>
          {/* Button with loading functionality */}
          <button className="cta-button" onClick={handleButtonClick} disabled={loading}>
            {loading ? "Loading..." : "Rental Application Form"}
          </button>
        </div>
        <div className="scroll-indicator"></div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">The Finney Difference</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Premium Locations</h3>
            <p>
              Access to exclusive properties in the most sought-after neighborhoods, carefully selected to meet the
              highest standards of luxury living.
            </p>
          </div>
          <div className="feature-card">
            <h3>Concierge Service</h3>
            <p>
              Experience white-glove service with our dedicated team of real estate professionals available 24/7 to
              cater to your every need.
            </p>
          </div>
          <div className="feature-card">
            <h3>Smart Living</h3>
            <p>
              State-of-the-art properties equipped with cutting-edge technology and modern amenities for an elevated
              lifestyle.
            </p>
          </div>
        </div>
      </section>

      <AboutUs />

      {/* Loader Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Landing;
