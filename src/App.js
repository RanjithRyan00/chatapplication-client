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
import ChatbotMessages from "./Components/ChatbotMessages";
import TranslateComponent from "./Components/TranslateComponent";

const UserContext = createContext()


function App() {


  // const axios = require('axios');

  // const options = {
  //   method: 'POST',
  //   url: 'https://rapid-translate-multi-traduction.p.rapidapi.com/t',
  //   headers: {
  //     'x-rapidapi-key': '6119bad592msh840927163e31241p1f90d7jsn877086212290',
  //     'x-rapidapi-host': 'rapid-translate-multi-traduction.p.rapidapi.com',
  //     'Content-Type': 'application/json'
  //   },
  //   data: {
  //     from: 'en',
  //     to: 'ar',
  //     q: 'Hello ! Rapid Translate Multi Traduction'
  //   }
  // };
  
  // async function translate() {
  //   try {
  //     const response = await axios.request(options);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  
  // translate();
    

  
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
            <Route path="chatbot" element={<ChatbotMessages />}></Route>
            <Route path="translate" element={<TranslateComponent />} />
          </Route>
        </Routes>
        </UserContext.Provider>
    </div>
  );
}

export {UserContext};
export default App;
