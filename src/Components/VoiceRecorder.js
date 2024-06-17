import React, { useState, useContext } from 'react';
import { ReactMic } from 'react-mic';
import axios from 'axios';
import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { UserContext } from '../App';

const VoiceRecorder = ({ chat_id, userData, socket, setRefresh, refresh }) => {
  const [isRecording, setIsRecording] = useState(false);
  const { globalSocket, setGlobalSocket } = useContext(UserContext);

  const onStop = async (recordedBlob) => {
    
    console.log("Rec blob:", recordedBlob);
    let AudioFormData = new FormData();
    AudioFormData.append("voice", recordedBlob.blob, "voice-message.wav");
    AudioFormData.append("chatId", chat_id);
    AudioFormData.append(
      "duration",
      recordedBlob.stopTime - recordedBlob.startTime
    );
    AudioFormData.append("userData", JSON.stringify(userData));

    try {
      const response = await axios.post(
        "http://localhost:8080/message/voice",
        AudioFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userData.data.token}`,
          },
        }
      );

      const message = response.data;
      console.log("Server Response:", message); // Debugging line
      socket.emit("newMessage", message);
      setGlobalSocket(socket);      
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error uploading voice message:", error);
      if (error.response) {
        console.error("Server Error Response:", error.response.data); // Additional error logging
      }
    }
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  return (
    <div className='voice-div'>

        <ReactMic
        onStop={onStop}
        record={isRecording}
        className="sound-wave"
        strokeColor="#000000"
        backgroundColor="#FCF6f5ff"
      />


      <IconButton onClick= {toggleRecording}>
        {isRecording ? <StopIcon /> : <MicIcon />}
      </IconButton>
    </div>
  );
};

export default VoiceRecorder;
