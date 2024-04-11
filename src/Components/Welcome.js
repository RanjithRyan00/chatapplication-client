import React from "react";
import logo from "../chat1.png";
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
    return null;  // Return null or a loading state/component
  }

  console.log(userData);

  return (
    <div className={"welcome-container" + (lightTheme ? "" : " dark")}>
      <motion.img
        drag
        whileTap={{ scale: 1.05, rotate: 360 }}
        src={logo}
        alt="Logo"
        className="welcome-logo"
      />
      <b>Hi, {userData.data.name} 👋</b>
      <p>View and text directly to people present in the chat Rooms.</p>
    </div>
  );
}

export default Welcome;