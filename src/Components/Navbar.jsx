import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-transparent text-white p-6 font-mono shadow flex justify-between items-center">
      <NavLink to="/" className="font-bold text-xl">C-DAC</NavLink>
      <div className="flex gap-6">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "underline" : ""}>Dashboard</NavLink>
        <NavLink to="/donations" className={({ isActive }) => isActive ? "underline" : ""}>Donations</NavLink>
        <NavLink to="/donate" className={({ isActive }) => isActive ? "underline" : ""}>Donate</NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? "underline" : ""}>Login</NavLink>
        <NavLink to="/signup" className={({ isActive }) => isActive ? "underline" : ""}>Sign Up</NavLink>
      </div>
    </nav>
  );
}
