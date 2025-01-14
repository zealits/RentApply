import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/"><div className="logo" > Finney Properties, LLC </div> </Link>
      </nav>
    </div>
  );
}

export default Navbar;
