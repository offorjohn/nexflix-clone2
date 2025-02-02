/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './TitleCards.css';

// Import your local image with the correct relative path.
import card_img1 from '../../assets/cards/card1.jpg';


// Import your local image with the correct relative path.
import card_img2 from '../../assets/cards/card2.jpg';


// Import your local image with the correct relative path.
import card_img3 from '../../assets/cards/card3.jpg';

// Map the movie name (as in your JSON) to the local image.
const localImages = {
  "Hard Home 2024": card_img1,
  "Input": card_img2,
  "Outbreak 2024": card_img3
};

const TitleCards = ({ title }) => {
  const [movies, setMovies] = useState([]);
  const cardsRef = useRef();

  // Horizontal scroll handler using mouse wheel events.
  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  // Fetch the movies.json file from your S3 bucket when the component mounts.
  useEffect(() => {
    fetch('https://myvideobucket1101.s3.us-east-2.amazonaws.com/movies.json')
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        // Merge local images into each movie object.
        const moviesWithImages = data.map(movie => ({
          ...movie,
          image: localImages[movie.name] || null, // Provide a default image if needed.
        }));
        setMovies(moviesWithImages);
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, []);

  return (
    <div className="title-cards">
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef} onWheel={handleWheel}>
        {movies.map((movie, index) => (
          <Link to={`/player/${movie.id}`} className="card" key={movie.id || index}>
            {movie.image ? (
              <img src={movie.image} alt={movie.name} />
            ) : (
              // Optionally render a fallback image if no local image exists.
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
