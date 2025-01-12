import React, { useState } from 'react';
import './Landing.css';

const Landing = () => {
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleButtonClick = () => {
    setShowGuide(true); // Show the preparation guide card
  };

  const handleCloseGuide = () => {
    setShowGuide(false); // Hide the guide without proceeding to the form
  };

  const handleProceedToForm = () => {
    setShowGuide(false); // Hide the guide
    setLoading(true); // Start loading
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/multiform'; // Navigate to the form page
    }, 1000); // Simulate 1-second loading
  };

  return (
    <div className="overflow-hidden">
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="logo">Finney Properties, LLC</div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Elevate Your Living Experience</h1>
          <p className="hero-description">
            Discover exceptional properties curated for those who appreciate refined luxury and sophisticated living.
          </p>
          <button className="cta-button" onClick={handleButtonClick}>
            Fill the Rent Application Here
          </button>
        </div>
        <div className="scroll-indicator"></div>
      </section>

      {/* Preparation Guide Card */}
      {showGuide && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-card-button" onClick={handleCloseGuide}>
              ✕
            </button>
            <h2>Instructions before you proceed.</h2>
            <p>Please prepare the following details before starting the application:</p>
            <ul>
              <li>Full property address (Street, City, State, ZIP code)</li>
              <li>Your personal details (First Name, Last Name, DOB, SSN)</li>
              <li>Contact information (Email Address, Phone Number)</li>
              <li>Details of occupants (Name, DOB, Relationship)</li>
              <li>Previous housing details (Address, Rent, Start/End Dates)</li>
              <li>Employment details (Employer Name, Address, Monthly Pay)</li>
              <li>Financial details (Bank Name, Account Type, Balance)</li>
              <li>References (Name, Phone, Relationship)</li>
            </ul>
            <button className="proceed-button" onClick={handleProceedToForm}>
              Proceed to Form
            </button>
          </div>
        </div>
      )}

<section className="features">
        <h2 className="features-title">The Finney Difference</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Premium Locations</h3>
            <p>
              Access to exclusive properties in the most sought-after neighborhoods, carefully selected to meet the highest standards of luxury living.
            </p>
          </div>
          <div className="feature-card">
            <h3>Concierge Service</h3>
            <p>
              Experience white-glove service with our dedicated team of real estate professionals available 24/7 to cater to your every need.
            </p>
          </div>
          <div className="feature-card">
            <h3>Smart Living</h3>
            <p>
              State-of-the-art properties equipped with cutting-edge technology and modern amenities for an elevated lifestyle.
            </p>
          </div>
        </div>
      </section>
      <footer>
          <p>&copy; 2025 Finney Properties, LLC. Redefining Luxury Living.</p>
          <p> Website powered by <a href='https://www.agilelabs.ai/' className='link'>www.agilelabs.ai</a> </p>
        </footer>

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