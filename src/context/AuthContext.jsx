//Keeps track of loggin in users and their stats
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

// reads when a JWT expires.oOnly used to time the auto logout, the server still does the real check.
//AI Code generated to help with auto logout when token expires
function getTokenExpiry(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).exp * 1000;
  } catch {
    return 0;
  }
}
//End of AI code

//purpose to help update header with logged in user
export function AuthProvider({ children }) {
  // Start with whatever was saved, so a page refresh keeps you logged in
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = (token, username, email) => {
    localStorage.setItem("token", token);
    console.log(email)
    localStorage.setItem("user", JSON.stringify({ username, email }));
    setToken(token);
    setUser({ username, email });
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  // It sends the token, and logs the user out if the server rejects it. Also start of AI
  const authFetch = useCallback(
    async (url, options = {}) => {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 401) logout();
      return res;
    },
    [logout],
  );

  // Log out automatically when the token expires (right away if it already has)
  useEffect(() => {
    if (!token) return;
    const timeLeft = Math.max(getTokenExpiry(token) - Date.now(), 0);
    const timer = setTimeout(logout, timeLeft);
    return () => clearTimeout(timer);
  }, [token, logout]);

  // On page load, ask the server if the saved token is still valid
  useEffect(() => {
    if (localStorage.getItem("token")) {
      authFetch("/api/me").catch(() => {}); // server down: stay logged in for now
    }
  }, [authFetch]);

  return (
    <AuthContext.Provider value={{ user, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );

  //End of AI code
}

export function useAuth() {
  return useContext(AuthContext);
}
