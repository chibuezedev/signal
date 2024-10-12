/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Narbar from "./components/navbar";

import Login from "./components/login";
import Register from "./components/signup";
import Home from "./components/home";
import Dashboard from "./components/dashboard";
import Translator from "./pages/translator";
import LearnSigns from "./pages/learnSign";

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode(token);
    setUser(decodedToken);
    navigate("/translator");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(decodedToken);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Narbar user={user} logout={logout} />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/join-call" element={<Dashboard />} />
          <Route path="/translator" element={<Translator />} />
          <Route path="/learn" element={<LearnSigns />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
