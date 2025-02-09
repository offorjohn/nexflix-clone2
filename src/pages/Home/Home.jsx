/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import play_icon from '../../assets/play_icon.png';
import info_icon from '../../assets/info_icon.png';
import TitleCards from '../../components/TitileCards/TitleCards';
import Footer from '../../components/Footer/Footer';

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

// (Optional) A default image in case no mapping is found.
const defaultImage = '/path/to/default-image.jpg';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  // Fetch movies.json from your S3 bucket when the component mounts.
  useEffect(() => {
    fetch('https://video-buckett.s3.us-east-1.amazonaws.com/movies.json')
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
          image: localImages[movie.name] || defaultImage,
        }));
        setMovies(moviesWithImages);
        // Randomly select a featured movie.
        if (moviesWithImages.length > 0) {
          const randomIndex = Math.floor(Math.random() * moviesWithImages.length);
          setFeaturedMovie(moviesWithImages[randomIndex]);
        }
      })
      .catch(err => console.error('Error fetching movies:', err));
  }, []);

  return (
    <div className="home">
      <Navbar />
      <div className="hero">
        {featuredMovie ? (
          <>
            {/* Banner image as the background */}
            <img
              src={featuredMovie.image}
              alt={featuredMovie.name}
              className="banner-img"
            />
            <div className="hero-caption">
              {/* Top section splits into left and right parts */}
              <div className="caption-top">
                <div className="caption-left">
                  {/* Featured movie title */}
                  <h1>{featuredMovie.name}</h1>
                  {/* Hardcoded movie description (replace with JSON data later) */}
                  <p className="movie-description">
                    A thrilling journey through an imaginative drama where dreams and reality merge.
                  </p>
                </div>
                <div className="caption-right">
                  {/* Vertical red line */}
                  <div className="vertical-line"></div>
                  {/* Movie info */}
                  <div className="movie-info">
                    <span className="movie-year">2024</span>
                    <span className="movie-genre">Imagination, Drama</span>
                  </div>
                </div>
              </div>
              
              {/* Action buttons aligned at the right */}
              <div className="hero-btns">
                <Link
                  to={`/player/${featuredMovie.id}`}
                  className="btn"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <img src={play_icon} alt="Play" /> Play
                </Link>
                <button
                  className="btn dark-btn"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <img src={info_icon} alt="More Info" /> More Info
                </button>
              </div>
              
              {/* Additional title cards (hidden on small devices) */}
              <div className="hero-title-cards">
                <TitleCards />
              </div>
            </div>
          </>
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>
      <div className="more-cards">
        <TitleCards title={"Blockbuster Movies"} category={"top_rated"} />
        <TitleCards title={"Only on Netflix"} category={"popular"} />
        <TitleCards title={"Upcoming"} category={"upcoming"} />
        <TitleCards title={"Top Pics for You"} category={"now_playing"} />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
