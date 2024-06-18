import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App";

const Mic = ({ chat_id, userData, socket, setRefresh, refresh }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [canRecord, setCanRecord] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const { globalSocket, setGlobalSocket } = useContext(UserContext);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const startTimeRef = useRef(null);

  useEffect(() => {
    setUpAudio();
    return () => {
      // Clean up the MediaRecorder and stream
      if (recorderRef.current) {
        recorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const setUpAudio = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          processAudio(stream);
        })
        .catch((err) => console.log(err));
    }
  };

  const processAudio = (stream) => {
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/mp3" });
      chunksRef.current = [];
      setAudioBlob(blob);
      sendAudio(blob);
    };
    recorderRef.current = recorder;
    setCanRecord(true);
  };

  const sendAudio = async (blob) => {
    let payload = {};
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64data = reader.result;
      payload["voice"] = base64data;
      payload["chatId"] = chat_id;
      payload["duration"] = (new Date().getTime() - startTimeRef.current) / 1000; // duration in seconds
      payload["userData"] = JSON.stringify(userData);

      console.log("Req payload:", payload);

      try {
        const response = await axios.post(
          "http://localhost:8080/message/voice",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.data.token}`,
            },
          }
        );

        const message = response.data;
        socket.emit("newMessage", message);
        setGlobalSocket(socket);
        setRefresh(!refresh);
      } catch (error) {
        console.error("Error uploading voice message:", error);
        if (error.response) {
          console.error("Server Error Response:", error.response.data);
        }
      }
    };
  };

  const toggleMic = () => {
    if (!canRecord) return;

    if (!isRecording) {
      startTimeRef.current = new Date().getTime();
      recorderRef.current.start();
    } else {
      recorderRef.current.stop();
    }
    setIsRecording((prev) => !prev);
  };

  return (
    <div>
      {isRecording ? (
        <StopIcon onClick={toggleMic} />
      ) : (
        <MicIcon onClick={toggleMic} />
      )}
      {/* Uncomment this part for debugging purposes to listen to the recorded audio */}
      {/* {audioBlob && (
        <audio controls>
          <source src={URL.createObjectURL(audioBlob)} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )} */}
    </div>
  );
};

export default Mic;
