const BASE_URL = "https://api.tvmaze.com";

export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/shows?page=1`);

  if (!response.ok) {
    throw new Error("Failed to fetch shows");
  }

  const data = await response.json();

  return data.map((show) => ({
    id: show.id,
    title: show.name,
    overview: show.summary,
    poster_path: show.image?.original || show.image?.medium,
    vote_average: show.rating?.average || 0,
    genre: show.genres || [],
    release_date: show.premiered,
  }));
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search shows");
  }

  const data = await response.json();

  return data.map((item) => {
    const show = item.show;

    return {
      id: show.id,
      title: show.name,
      overview: show.summary,
      poster_path: show.image?.original || show.image?.medium,
      vote_average: show.rating?.average || 0,
      genre: show.genres || [],
      release_date: show.premiered,
    };
  });
};