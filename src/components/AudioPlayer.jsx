// AudioPlayer.js
import React, { useEffect, useRef } from 'react';
import './AudioPlayer.css';

function AudioPlayer({ episode, onClose }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error('Error attempting to play audio:', error);
        }
      }
    };

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setTimeout(playAudio, 0); // Ensure play is called after pause
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [episode]);

  return (
    <div className="audio-player">
      <div className="audio-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>{episode.title}</h3>
        <audio ref={audioRef} controls>
          <source src={episode.file} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}

export default AudioPlayer;
