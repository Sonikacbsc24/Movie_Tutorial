import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/Navbar.css";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Movie App</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/favorites" className="nav-link">
          Favorites
        </Link>
        {user && (
          <>
            <span className="nav-user">{user.username}</span>
            <button type="button" className="nav-link logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
