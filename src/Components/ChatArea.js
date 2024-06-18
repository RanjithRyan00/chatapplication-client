import React, { useContext, useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import SendIcon from "@mui/icons-material/Send";
import Message from "./Message";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import AttachmentIcon from "@mui/icons-material/Attachment";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";
import { UserContext } from "../App";
import useTranslate from "../hooks/useTranslate"; // Importing the translation hook
import VoiceRecorder from "./VoiceRecorder";
import Mic from "./Mic";

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
  const lightTheme = useSelector((state) => state.themeKey);
  const messagesContainerRef = useRef(null);
  const fileRef = useRef();
  const { translatedText, error, translate } = useTranslate(); // Using the translation hook
  const [targetLang, setTargetLang] = useState("disabled"); // Default to tamil
  const [translatedMessages, setTranslatedMessages] = useState([]);
  const [translations, setTranslations] = useState("en");
  const [showDropdown, setShowDropdown] = useState(false);

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
        getChatMessages();
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

  const handleSelectionChange = (e) => {
    setTargetLang(e.target.value);
    setShowDropdown(true); // Keep the dropdown visible after selection
  };

  const handleTranslateAll = async () => {
    try {
      const content = allMessages.map((message) => message.content);

      const delimiter = "|||";

      const combinedContents = content.join(delimiter);

      const translatedCombinedContents = await translate(
        combinedContents,
        "en",
        targetLang
      );

      const translatedContents = translatedCombinedContents.split(delimiter);

      const translatedMessages = allMessages.map((message, index) => {
        return {
          ...message,
          translatedContent: translatedContents[index],
        };
      });

      if (translatedMessages) {
        setTranslations(targetLang);
        setTranslatedMessages(translatedMessages);
      }
    } catch (error) {
      console.error("Error translating messages:", error);
    }
  };

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
          <div className="chatName-header">
            <p className={"con-icon" + (lightTheme ? "" : " dark")}>
              {chat_user[0]}
            </p>
            <div className={"header-text" + (lightTheme ? "" : " dark")}>
              <p className={"con-title1" + (lightTheme ? "" : " dark")}>
                {chat_user}
              </p>
            </div>
          </div>
          <div className="translation-box">
            <button
              className="button"
              role="button"
              onClick={handleTranslateAll}
            >
              <TranslateIcon />
            </button>
            <div className="translation-selection">
              <select
                className="translation-selection"
                value={targetLang}
                onChange={handleSelectionChange}
              >
                <option value="disabled">Select Lang</option>
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="hi">Hindi</option>
                <option value="kn">Kannada</option>
                <option value="ml">Malayalam</option>
                {/* Add more languages as needed */}
              </select>
            </div>
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className={"messages-container" + (lightTheme ? "" : " dark")}
        >
          {translations == "en"
            ? allMessages.map((message, index) => (
                <Message props={message} key={index} userData={userData} />
              ))
            : translatedMessages.map((message, index) => (
                <Message props={message} key={index} userData={userData} />
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
            {/* <VoiceRecorder
                chat_id={chat_id}
                userData={userData}
                socket={socket}
                setRefresh={setRefresh}
                refresh={refresh}
              /> */}
            <Mic
              chat_id={chat_id}
              userData={userData}
              socket={socket}
              setRefresh={setRefresh}
              refresh={refresh}
            />
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
