import React, { createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import MainContainer from "./Components/MainContainer";
import Welcome from "./Components/Welcome";
import User_Groups from "./Components/User_Groups";
import ChatArea from "./Components/ChatArea";
import CreateGroups from "./Components/CreateGroups";
import Users from "./Components/Users";
import { useDispatch, useSelector } from "react-redux";
const UserContext = createContext()

function App() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);

  //using global state using useContext
  // const [refreshLeftbar, setRefreshLeftbar] = useState(false);
  const[globalSocket,setGlobalSocket]=useState()
  return (
    <div className="App">
      <UserContext.Provider value={{globalSocket,setGlobalSocket}}>
        <Routes>
          {/* <Route path="/" element= {<Login/>}></Route> */}
          <Route path="/" element={<Login />}></Route>
          <Route path="app" element={<MainContainer />}>
            <Route path="welcome" element={<Welcome />}></Route>
            <Route path="chat/:_id" element={<ChatArea />}></Route>
            <Route path="create-groups" element={<CreateGroups />}></Route>
            <Route path="user" element={<Users />}></Route>
            <Route path="groups" element={<User_Groups />}></Route>
          </Route>
        </Routes>
        </UserContext.Provider>
    </div>
  );
}

export {UserContext};
export default App;
