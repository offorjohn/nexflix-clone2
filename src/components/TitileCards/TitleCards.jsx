/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/TitileCards/TitleCards.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TitleCards.css';


// Import local images for mapping.
import card_img1 from '../../assets/cards/card1.jpg';
import card_img2 from '../../assets/cards/card2.jpg';
import card_img3 from '../../assets/cards/card3.jpg';

import card_img4 from '../../assets/cards/card4.jpg';

const localImages = {
  "Next Avengers: Heroes of Tomorrow": card_img1,
  "Sea Fever": card_img2,
  "Wild Robot": card_img4,
  "deadpool.and.wolverine.2024.1080p.bluray.mp4": card_img3,
  
};
const TitleCards = ({ title }) => {
  const [movies, setMovies] = useState([]);
  const cardsRef = useRef();
  const { t } = useTranslation();

  // Horizontal scroll handler
  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    fetch('https://video-buckett.s3.us-east-1.amazonaws.com/movies.json')
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        const moviesWithImages = data.map(movie => ({
          ...movie,
          image: localImages[movie.name] || null,
        }));
        setMovies(moviesWithImages);
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, []);

  return (
    <div className="title-cards">
      <h2>{title ? title : t('popularOnNetflix')}</h2>
      <div className="card-list" ref={cardsRef} onWheel={handleWheel}>
        {movies.map((movie, index) => (
          <Link to={`/player/${movie.id}`} className="card" key={movie.id || index}>
            {movie.image ? (
              <img src={movie.image} alt={movie.name} />
            ) : (
              <img src="/path/to/default-image.jpg" alt={movie.name} />
            )}
            <p>{movie.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
