import React, { useState, useEffect } from 'react';

const AudioPlayer = ({ audioUrl, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = React.useRef(new Audio(audioUrl));

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.pause(); // Stop audio when unmounting
    };
  }, [isPlaying, audioUrl]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
        const message = 'You have audio playing. Are you sure you want to leave?';
        e.returnValue = message; // For Chrome
        return message; // For Firefox
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPlaying]);

  return (
    <div className="audio-player">
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <div>
        <span>Current Time: {Math.floor(currentTime)} / {Math.floor(duration)}</span>
      </div>
      <button onClick={onClose}>Close Player</button>
    </div>
  );
};

export default AudioPlayer;
