import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from './Messageself';
import MessageOthers from './Messageothers';
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import AttachmentIcon from '@mui/icons-material/Attachment';
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8080";
var socket;

function ChatArea() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [messageContent, setMessageContent] = useState("");
  const chatParams = useParams();

  const [chat_id, chat_user] = chatParams._id ? chatParams._id.split("&") : ['', ''];
  const [allMessages, setAllMessages] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setLoaded] = useState(false);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);

  const lightTheme = useSelector((state) => state.themeKey);
  const messagesContainerRef = useRef(null); // Create a ref for the chat container
  const fileRef = useRef();

  function selectFile(){
    fileRef.current.click();
  }

  function fileSelected(e){
    const file=e.target.file[0];
    if(!file) return
    const reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload= () => {
      const data= reader.result;
      socket.emit('upload',{data});
    }
  }

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
      });

  }, [allMessages,chat_id]); // useEffect dependency should be chat_id instead of allMessages

  useEffect(() => {
    // Scroll to the bottom of the chat container whenever allMessages updates
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

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
          
        </div>
        <div
          ref={messagesContainerRef} // Attach ref to the chat container
          className={"messages-container" + (lightTheme ? "" : " dark")}
        >
          {allMessages
            .slice(0)
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

          /> <div className="send-attach">
          <input onChange={fileSelected} ref={fileRef} type="file" style={{display:"none"}} />
          <IconButton onClick={selectFile}>
            <AttachmentIcon/>
            </IconButton>
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
      </div>
    );
  }
}

export default ChatArea;
