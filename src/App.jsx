import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Donations from "./pages/Donations";
import Donate from "./pages/Donate";
import { loginSuccess } from "./store/authSlice";
import { authAPI } from "./services/api";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      authAPI.verifyToken(token).then(response => {
        if (response.valid) {
          dispatch(loginSuccess({
            walletAddress: response.address,
            token: token
          }));
        } else {
          localStorage.removeItem('token');
        }
      }).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <Navbar />
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
