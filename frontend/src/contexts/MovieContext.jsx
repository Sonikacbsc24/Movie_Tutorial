import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getFavorites, saveFavorites } from "../services/api";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const { user, ready } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const userId = user?.id;

  useEffect(() => {
    if (!ready) return;

    if (!userId) {
      setFavorites([]);
      return;
    }

    let cancelled = false;

    const loadFavorites = async () => {
      const cached = localStorage.getItem(`favorites-${userId}`);
      if (cached && !cancelled) {
        setFavorites(JSON.parse(cached));
      }

      try {
        const serverFavs = await getFavorites(userId);
        if (!cancelled) {
          setFavorites(serverFavs);
          localStorage.setItem(`favorites-${userId}`, JSON.stringify(serverFavs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadFavorites();
    return () => {
      cancelled = true;
    };
  }, [ready, userId]);

  const persistFavorites = (nextFavorites) => {
    setFavorites(nextFavorites);

    if (!userId) return;

    localStorage.setItem(`favorites-${userId}`, JSON.stringify(nextFavorites));
    saveFavorites(userId, nextFavorites).catch((error) => console.log(error));
  };

  const addToFavorites = (movie) => {
    if (favorites.some((item) => item.id === movie.id)) return;
    persistFavorites([...favorites, movie]);
  };

  const removeFromFavorites = (movieId) => {
    persistFavorites(favorites.filter((movie) => movie.id !== movieId));
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
