import React, { useRef, useState, useEffect } from 'react';

const AudioPlayer = ({ audioUrl, onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime; // Set the current time when audio URL changes
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioUrl, isPlaying, currentTime]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleClose = () => {
    setIsPlaying(false); // Stop audio when closing
    onClose();
  };

  return (
    <div style={styles.modal}>
      <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <div style={styles.progress}>
        <progress value={currentTime} max={duration}></progress>
        <span>{currentTime.toFixed(2)} / {duration.toFixed(2)}</span>
      </div>
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

// Styles
const styles = {
  modal: {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: '#fff',
    padding: '10px',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default AudioPlayer;
