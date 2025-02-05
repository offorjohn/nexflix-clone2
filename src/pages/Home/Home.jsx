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

// Map movie names (from your JSON) to your local images.
const localImages = {
  "Hard Home 2024": card_img1,
  "Input": card_img2,
  "Outbreak 2024": card_img3
};

// (Optional) A default image in case no mapping is found.
const defaultImage = '/path/to/default-image.jpg';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  // Fetch movies.json from your S3 bucket when the component mounts.
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
    <div className='home'>
      <Navbar />
      <div className="hero">
        {featuredMovie ? (
          <>
            {/* Use the featured movie image as the banner */}
            <img src={featuredMovie.image} alt={featuredMovie.name} className='banner-img' />
            <div className="hero-caption">
              {/* Display movie title and any additional attributes */}
              <h1>{featuredMovie.name}</h1>
              {featuredMovie.description && <p>{featuredMovie.description}</p>}
              {/* Example: If you have a releaseDate attribute */}
              {featuredMovie.releaseDate && (
                <p className="release-date">Release Date: {featuredMovie.releaseDate}</p>
              )}
              <div className="hero-btns">
                {/* Link to the player page using the movie ID with default focus prevention */}
                <Link
                  to={`/player/${featuredMovie.id}`}
                  className='btn'
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <img src={play_icon} alt="Play" /> Play
                </Link>
                <button
                  className='btn dark-btn'
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <img src={info_icon} alt="More Info" /> More Info
                </button>
              </div>
              {/* Optionally include TitleCards here */}
              <TitleCards />
            </div>
          </>
        ) : (
          // Loading or fallback state if no movie is available yet.
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
