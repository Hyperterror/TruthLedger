import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen p-8 text-center relative overflow-hidden">
            {/* Decorative glow backgrounds */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,_#3b82f6,_transparent_60%)] pointer-events-none"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_right,_#06b6d4,_transparent_60%)] pointer-events-none"></div>

            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-md tracking-wide">
                Welcome to C-DAC
            </h1>

            <p className="mb-8 max-w-xl text-gray-300 text-lg leading-relaxed">
                Transparent charitable giving platform tracking donations on blockchain.
            </p>

            <div className="flex gap-4">
                <Link
                    to="/signup"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 font-medium"
                >
                    Sign Up
                </Link>
                <Link
                    to="/login"
                    className="px-6 py-3 border border-cyan-400 text-cyan-300 rounded-full hover:bg-cyan-400/10 transition-all duration-300 hover:scale-105 font-medium shadow-sm"
                >
                    Log In
                </Link>
            </div>
        </section>

    );
}
