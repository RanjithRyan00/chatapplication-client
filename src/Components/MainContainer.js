import React, { createContext, useState } from "react";
import './Mystyles.css';
import Sidebar from "./Leftbar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
export const myContext = createContext();
function MainContainer() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const [refresh, setRefresh] = useState(true);

  return (
    <div className={"main-container" + (lightTheme ? "" : " dark")}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
        <Sidebar />
        <Outlet />
      </myContext.Provider>
    </div>
  );
}
export default MainContainer;