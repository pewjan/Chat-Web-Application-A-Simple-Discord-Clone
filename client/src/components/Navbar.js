import React, { useState, useContext } from "react";
import "./Navbar.css";
import discordLogo from "../images/discordlogo.png";
import { Link } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
const Navbar = () => {
  const { isLoggedIn } = useContext(LoginContext);
  return (
    <>
      <nav className="Navbar">
        <div className="mainlogo">
          <img className="discordLogo" src={discordLogo} alt="" />
          <h1> Fortnite</h1>
        </div>
        <ul className="middlelinks">
          <li>Download</li>
          <li>Nitro</li>
          <li>Safety</li>
          <li>Support</li>
          <li>Blog</li>
          <li>Careers</li>
        </ul>
        <p className="lastlink">
          <Link to={isLoggedIn ? "/app" : "/login"}>
            {isLoggedIn ? "Open Discord" : "Login"}
          </Link>
        </p>
      </nav>
    </>
  );
};

export default Navbar;
