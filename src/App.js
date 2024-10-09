/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Route, Routes, Link, Navigate, useNavigate } from "react-router-dom";
import {jwtDecode }from "jwt-decode";

import Login from "./components/login";
import Register from "./components/signup";
import Home from "./components/home";
import Dashboard from "./components/dashboard";
import Translator from "./components/translator";

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
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                Signa
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <>
                  <span className="mr-4">Welcome, {user.username}</span>
                  <button
                    onClick={logout}
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Home />}
          />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" login={login}/>}
          />
          <Route
            path="/translator"
            element={user ? <Translator /> : <Navigate to="/login" login={login}/>}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
