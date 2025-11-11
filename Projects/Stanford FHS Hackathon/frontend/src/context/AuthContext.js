import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: localStorage.getItem("user_id") || null,
    role: localStorage.getItem("role") || null,
  });

  const login = (userId, role) => {
    localStorage.setItem("user_id", userId);
    localStorage.setItem("role", role);
    setUser({ userId, role });
  };

  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    setUser({ userId: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};