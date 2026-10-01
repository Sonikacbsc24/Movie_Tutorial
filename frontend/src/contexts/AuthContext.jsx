import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/api";

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

  const persistUser = (userData) => {
    setUser(userData);
    localStorage.setItem("movieAppUser", JSON.stringify(userData));
    return userData;
  };

  const login = async (credentials) => {
    return persistUser(await loginUser(credentials));
  };

  const register = async (credentials) => {
    return persistUser(await registerUser(credentials));
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
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
