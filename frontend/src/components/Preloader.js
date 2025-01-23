import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Landing from "./Landing";
import Footer from "./Footer";
import "./Preloader.css"; // Assuming you have a separate CSS file for styles
import Logo from "../assets/images/Finnely Properties.png";

const Preloader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Keep preloader visible for at least 5 seconds
    const preloaderTimeout = setTimeout(() => {
      setIsLoaded(true);

      // Immediately after the logo animation ends, make the content visible
      const moveToTopLeftTimeout = setTimeout(() => {
        setIsVisible(true);
      }, 1000); // 2.5 seconds for moveToTopLeft animation

      return () => clearTimeout(moveToTopLeftTimeout);
    }, 2000); // Keep preloader visible for at least 5 seconds

    return () => clearTimeout(preloaderTimeout);
  }, []);

  return (
    <div>
      {/* Preloader */}
      <div className={`preloader ${isLoaded ? "loaded" : ""}`}>
        <img className="logo" src={Logo} alt="Website Logo" id="logo" />
      </div>

      {/* Content */}
      {isVisible && (
        <div>
          {/* Add your content like Navbar, Landing, Footer, etc. */}
        </div>
      )}
    </div>
  );
};

export default Preloader;
