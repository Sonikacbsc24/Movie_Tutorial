#  Movie Explorer

A React.js movie discovery app built by following [Tech With Tim's "Learn React With This ONE Project"](https://github.com/techwithtim/Learn-React-In-One-Project) tutorial, then extended with user authentication, a live statistics dashboard, and genre/rating filtering.

> Built as part of **CS3301 – Full Stack Development (CIE-2 Assignment)**.

##  Features

-  **Search** movies/shows by title
-  **Filter** by genre and minimum rating
-  **Favorites** — save and persist favorite titles across sessions
-  **Authentication** — login-gated access with protected routing
-  **Statistics Dashboard** — live average rating, favorites count, and genre distribution for the current results
-  **Responsive UI** — adapts to mobile, tablet, and desktop screens

##  Built With

| Category | Technology |
|---|---|
| Library | React 19 |
| Build Tool | Vite |
| Routing | React Router DOM v6 |
| State | React Context API (`MovieContext`, `AuthContext`) |
| Styling | CSS3 with media queries |
| Persistence | Browser `localStorage` |

##  Project Structure

```
frontend/src/
├── components/
│   ├── NavBar.jsx
│   ├── MovieCard.jsx
│   └── MovieStatsDashboard.jsx   # class component
├── contexts/
│   ├── MovieContext.jsx          # favorites state
│   └── AuthContext.jsx           # auth/session state
├── pages/
│   ├── Home.jsx                  # search, filters, dashboard, movie grid
│   ├── Favorites.jsx
│   └── Login.jsx                 # class-based form with validation
├── services/
│   └── api.js                    # TVMaze fetch calls
└── App.jsx                       # routes + protected layout
```

##  Getting Started

```bash
git clone https://github.com/Sonikacbsc24/Movie_Tutorial.git
cd Movie_Tutorial/frontend
npm install
npm run dev
```

Open the local URL Vite prints in your terminal (usually `http://localhost:5173`).

Log in with any username/email and a password of 6+ characters to reach the app — it's a demo login, no backend required.

##  Modifications Beyond the Original Tutorial

1. **Authentication & protected routes** — a class-based `LoginForm` with field validation, wired to an `AuthContext` that gates access to the rest of the app.
2. **Movie Statistics Dashboard** — a class component showing total results, favorites count, average rating, and a genre-distribution chart, computed live from the current filters.
3. **Genre & rating filtering** — narrows the movie grid on top of the original tutorial's plain search.

## References

- Youtube Video Link: https://youtu.be/G6D9cBaLViA
- Tutorial: [Tech With Tim – Learn React With This ONE Project](https://github.com/techwithtim/Learn-React-In-One-Project)
