import MovieCard from "../components/MovieCard";
import MovieStatsDashboard from "../components/MovieStatsDashboard";
import { useState, useEffect, useMemo } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/Home.css";

const GENRE_OPTIONS = [
  "All",
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Thriller",
  "Romance",
  "Crime",
  "Science-Fiction",
];

const RATING_OPTIONS = [
  { label: "All", value: 0 },
  { label: "8+", value: 8 },
  { label: "7+", value: 7 },
  { label: "6+", value: 6 },
  { label: "5+", value: 5 },
];

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const { favorites } = useMovieContext();

  const isSearchValid = searchQuery.trim().length >= 2;

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  const runSearch = async (query) => {
    setLoading(true);
    try {
      const searchResults = await searchMovies(query);
      setMovies(searchResults);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies...");
    } finally {
      setLoading(false);
    }
  };

  // Debounced search: wait until typing stops, then query the API.
  // Cleanup clears the timer so stale keystrokes do not fire extra requests.
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 3) {
      return undefined;
    }

    const timer = setTimeout(() => {
      runSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchError("Enter a movie title to search.");
      return;
    }

    if (searchQuery.trim().length < 2) {
      setSearchError("Search must be at least 2 characters.");
      return;
    }

    setSearchError("");
    await runSearch(searchQuery.trim());
  };

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesGenre =
        selectedGenre === "All" || (movie.genre || []).includes(selectedGenre);
      const matchesRating = (movie.vote_average || 0) >= minRating;
      return matchesGenre && matchesRating;
    });
  }, [movies, selectedGenre, minRating]);

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form" noValidate>
        <input
          type="text"
          placeholder="Search for movies..."
          className={`search-input ${searchError ? "invalid" : ""}`}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchError("");
          }}
        />
        <button type="submit" className="search-button" disabled={!isSearchValid}>
          Search
        </button>
      </form>
      {searchError && <p className="search-error">{searchError}</p>}

      <div className="filters">
        <div className="filter-group">
          <h3>Genre</h3>
          <div className="filter-buttons">
            {GENRE_OPTIONS.map((genre) => (
              <button
                key={genre}
                type="button"
                className={`filter-btn ${selectedGenre === genre ? "active" : ""}`}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Rating</h3>
          <div className="filter-buttons">
            {RATING_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                className={`filter-btn ${minRating === option.value ? "active" : ""}`}
                onClick={() => setMinRating(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <MovieStatsDashboard
            movies={filteredMovies}
            favoritesCount={favorites.length}
          />
          <div className="movies-grid">
            {filteredMovies.length === 0 ? (
              <p className="no-results">No movies match the selected filters.</p>
            ) : (
              filteredMovies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
