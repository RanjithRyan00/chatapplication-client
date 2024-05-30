import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { getUserInfo } from "../shared/getUserInfo";

function ChatbotMessages() {
  const [userId, setUserId] = useState();
  const [input, setInput] = useState(""); // State to store user input
  const [generatedContent, setGeneratedContent] = useState(null); // State to store generated content
  const [lightTheme, setLightTheme] = useState(true); // State to store theme
  const [userData, setUserData] = useState(null); // State to store user data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo();
        setUserId(userData.id);
        setUserData(userData); // Set user data state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (event) => {
    event.preventDefault();
    setInput(event.target.value);
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/chatbot/generate",
        { input }
      );
      const data = response.data;
      setGeneratedContent({
        question: data.content.question,
        answer: data.content.answer,
      });
      setInput(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
      <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
        <p className={"chat-icon" + (lightTheme ? "" : " dark")}></p>
        <div className={"header-text" + (lightTheme ? "" : " dark")}>
          <p className={"con-title1" + (lightTheme ? "" : " dark")}>MEXT AI</p>
        </div>
      </div>

      <div className={"chatbotmessages-container" + (lightTheme ? "" : " dark")}>
        <div className="self-message-container">
          <p className="con-icon">{userData && userData.name[0]}</p>
          {generatedContent && (
            <div className="other-text-content">
              <p style={{ color: "black" }}>{generatedContent.question}</p>
            </div>
          )}
        </div>

        {generatedContent && (
          <div className={"other-message-container" + (lightTheme ? "" : " dark")}>
            <div className={"message-Box" + (lightTheme ? "" : " dark")}>
              <p className={"chat-icon" + (lightTheme ? "" : " dark")}></p>
              <div className={"other-text-content" + (lightTheme ? "" : " dark")}>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>Mext AI</p>
                <div className="other-text-content ">
                  {generatedContent.answer !== "" && (
                    <ul style={{ listStyleType: "none", padding: 0 }}>
                      {generatedContent.answer
                        .split("*")
                        .filter((item) => item.trim() !== "")
                        .map((point, index) => (
                          <li key={index}>- {point.trim()}</li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
        <input
          placeholder="Type a Message"
          className={"search-box" + (lightTheme ? "" : " dark")}
          value={input}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              sendMessage();
            }
          }}
        />
        <IconButton
          className={"icon" + (lightTheme ? "" : " dark")}
          onClick={sendMessage}
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ChatbotMessages;
