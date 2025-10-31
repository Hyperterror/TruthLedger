import React, { useState } from "react";

export default function Signup() {
  const [wallet, setWallet] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (!wallet) return alert("Please enter wallet address.");
    alert(`Signup success for ${wallet}`);
    // TODO: Add actual signup logic
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black relative overflow-hidden text-gray-100 px-4">
      {/* Decorative glows */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#3b82f6,_transparent_60%)] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_right,_#06b6d4,_transparent_60%)] pointer-events-none"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-sm bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-blue-500/20 hover:scale-[1.01]">
        <h2 className="text-2xl font-bold text-center mb-5 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-md tracking-wide">
          Sign Up
        </h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Wallet Address
            </label>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="Enter your wallet address"
              className="w-full rounded-md px-3 py-2 bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 text-gray-100 placeholder-gray-500 outline-none transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-md font-medium shadow-md hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        {/* Divider line */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-6"></div>

        {/* Subtext */}
        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
          >
            Log In
          </a>
        </p>
      </div>
    </section>
  );
}
