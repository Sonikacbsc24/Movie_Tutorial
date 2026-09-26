import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("movieAppUser");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setReady(true);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("movieAppUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("movieAppUser");
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    ready,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
