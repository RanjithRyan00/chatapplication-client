import React from "react";
import logo from "../icon.png";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();

  // Check if userData and userData.data are defined
  if (!userData || !userData.data) {
    console.log("User not Authenticated");
    nav("/");
    return null; // Return null or a loading state/component
  }


  return (
    <div className={"welcome-container" + (lightTheme ? "" : " dark")}>
      <div className="welcome">
        <motion.img
          drag
          whileTap={{ scale: 1.05, rotate: 360 }}
          src={logo}
          alt="Logo"
          className="welcome-logo"
        />
        <div className="hello">
          <b>Hi, {userData.data.name} 👋</b>
        </div>
        <div className="second-line">
          {" "}
          <p>View and text directly to people present in the chat Rooms.</p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
