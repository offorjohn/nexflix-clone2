/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./Player.css";
import { useParams } from "react-router-dom";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaRedoAlt,  // Circular Forward
  FaUndoAlt,  // Circular Backward
} from "react-icons/fa";

// Utility function to format seconds into mm:ss or hh:mm:ss if needed.
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const hDisplay = h > 0 ? h + ":" : "";
  const mDisplay = h > 0 ? (m < 10 ? "0" + m : m) + ":" : m + ":";
  const sDisplay = s < 10 ? "0" + s : s;
  return hDisplay + mDisplay + sDisplay;
};

const NetflixPlayer = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [progressHovered, setProgressHovered] = useState(false);
  const [movieUrl, setMovieUrl] = useState(null); // URL for the selected movie

  // Fetch the movies.json file and find the movie with matching ID.
  useEffect(() => {
    fetch('https://myvideobucket1101.s3.us-east-2.amazonaws.com/movies.json')
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        // Ensure matching types (if IDs are numbers in JSON but strings from URL, convert accordingly)
        const selectedMovie = data.find(movie => String(movie.id) === id);
        if (selectedMovie) {
          setMovieUrl(selectedMovie.url);
        } else {
          console.error("Movie not found");
        }
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, [id]);

  // Update progress state while video is playing
  const handleProgress = (state) => {
    setProgress(state.played * 100);
    setPlayedSeconds(state.playedSeconds);
  };

  // Set the total duration of the video (in seconds)
  const handleDuration = (dur) => {
    setDuration(dur);
  };

  // Hide controls after 4 seconds of no mouse movement
  useEffect(() => {
    const timeout = setTimeout(() => setControlsVisible(false), 4000);
    return () => clearTimeout(timeout);
  }, [controlsVisible]);

  // Fast forward and rewind functions (10 seconds skip)
  const fastForward = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + 10, "seconds");
  };

  const rewind = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(Math.max(0, currentTime - 10), "seconds");
  };

  // Handle keyboard shortcuts:
  // - Spacebar toggles play/pause
  // - ArrowRight fast forwards
  // - ArrowLeft rewinds
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "Space":
          e.preventDefault(); // Prevent page scroll
          setPlaying((prev) => !prev);
          break;
        case "ArrowRight":
          e.preventDefault();
          fastForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          rewind();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // When clicking on the video area, toggle play/pause (like YouTube)
  const handleVideoClick = () => {
    setPlaying((prev) => !prev);
  };

  // Toggle Fullscreen Mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div
      className="netflix-player"
      onMouseMove={() => setControlsVisible(true)}
    >
      <div className="video-wrapper">
        {/* Video Player */}
        <div className="video-container" onClick={handleVideoClick}>
          {/* Only render the player if movieUrl is available */}
          {movieUrl ? (
            <ReactPlayer
              ref={playerRef}
              url={movieUrl}
              playing={playing}
              muted={muted}
              volume={volume}
              onProgress={handleProgress}
              onDuration={handleDuration}
              controls={false}
              width="100%" // Ensure the player fills its container
              height="100%"
            />
          ) : (
            <p>Loading video...</p>
          )}
        </div>
      </div>

      {/* Controls */}
      {controlsVisible && (
        <div className="controls">
          {/* Play/Pause Button */}
          <div className="control-button">
            <button
              className="play-pause-button"
              onClick={() => setPlaying(!playing)}
            >
              {playing ? <FaPause /> : <FaPlay />}
            </button>
          </div>

          {/* Rewind Button */}
          <div className="control-button">
            <button className="rewind-button" onClick={rewind}>
              <FaUndoAlt />
              <span className="button-label">10</span>
            </button>
          </div>

          {/* Fast Forward Button */}
          <div className="control-button">
            <button className="fast-forward-button" onClick={fastForward}>
              <FaRedoAlt />
              <span className="button-label">10</span>
            </button>
          </div>

          {/* Volume Control */}
          <div className="volume-control">
            <button
              className="volume-button"
              onClick={() => setMuted(!muted)}
            >
              {muted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => {
                const newProgress = parseFloat(e.target.value);
                playerRef.current.seekTo(newProgress / 100);
                setProgress(newProgress);
              }}
              className="progress-range"
              onMouseEnter={() => setProgressHovered(true)}
              onMouseLeave={() => setProgressHovered(false)}
              style={{
                height: "4px",
                appearance: "none",
                borderRadius: "5px",
                // When hovered, show uniform background; otherwise, show gradient reflecting progress.
                background: progressHovered
                  ? "#ddd"
                  : `linear-gradient(to right, red ${progress}%, #ddd ${progress}%)`,
                outline: "none",
                cursor: "pointer",
              }}
            />
            <span className="progress-timer">{formatTime(duration - playedSeconds)}</span>
          </div>
          
          {/* Fullscreen Button */}
          <div className="fullscreen-button">
            <button onClick={toggleFullScreen}>
              <FaExpand />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetflixPlayer;
