import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:7117/api/Auth/me", {
        withCredentials: true,
      });
      setUserRole(res.data.role);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        try {
          await axios.post("http://localhost:7117/api/Auth/refresh", null, {
            withCredentials: true,
          });
          const retry = await axios.get("http://localhost:7117/api/Auth/me", {
            withCredentials: true,
          });
          setUserRole(retry.data.role);
        } catch (refreshErr) {
          console.log("Refresh failed:", refreshErr);
          setUserRole(null);
        }
      } else {
        console.log("Auth error:", err);
        setUserRole(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, fetchUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
