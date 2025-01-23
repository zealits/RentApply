import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import Logo from "../assets/images/Finnely Properties.png"

function Navbar() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/">
        <img className="logoimg" src={Logo} />
        {/* <div className="logo" > Finney Properties, LLC </div>  */}
        </Link>
      </nav>
    </div>
  );
}

export default Navbar;
