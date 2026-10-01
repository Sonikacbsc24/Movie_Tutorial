const API_BASE = "http://localhost:5000/api";

async function readJson(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }
  return data;
}

export const getPopularMovies = async () => {
  const response = await fetch(`${API_BASE}/movies`);
  return readJson(response, "Failed to fetch movies.");
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${API_BASE}/movies?search=${encodeURIComponent(query)}`
  );
  return readJson(response, "Failed to search movies.");
};

export const loginUser = async ({ username, password }) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return readJson(response, "Login failed.");
};

export const registerUser = async ({ username, password }) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return readJson(response, "Could not create account.");
};

export const getFavorites = async (userId) => {
  const response = await fetch(
    `${API_BASE}/favorites/${encodeURIComponent(userId)}`
  );
  const data = await readJson(response, "Failed to load favorites.");
  return data.favorites || [];
};

export const saveFavorites = async (userId, favorites) => {
  const response = await fetch(
    `${API_BASE}/favorites/${encodeURIComponent(userId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorites }),
    }
  );
  const data = await readJson(response, "Failed to save favorites.");
  return data.favorites || [];
};
