import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from './Messageself';
import MessageOthers from './Messageothers';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8080";
var socket,chat;

function ChatArea() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [messageContent, setMessageContent] = useState("");
  const chatParams = useParams();
  
  const [chat_id, chat_user] = chatParams._id ? chatParams._id.split("&") : ['', ''];
  const [allMessages, setAllMessages] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setLoaded] = useState(false);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);

  const lightTheme = useSelector((state) => state.themeKey);  

  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
  
    axios
      .post(
        "http://localhost:8080/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then((response) => {
        const data = response.data;
        console.log("Message Fired");
        socket.emit("newMessage", data);  // Emitting the message
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connect", () => {
      setSocketConnectionStatus(true);
    });
  
    return () => {
      socket.disconnect();
    };
  }, [userData]);
  //connet to  socket
  useEffect(()=>{
    socket=io(ENDPOINT);
    socket.emit("setup,userData");
    socket.on("connection",()=>{
        setSocketConnectionStatus(!socketConnectionStatus);
    })
  },[])

   /// for new message
  
useEffect(()=>{
  socket.on("message recieved",(newMessage)=>{
    if(!allMessagesCopy || allMessagesCopy._id !==newMessage.id){

    }else{
      setAllMessages([...allMessages],newMessage);
    }
  })
})


  //fetch chats
  
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };
  
    axios
      .get("http://localhost:8080/message/" + chat_id, config)
      .then(({ data }) => {
        setAllMessages(data);
        setLoaded(true);
        socket.emit("join chat", chat_id);
      })
    setAllMessagesCopy(allMessages);
  }, [refresh, chat_id, userData.data.token,allMessages]);

  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
        <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
          <p className={"con-icon" + (lightTheme ? "" : " dark")}>
            {chat_user[0]}
          </p>
          <div className={"header-text" + (lightTheme ? "" : " dark")}>
            <p className={"con-title1" + (lightTheme ? "" : " dark")}>
              {chat_user}
            </p>
          </div>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <DeleteIcon />
          </IconButton>
        </div>
        <div className={"messages-container" + (lightTheme ? "" : " dark")}>
  {allMessages
    .slice(0)
    .reverse()
    
    .map((message, index) => {
      const sender = message.sender;
      const self_id = userData.data._id;
      if (sender._id === self_id) {
        return <MessageSelf props={message} key={index} />;
      } else {
        return <MessageOthers props={message} key={index} />;
      }
    })}
</div>
       
        <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
          <input
            placeholder="Type a Message"
            className={"search-box" + (lightTheme ? "" : " dark")}
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
              }
            }}
          />
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              sendMessage();
              setRefresh(!refresh);
            }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default ChatArea;
