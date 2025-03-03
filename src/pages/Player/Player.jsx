/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import "./Player.css";
import { useNavigate, useParams } from "react-router-dom";

import back_arrow_icon from "../../assets/back_arrow_icon.png";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaRedoAlt, // Circular Forward
  FaUndoAlt, // Circular Backward
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
  const navigate = useNavigate(); // Initialize navigate

  const playerRef = useRef(null);
  // Set initial playing state to true.
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [progressHovered, setProgressHovered] = useState(false);
  const [movieUrl, setMovieUrl] = useState(null); // URL for the selected movie

  // New state for feedback icon (if needed)
  const [feedbackIcon, setFeedbackIcon] = useState(null);
  // This flag ensures the forced toggle only happens once.
  const [hasForcedPlay, setHasForcedPlay] = useState(false);

  // Refs to help detect double taps on touch devices
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);

  // Helper function to show a feedback icon briefly
  const showFeedbackIcon = (type) => {
    setFeedbackIcon(type);
    setTimeout(() => setFeedbackIcon(null), 1000);
  };

  // Fetch the movies.json file and find the movie with matching ID.
  useEffect(() => {
    fetch("https://video-buckett.s3.us-east-1.amazonaws.com/movies.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Ensure matching types (if IDs are numbers in JSON but strings from URL, convert accordingly)
        const selectedMovie = data.find((movie) => String(movie.id) === id);
        if (selectedMovie) {
          setMovieUrl(selectedMovie.url);
        } else {
          console.error("Movie not found");
        }
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, [id]);

  // onReady callback for ReactPlayer.
  // This simulates a pause then play so that the video is forced to start.
  const handlePlayerReady = () => {
    if (!hasForcedPlay) {
      // Simulate a pause then play action
      setPlaying(false);
      setTimeout(() => {
        setPlaying(true);
        setHasForcedPlay(true);
      }, 100); // You may adjust the delay as needed
    }
  };

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
    showFeedbackIcon("fastForward");
  };

  const rewind = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(Math.max(0, currentTime - 10), "seconds");
    showFeedbackIcon("rewind");
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
          if (playing) {
            setPlaying(false);
            showFeedbackIcon("pause");
          } else {
            setPlaying(true);
            showFeedbackIcon("play");
          }
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
  }, [playing]);

  // For non-touch devices, a simple click toggles play/pause
  const handleVideoClick = () => {
    if (playing) {
      setPlaying(false);
      showFeedbackIcon("pause");
    } else {
      setPlaying(true);
      showFeedbackIcon("play");
    }
  };

  // For non-touch devices, double-click determines rewind/fast-forward
  const handleDoubleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const containerWidth = rect.width;

    if (clickX < containerWidth / 2) {
      rewind();
    } else {
      fastForward();
    }
  };

  // Touch handler for mobile: only double-tap triggers rewind/fast-forward.
  const handleTouchEnd = (e) => {
    const currentTime = Date.now();
    const tapDelay = 300; // milliseconds threshold for double-tap
    const timeSinceLastTap = currentTime - lastTapRef.current;
    clearTimeout(tapTimeoutRef.current);

    if (timeSinceLastTap < tapDelay && timeSinceLastTap > 0) {
      // Double-tap detected. Determine left/right position.
      const rect = e.currentTarget.getBoundingClientRect();
      const touchX = e.changedTouches[0].clientX - rect.left;
      const containerWidth = rect.width;
      if (touchX < containerWidth / 2) {
        rewind();
      } else {
        fastForward();
      }
      lastTapRef.current = 0; // reset after double-tap
    } else {
      // Just register the time of the tap without toggling play/pause.
      lastTapRef.current = currentTime;
    }
  };

  // Toggle Fullscreen Mode with optional orientation lock
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock("landscape").catch((err) => {
              console.error("Orientation lock failed:", err);
            });
          }
        })
        .catch((err) => {
          console.error("Error attempting full-screen mode:", err);
        });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
          }
        });
      }
    }
  };

  // Determine if the device supports touch events.
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return (
    <div className="player"
    
    >{controlsVisible && (
      <img
        src={back_arrow_icon}
        alt="Back"
        onClick={() => navigate("/")}
        style={{
          position: "fixed", // fixed so it stays in place on scroll/click
          top: "20px",       // adjust as needed
          left: "20px",      // adjust as needed
          zIndex: 1000,      // high enough to be on top of video and controls
          cursor: "pointer"  // indicate it's clickable
        }}
      />
    )}
      <div
        className="netflix-player"
        onMouseMove={() => setControlsVisible(true)}
      >
        <div className="video-wrapper">
          {/* Video Player */}
          <div
            className="video-container"
            // Use different event handlers based on device type.
            onClick={!isTouchDevice ? handleVideoClick : undefined}
            onDoubleClick={!isTouchDevice ? handleDoubleClick : undefined}
            onTouchEnd={isTouchDevice ? handleTouchEnd : undefined}
            onContextMenu={(e) => e.preventDefault()} // Disable right-click context menu.
          >
            {movieUrl ? (
              <ReactPlayer
                ref={playerRef}
                url={movieUrl}
                playing={playing} // Controlled by state.
                muted={muted}
                volume={volume}
                onReady={handlePlayerReady}
                onProgress={handleProgress}
                onDuration={handleDuration}
                controls={false}
                width="100%"
                height="100%"
                config={{
                  file: {
                    attributes: {
                      // Disables the download option and picture-in-picture on supporting browsers.
                      controlsList: "nodownload noremoteplayback",
                      disablePictureInPicture: true,
                    },
                  },
                }}
              />
            ) : (
              <p>Loading video...</p>
            )}
            {/* Feedback Icon Overlay */}
            {feedbackIcon && (
              <div className={`feedback-icon ${feedbackIcon}`}>
                {feedbackIcon === "play" && <FaPlay />}
                {feedbackIcon === "pause" && <FaPause />}
                {feedbackIcon === "fastForward" && <FaRedoAlt />}
                {feedbackIcon === "rewind" && <FaUndoAlt />}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {controlsVisible && (
          <div className="controls">
            <div className="left-controls">
              {/* Play/Pause Button */}
              <div className="control-button">
                <button
                  className="play-pause-button"
                  onClick={() => {
                    if (playing) {
                      setPlaying(false);
                      showFeedbackIcon("pause");
                    } else {
                      setPlaying(true);
                      showFeedbackIcon("play");
                    }
                  }}
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
            </div>

            <div className="right-controls">
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
                    background: progressHovered
                      ? "#ddd"
                      : `linear-gradient(to right, red ${progress}%, #ddd ${progress}%)`,
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
                <span className="progress-timer">
                  {formatTime(duration - playedSeconds)}
                </span>
              </div>

              {/* Fullscreen Button */}
              <div className="fullscreen-button">
                <button onClick={toggleFullScreen}>
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetflixPlayer;
