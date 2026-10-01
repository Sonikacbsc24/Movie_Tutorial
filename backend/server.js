const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const TVMAZE_URL = "https://api.tvmaze.com";
const DATA_DIR = path.join(__dirname, "data");
const FAVORITES_FILE = path.join(DATA_DIR, "favorites.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

app.use(cors());
app.use(express.json());

function mapShow(show) {
  if (!show) return null;

  return {
    id: show.id,
    title: show.name,
    overview: show.summary,
    poster_path: show.image?.original || show.image?.medium,
    vote_average: show.rating?.average || 0,
    genre: show.genres || [],
    release_date: show.premiered,
  };
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateCredentials({ username, password }) {
  const errors = {};
  const identifier = String(username || "").trim();

  if (!identifier) {
    errors.username = "Username or email is required.";
  } else if (identifier.includes("@")) {
    if (!isEmail(identifier)) {
      errors.username = "Enter a valid email address.";
    }
  } else if (identifier.length < 3) {
    errors.username = "Username must be at least 3 characters.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (String(password).length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return { identifier, errors, valid: Object.keys(errors).length === 0 };
}

function toUserId(username) {
  return username.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, data) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readFavoritesStore() {
  return readJsonFile(FAVORITES_FILE, {});
}

function writeFavoritesStore(store) {
  writeJsonFile(FAVORITES_FILE, store);
}

function readUsersStore() {
  return readJsonFile(USERS_FILE, {});
}

function writeUsersStore(store) {
  writeJsonFile(USERS_FILE, store);
}

function usernameFromUserId(userId) {
  const parts = String(userId).split("-");
  if (parts.length >= 3) {
    const tld = parts.pop();
    const domain = parts.pop();
    return `${parts.join("-")}@${domain}.${tld}`;
  }
  return userId;
}

function passwordMatches(password, user) {
  return String(password) === String(user.password);
}

function seedUsersFromFavorites() {
  const favorites = readFavoritesStore();
  const users = readUsersStore();
  let changed = false;

  Object.keys(favorites).forEach((userId) => {
    if (users[userId]) return;
    users[userId] = {
      id: userId,
      username: usernameFromUserId(userId),
      password: "password123",
      createdAt: new Date().toISOString(),
    };
    changed = true;
  });

  if (changed) {
    writeUsersStore(users);
  }
}

function findUser(identifier) {
  const store = readUsersStore();
  const userId = toUserId(identifier);
  const users = Object.values(store);

  return (
    users.find((user) => user.id === userId) ||
    users.find(
      (user) => String(user.username).toLowerCase() === identifier.toLowerCase()
    ) ||
    null
  );
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    loggedInAt: new Date().toISOString(),
  };
}

app.get("/api/movies", async (req, res) => {
  const search = String(req.query.search || "").trim();

  try {
    const url = search
      ? `${TVMAZE_URL}/search/shows?q=${encodeURIComponent(search)}`
      : `${TVMAZE_URL}/shows?page=1`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("TVMaze request failed");
    }

    const data = await response.json();
    const movies = search
      ? data.map((item) => mapShow(item.show)).filter(Boolean)
      : data.map(mapShow).filter(Boolean);

    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(502).json({ message: "Failed to fetch movies." });
  }
});

app.post("/api/register", (req, res) => {
  const { identifier, errors, valid } = validateCredentials(req.body || {});

  if (!valid) {
    return res.status(400).json({ message: "Invalid account details.", errors });
  }

  if (findUser(identifier)) {
    return res.status(409).json({
      message: "An account with that username or email already exists. Please log in.",
    });
  }

  const userId = toUserId(identifier);
  const store = readUsersStore();
  store[userId] = {
    id: userId,
    username: identifier,
    password: String(req.body.password),
    createdAt: new Date().toISOString(),
  };
  writeUsersStore(store);

  res.status(201).json(publicUser(store[userId]));
});

app.post("/api/login", (req, res) => {
  const { identifier, errors, valid } = validateCredentials(req.body || {});

  if (!valid) {
    return res.status(400).json({ message: "Invalid login details.", errors });
  }

  const user = findUser(identifier);
  if (!user) {
    return res.status(401).json({
      message: "No account found. Create an account first.",
    });
  }

  if (!passwordMatches(req.body.password, user)) {
    return res.status(401).json({ message: "Incorrect password." });
  }

  res.json(publicUser(user));
});

app.get("/api/favorites/:userId", (req, res) => {
  const store = readFavoritesStore();
  const favorites = store[req.params.userId] || [];
  res.json({ favorites });
});

app.post("/api/favorites/:userId", (req, res) => {
  const { userId } = req.params;
  const payload = req.body;
  const favorites = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.favorites)
      ? payload.favorites
      : null;

  if (!favorites) {
    return res.status(400).json({ message: "Send a favorites array." });
  }

  const store = readFavoritesStore();
  store[userId] = favorites;
  writeFavoritesStore(store);

  res.json({ favorites: store[userId] });
});

seedUsersFromFavorites();

app.listen(PORT, () => {
  console.log(`Movie API running on http://localhost:${PORT}`);
});
