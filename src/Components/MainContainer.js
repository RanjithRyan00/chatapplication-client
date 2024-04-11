// import React, { useState } from 'react'; // Import useState from react
// import './Mystyles.css';
// import ChatArea from './ChatArea';
// import Leftbar from './Leftbar';
// import Welcome from './Welcome';
// import CreateGroups from './CreateGroups';
// import User_Groups from './User_Groups';
// import { Outlet } from 'react-router-dom';

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
      {/* <Welcome /> */}
      {/* <CreateGroups /> */}
      {/* <ChatArea props={conversations[0]} /> */}
      {/* <Users /> */}
      {/* <Groups /> */}
    </div>
  );
}
export default MainContainer;