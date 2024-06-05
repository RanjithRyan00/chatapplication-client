import React, { useState } from 'react';
import { ReactMic } from '@cleandersonlobo/react-mic';
import axios from 'axios';
import { IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const VoiceRecorder = ({ chat_id, userData, socket, setRefresh, refresh }) => {
  const [isRecording, setIsRecording] = useState(false);

  const onStop = async (recordedBlob) => {
    console.log("Recorded Blob:", recordedBlob); // Debugging line

    const AudioFormData = new FormData();
    AudioFormData.append("voiceNote", recordedBlob.blob, "voice-message.wav");
    AudioFormData.append("chat_id", chat_id);
    AudioFormData.append("duration", recordedBlob.stopTime - recordedBlob.startTime);

    // console.log('FormData:', formData.get('voiceNote'), formData.get('chat_id'), formData.get('duration')); // Debugging line
    // Debugging: Log all key/value pairs in FormData
    for (let pair of AudioFormData.entries()) {
        console.log(pair[0] + ':', pair[1]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/message/uploadVoiceNote",
        AudioFormData,
        {
          headers: {
            "Content-Type" : "multipart/form-data",
            Authorization: `Bearer ${userData.data.token}`
          }
        }
      );

      const message = response.data;
      console.log("Server Response:", message); // Debugging line
      socket.emit("newMessage", message);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error uploading voice message:", error);
      if (error.response) {
        console.error("Server Error Response:", error.response.data); // Additional error logging
      }
    }
  };
  

  return (
    <div>
      <ReactMic
        record={isRecording}
        className="sound-wave"
        onStop={onStop}
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
      <IconButton onClick={() => setIsRecording(!isRecording)}>
        {isRecording ? <StopIcon /> : <MicIcon />}
      </IconButton>
    </div>
  );
};

export default VoiceRecorder;
