import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentStore } from '../../components/content';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

import netflix_spinner from '../../assets/netflix_spinner.gif';
import './SearchPage.css';
import { ORIGINAL_IMG_BASE_URL } from '../../utils/constants';
import Footer from '../../components/Footer/Footer';

const SearchPage = () => {
    const [activeTab, setActiveTab] = useState('movie');
    const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm") || ""); // Load saved search term
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false); // State to track loading
    const { setContentType } = useContentStore();

    const navigate = useNavigate();

    useEffect(() => {
        navigate("/search");
    }, [navigate]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        tab === "movie" ? setContentType("movie") : setContentType("tv");
        setResults([]);
    };

   const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        localStorage.setItem("searchTerm", searchTerm);

        const res = await axios.get(
            `https://api.themoviedb.org/3/search/${activeTab}`,
            {
                params: {
                    api_key: import.meta.env.VITE_TMDB_API_KEY, // store in .env
                    query: searchTerm,
                },
            }
        );

        console.log("TMDB Response:", res.data);

        // TMDB returns { results: [...] }
        setResults(res.data.results || []);
    } catch (error) {
        if (error.response?.status === 404) {
            toast.error("Nothing found");
        } else {
            console.error(error);
            toast.error("An error occurred");
        }
    } finally {
        setLoading(false);
    }
};


    useEffect(() => {
        console.log("results", results);
    }, [results]);

    return (
        <>
            <Navbar />
            <div className="search-container">
                <div className="tab-container">
                    <button
                        className={`tab-button ${activeTab === "movie" ? "tab-button-active" : ""}`}
                        onClick={() => handleTabClick('movie')}
                    >
                        Movies
                    </button>
                    <button
                        className={`tab-button ${activeTab === "tv" ? "tab-button-active" : ""}`}
                        onClick={() => handleTabClick('tv')}
                    >
                        TV Shows
                    </button>
                    <button
                        className={`tab-button ${activeTab === "person" ? "tab-button-active" : ""}`}
                        onClick={() => handleTabClick('person')}
                    >
                        Person
                    </button>
                </div>
                <form className="form-container" onSubmit={handleSearch}>
                    <label htmlFor="name" className="form-label">Search</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                        placeholder={`Search for a ${activeTab}`}
                    />
                    <button type="submit" className="form-button">Search</button>
                </form>
            </div>

            {loading ? (
                <div className="loading-container">
                    <img src={netflix_spinner} alt="Loading..." className="loading-spinner" />
                </div>
            ) : (
                <div className="grid-container">
                    {results.map((result) => {
                        if (!result.poster_path && !result.profile_path) return null;

                        return (
                            <div key={result.id} className="grid-item">
                                {activeTab === "person" ? (
                                    <div className="person-info">
                                        <img
                                            src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                                            alt={result.name}
                                            className="person-image"
                                        />
                                        <h2 className="person-name">{result.name}</h2>
                                    </div>
                                ) : (
                                    <Link
                                        to={"/player/" + result.id}
                                        onClick={() => setContentType(activeTab)}
                                    >
                                        <img
                                            src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                                            alt={result.title || result.name}
                                            className="image"
                                        />
                                        <h2 className="title">{result.title || result.name}</h2>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            <Footer />
        </>
    );
};

export default SearchPage;
