
//Keeps track of loggin in users and their stats
import { createContext, useCallback, useContext, useEffect, useState } from "react";


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

    // Saves the logged-in user. userInfo is the user object the server sends back,
    // e.g. { username, email } - whatever fields it has get saved, so adding a new
    // field only needs a change on the server.
    const login = (token, userInfo) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userInfo));
        setToken(token);
        setUser(userInfo);
    };

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    }, []);

    // It sends the token, and logs the user out if the server rejects it. Also start of AI code
    const authFetch = useCallback(async (url, options = {}) => {
        const res = await fetch(url, {
            ...options,
            headers: { ...options.headers, Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.status === 401) logout();
        return res;
    }, [logout]);


    const updateUser = useCallback((res) => {
        localStorage.setItem("user", JSON.stringify(userInfo));
        setUser(res);
    }, [])

    // Log out automatically when the token expires (right away if it already has)
    useEffect(() => {
        if (!token) return;
        const timeLeft = Math.max(getTokenExpiry(token) - Date.now(), 0);
        const timer = setTimeout(logout, timeLeft);
        return () => clearTimeout(timer);
    }, [token, logout]);

    // On page load, ask the server if the saved token is still valid.
    // If it is, /api/me also sends the user's latest info from the database, so we
    // refresh the saved copy. This updates users who logged in before a field (like
    // email) was added, without making them log out and back in.
    useEffect(() => {
        if (localStorage.getItem("token")) {
            authFetch("/api/me")
                .then((res) => (res.ok ? res.json() : null)) // 401 is handled by authFetch (logs out)
                .then((freshUser) => {
                    if (freshUser) {
                        const userInfo = { username: freshUser.username, email: freshUser.email };
                        localStorage.setItem("user", JSON.stringify(userInfo));
                        setUser(userInfo);
                    }
                })
                .catch(() => {}); // server down: keep the saved user for now
        }
    }, [authFetch]);

    return (
        <AuthContext.Provider value={{ user, login, logout, authFetch, updateUser }}>
            {children}
        </AuthContext.Provider>
    );

    //End of AI code
}

export function useAuth() {
    return useContext(AuthContext);
}
