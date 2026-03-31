import {createContext, useContext, useEffect, useState} from "react";
import {authAPI} from "../api/services.js";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(token) {
            authAPI
                .me()
                .then((res) => setUser(res.data.user))
                .catch(() => localStorage.removeItem("token"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        const res = await authAPI.login(credentials);
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};