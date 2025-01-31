import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Use React Router's useNavigate
import { useContentStore } from '../../components/content';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios'; // Import axios
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'; // Import toast
import './SearchPage.css'; // Import the CSS file
import { ORIGINAL_IMG_BASE_URL } from '../../utils/constants';
import Footer from '../../components/Footer/Footer';

const SearchPage = () => {
    const [activeTab, setActiveTab] = useState('movie');
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const { setContentType } = useContentStore();

    const navigate = useNavigate(); // Use useNavigate instead of useRouter

    useEffect(() => {
        navigate("/search"); // Ensures navigation to this page
    }, [navigate]); // Include navigate in dependencies

    const handleTabClick = (tab) => {
        setActiveTab(tab); // Update activeTab state
        tab === "movie" ? setContentType("movie") : setContentType("tv");
        setResults([]); // Reset results
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`https://sprinkle-ionian-sodalite.glitch.me/api/v1/search/${activeTab}/${searchTerm}`);
            setResults(res.data.content);
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error("Nothing found");
            } else {
                toast.error("An error occurred");
            }
        }
    };

    // Log results whenever they change
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
                    <button type="submit" className="form-button">Submit</button>
                </form>

  
			
            </div>
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
    <Footer/>
        </>
    );
};

export default SearchPage;
