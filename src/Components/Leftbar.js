import React, { useContext, useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LightModeIcon from "@mui/icons-material/LightMode";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/themeSlice";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";
import { UserContext } from "../App";

const ENDPOINT = "http://localhost:8080";

function Leftbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { globalSocket, setGlobalSocket } = useContext(UserContext);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();

  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData.data;

  const getConversations = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get("http://localhost:8080/chat/", config);
      if (response) {
        setConversations(response.data);
      }
    } catch (error) {
      console.log("Error occured while getting Conversations");
    }
  };

  useEffect(() => {
    getConversations();
  }, [refresh]);

  useEffect(() => {
    // const socket = io(ENDPOINT);
    if (globalSocket) {
      globalSocket.on("connect", () => {
        console.log("Socket connected on left bar");
      });

      globalSocket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      globalSocket.on("message received", (message) => {
        console.log("Left bar is refreshed due to new message");
        getConversations();
        // setRefresh(prevState => !prevState)
      });
    }
    return () => {
      // globalSocket.disconnect(); // Disconnect socket when component unmounts
    };
  }, [globalSocket]);

  // Function to handle search input change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation) => {
    const chatName = conversation.isGroupChat
      ? conversation.chatName
      : conversation.users.find((user) => user._id !== userData.data._id).name;
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="sidebar-container">
      <div className={"sb-header" + (lightTheme ? "" : " dark")}>
        <div className="other-icons">
          <IconButton
            onClick={() => {
              nav("/app/welcome");
            }}
          >
            <AccountCircleIcon
              className={"icon" + (lightTheme ? "" : " dark")}
            />
          </IconButton>

          <IconButton
            onClick={() => {
              navigate("user");
            }}
          >
            <PersonAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
            {/* <span className="tooltiptext">Available User</span> */}
          </IconButton>
          <IconButton
            onClick={() => {
              navigate("groups");
            }}
            className="tiptool"
          >
            <GroupAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
            <span className="tooltiptext">Available Groups</span>
          </IconButton>
          <IconButton
            onClick={() => {
              navigate("create-groups");
            }}
          >
            <AddCircleIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>

          <IconButton
            onClick={() => {
              dispatch(toggleTheme());
            }}
          >
            {lightTheme && (
              <NightlightIcon
                className={"icon" + (lightTheme ? "" : " dark")}
              />
            )}
            {!lightTheme && (
              <LightModeIcon className={"icon" + (lightTheme ? "" : " dark")} />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              localStorage.removeItem("userData");
              navigate("/");
            }}
          >
            <ExitToAppIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
        </div>
      </div>
      <div className={"sb-search" + (lightTheme ? "" : " dark")}>
        <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
          <SearchIcon />
        </IconButton>
        <input
          placeholder="Search"
          className={"search-box" + (lightTheme ? "" : " dark")}
          value={searchQuery} // Bind value to searchQuery state
          onChange={handleSearch} // Call handleSearch function on input change
        />
       
          <div
            className="chat-icon"
            onClick={() => {
              navigate("chatbot");
            }}
          ></div>
       
      </div>
      <div className={"sb-conversation" + (lightTheme ? "" : " dark")}>
        {filteredConversations.map((conversation, index) => {
          let chatName;
          if (conversation.isGroupChat) {
            chatName = conversation.chatName;
          } else {
            conversation.users.map((user) => {
              if (user._id != userData.data._id) {
                chatName = user.name;
              }
            });
          }
          if (!conversation.latestMessage ) {
            return (
              <div
                key={index}
                onClick={() => {
                  console.log("Refresh fired from sidebar");
                  setRefresh(!refresh);
                }}
              >
                <div
                  key={index}
                  className="conversation-container"
                  onClick={() => {
                    navigate("chat/" + conversation._id + "&" + chatName);
                  }}
                >
                  <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                    {" "}
                    {chatName[0]}{" "}
                  </p>
                  <p className={"con-title" + (lightTheme ? "" : " dark")}>
                    {" "}
                    {chatName}{" "}
                  </p>
                  <p className="con-lastMessage">
                    No previous Messages, click here to start a new chat
                  </p>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  navigate("chat/" + conversation._id + "&" + chatName);
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                  {chatName[0]}
                </p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {chatName}
                </p>
                <p className="con-lastMessage">
                  {conversation.latestMessage.content ||
                    conversation.latestMessage.file?.fileName || "Voice Message"}
                </p>
                {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                  {formatTimestamp(currentTimestamp)}
                </p> */}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Leftbar;
