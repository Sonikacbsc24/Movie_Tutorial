import { Component } from "react";
import "../css/Dashboard.css";

class MovieStatsDashboard extends Component {
  getAverageRating() {
    const { movies } = this.props;
    const rated = movies.filter((movie) => movie.vote_average > 0);

    if (rated.length === 0) {
      return "N/A";
    }

    const total = rated.reduce((sum, movie) => sum + movie.vote_average, 0);
    return (total / rated.length).toFixed(1);
  }

  getGenreDistribution() {
    const counts = {};

    this.props.movies.forEach((movie) => {
      (movie.genre || []).forEach((genre) => {
        counts[genre] = (counts[genre] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }

  render() {
    const { movies, favoritesCount } = this.props;
    const distribution = this.getGenreDistribution();
    const maxCount = distribution[0]?.[1] || 1;

    return (
      <section className="stats-dashboard">
        <h2>Movie Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total results</div>
            <div className="stat-value">{movies.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Favorites</div>
            <div className="stat-value">{favoritesCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average rating</div>
            <div className="stat-value">{this.getAverageRating()}</div>
          </div>
        </div>

        <div className="genre-distribution">
          <h3>Genre distribution</h3>
          {distribution.length === 0 ? (
            <p className="stat-label">No genre data for the current results.</p>
          ) : (
            <div className="genre-bars">
              {distribution.map(([genre, count]) => (
                <div className="genre-row" key={genre}>
                  <span className="genre-name">{genre}</span>
                  <div className="genre-bar-track">
                    <div
                      className="genre-bar-fill"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="genre-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
}

export default MovieStatsDashboard;
