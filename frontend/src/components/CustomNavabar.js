import React from "react";
import "./CustomNavbar.css";
import { Link } from "react-router-dom";
import Logo from "../assets/images/Finnely Properties.png"

function Navbar() {
  return (
    <div>
      <nav className="custom-navbar">
        <Link to="/">
        <img className="custom-logoimg" src={Logo} />
        {/* <div className="logo" > Finney Properties, LLC </div>  */}
        </Link>
      </nav>
    </div>
  );
}

export default Navbar;
