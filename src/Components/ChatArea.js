import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./Messageself";
import MessageOthers from "./Messageothers";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import AttachmentIcon from "@mui/icons-material/Attachment";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";
import { UserContext } from "../App";
import useTranslate from "../hooks/useTranslate"; // Importing the translation hook

const ENDPOINT = "http://localhost:8080";

function ChatArea() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const chatParams = useParams();
  const [chat_id, chat_user] = chatParams._id
    ? chatParams._id.split("&")
    : ["", ""];
  const { globalSocket, setGlobalSocket } = useContext(UserContext);
  const [messageContent, setMessageContent] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setLoaded] = useState(false);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const [socket, setSocket] = useState(null);
  const [chat, setChat] = useState([]);
  const lightTheme = useSelector((state) => state.themeKey);
  const messagesContainerRef = useRef(null);
  const fileRef = useRef();
  const { translatedText, error, translate } = useTranslate(); // Using the translation hook
  const [targetLang, setTargetLang] = useState("ta"); // Default to Telugu
  const [translatedMessages, setTranslatedMessages] = useState([]);
  const [translations, setTranslations] = useState("en");
  // const content = ["content"]; // Example array of messages
  let sender;

  let fileInfo = {
    fileName: "",
    fileSize: "",
    fileType: "",
    fileUrl: "",
  };

  function selectFile() {
    fileRef.current.click();
  }

  function fileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;

    fileInfo.fileName = file.name;
    fileInfo.fileSize = file.size;
    fileInfo.fileType = file.type;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result;
      fileInfo.fileUrl = data;
      setFileContent(fileInfo);
      sendMessage(fileInfo);
    };
  }

  const sendMessage = (data) => {
    const config = {
      headers: { Authorization: `Bearer ${userData.data.token}` },
    };
    axios
      .post(
        "http://localhost:8080/message/",
        {
          content: messageContent,
          file: data || "",
          chatId: chat_id,
        },
        config
      )
      .then((response) => {
        const data = response.data;
        console.log("Message Fired");
        socket.emit("newMessage", data);
        setGlobalSocket(socket);
        getChatMessages();
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  const getChatMessages = () => {
    axios
      .get(`http://localhost:8080/message/${chat_id}`, {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      })
      .then(({ data }) => {
        setAllMessages(data);
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };
  console.log(allMessages, "data");
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    const socket = io(ENDPOINT);
    socket.emit("setup", userData);

    socket.on("connect", () => {
      setSocketConnectionStatus(true);
      setSocket(socket);
    });

    socket.on("error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    if (socket) {
      socket.on("message received", (message) => {
        console.log(`New Message received from ${message.sender}`);
        getChatMessages();
      });

      socket.on("uploaded", (data) => {
        // Handle uploaded file
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket && chat_id) {
      socket.emit("joinChat", chat_id);
      getChatMessages();
    }
  }, [socket, chat_id]);
  const contents = allMessages.map((message) => message.content);
  sender = allMessages.map((message) => message.sender);
  console.log(sender);
  const handleTranslateAll = async () => {
    try {
      const translated = await Promise.all(
        contents.map((message) => {
          return translate(message, "en", targetLang);
        })
      );
      setTranslations(targetLang);
      console.log("Translated", translated);
      setTranslatedMessages(translated);
    } catch (error) {
      console.error("Error translating messages:", error);
    }
  };
console.log(allMessages,"allmessage_data")
  // const translatetext=()=>{
  //   translate(allMessages.join(' '), 'en', targetLang); // Translating all messages
  // }

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
          <div>
            <TranslateIcon onClick={handleTranslateAll} />
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="hi">Hindi</option>
              <option value="kn">Kannada</option>
              <option value="ml">Malayalam</option>
              {/* Add more languages as needed */}
            </select>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className={"messages-container" + (lightTheme ? "" : " dark")}
        >
          {translations == "en"
            ? // Render original messages if translations are available
              allMessages.map((message, index) => (
                <MessageSelf props={message} key={index} userData={userData} />
              ))
            : // Render translated messages if translations are not available
              translatedMessages.map((message, index) => (
                <MessageOthers
                  props={message}
                  key={index}
                  sender={sender}
                  userData={userData}
                />
              ))}
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
                setMessageContent(" ");
                setRefresh(!refresh);
              }
            }}
          />{" "}
          <div className="send-attach">
            <input
              onChange={fileSelected}
              ref={fileRef}
              type="file"
              style={{ display: "none" }}
            />
            <IconButton onClick={selectFile}>
              <AttachmentIcon />
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
