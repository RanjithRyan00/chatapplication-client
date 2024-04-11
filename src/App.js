import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainContainer from './Components/MainContainer';
import Login from './Components/Login';
import Welcome from './Components/Welcome';
import User_Groups from './Components/User_Groups';
import ChatArea from './Components/ChatArea';
import CreateGroups from './Components/CreateGroups';
import Users from './Components/Users';
import { useDispatch, useSelector } from "react-redux";
function App() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="app" element={<MainContainer />}>
          <Route path="welcome" element={<Welcome />}></Route>
          <Route path="chat/:_id" element={<ChatArea />}></Route>
          <Route path="create-groups" element={<CreateGroups />}></Route>
          <Route path="user" element={<Users />}></Route>
          <Route path="groups" element={<User_Groups />}></Route>
        </Route>
      </Routes>

    </div>
  );
}

export default App;
