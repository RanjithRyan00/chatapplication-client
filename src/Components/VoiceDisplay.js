import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useEffect, useRef, useState } from "react";
import { duration } from "@mui/material";

const VoiceDisplay = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
    }

    const handleDurationChange = () => {
        setDuration(audio.duration);
    }

    const handleAudioEnd = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleAudioEnd);

    if (audio.readyState >= 1) {
        setDuration(audio.duration);
      }

    return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleAudioEnd);
    }
},[]);
    
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressChange = (event) => {
    const audio = audioRef.current;
    const newTime = (event.target.value / 100) * duration;
    if (isFinite(newTime)) {
      audio.currentTime = newTime;
      setCurrentTime(newTime); // Ensure currentTime is updated
      if (newTime === duration) {
        setIsPlaying(false); // Reset play/pause state if dragged to the end
      }
    }
  };

  const handleSpeedChange = () => {
    let newRate = playbackRate === 2 ? 1 : playbackRate + 0.5;
    setPlaybackRate(newRate);
    audioRef.current.playbackRate = newRate;
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };


  return (
    <div className="voice-message">
      {isPlaying ? <PauseIcon onClick={handlePlayPause} className="play-pause-icon"/> : <PlayArrowIcon onClick={handlePlayPause} className="play-pause-icon"/>}
      <input type="range" value={(currentTime / duration) * 100 || 0} onChange={handleProgressChange}/>
      <div className="time">{formatTime(currentTime)}</div>
      <div className="speed" onClick={handleSpeedChange}>
        {playbackRate}x
      </div>
      <audio ref={audioRef} src={audioUrl} />
    </div>
  );
};

export default VoiceDisplay;
