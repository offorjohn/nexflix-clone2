/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';
import { TMDB_Access_Key } from '../../config';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const Player = (props) => {
  const state = props.location;
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: "",
  });

  const [error, setError] = useState(false); // Track error state

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_Access_Key}`,
    },
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
      .then(response => response.json())
      .then(response => {
        if (response.results && response.results.length > 0) {
          setApiData(response.results[0]);
          setError(false); // Reset error if trailer is found
        } else {
          setError(true); // Set error state if no trailer is found
         
        }
      })
      .catch(err => {
        console.error(err);
        setError(true); // Set error state on fetch error
        toast.error('Failed to fetch video data.');
      });
  }, [id]);

  return (
    <div className="player">
      <img
        src={back_arrow_icon}
        alt="Back"
        onClick={() => { navigate(-2); }}
      />

      {/* Display error message if no trailer is found */}
      {error ? (
        <div className="error-message">
          <p>No trailer found for this movie!</p>
        </div>
      ) : (
        apiData.key && (
          <iframe
            src={`https://www.youtube.com/embed/${apiData.key}`}
            title="trailer"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        )
      )}

      {/* Movie Info */}
      {!error && apiData.published_at && (
        <div className="player-info">
          <p>{apiData.published_at.slice(0, 10)}</p>
          <p>{state}</p>
          <p>{apiData.type}</p>
        </div>
      )}
    </div>
  );
};

// ToastContainer for notifications
export const ToastContainer = () => (
  <div>
    <toast.Container position="top-right" autoClose={5000} hideProgressBar />
  </div>
);

export default Player;
