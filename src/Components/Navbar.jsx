import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const { isAuthenticated, walletAddress } = useSelector((state) => state.auth);

  return (
    <nav className="bg-transparent text-white p-6 font-mono shadow flex justify-between items-center">
      <NavLink to="/" className="font-bold text-xl">C-DAC</NavLink>
      <div className="flex gap-6 items-center">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "underline" : ""}>Dashboard</NavLink>
            <NavLink to="/donations" className={({ isActive }) => isActive ? "underline" : ""}>Donations</NavLink>
            <NavLink to="/donate" className={({ isActive }) => isActive ? "underline" : ""}>Donate</NavLink>
            <span className="text-sm text-gray-300">
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ""}
            </span>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? "underline" : ""}>Login</NavLink>
            <NavLink to="/signup" className={({ isActive }) => isActive ? "underline" : ""}>Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
