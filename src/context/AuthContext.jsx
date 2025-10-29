// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On initial load, check localStorage for auth data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    if (token && userId && userRole) {
      setUser({ id: userId, role: userRole });
    }
  }, []);

  // Updated login function to handle the API response
  const login = (userData, token) => {
    const simplifiedUser = { id: userData.id, role: userData.role };
    setUser(simplifiedUser);
    
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("userRole", userData.role);

    if (userData.fullName) {
      localStorage.setItem("fullName", userData.fullName);
    }

  };

 

  // Updated logout function to clear all auth data
  const logout = () => {
    setUser(null);
    localStorage.clear(); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);