// AudioPlayer.js
import React, { useEffect, useState } from 'react';
import './AudioPlayer.css';

function AudioPlayer({ episode, onClose }) {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (episode?.file) {
      const newAudio = new Audio(episode.file);

      // Set the new audio element
      setAudio(newAudio);

      // Play the audio
      newAudio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Error attempting to play audio:', error);
      });

      // Update progress
      const updateProgress = () => {
        setProgress((newAudio.currentTime / newAudio.duration) * 100);
      };
      newAudio.addEventListener('timeupdate', updateProgress);

      // Handle cleanup when component unmounts or episode changes
      return () => {
        if (newAudio) {
          newAudio.pause();
          newAudio.src = "";
          newAudio.removeEventListener('timeupdate', updateProgress);
        }
      };
    }
  }, [episode]);

  const handlePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          console.error('Error attempting to play audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="audio-player">
      <div className="audio-content">
        <button className="exit-button" onClick={onClose}>Exit</button>
        <h3>{episode.title}</h3>
        {episode?.file ? (
          <>
            <button className="play-pause-button" onClick={handlePlayPause}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <audio controls>
              <source src={episode.file} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </>
        ) : (
          <p>No audio file available.</p>
        )}
      </div>
    </div>
  );
}

export default AudioPlayer;