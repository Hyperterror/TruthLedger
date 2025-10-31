import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure, clearError } from "../store/authSlice";
import web3Service from "../services/web3";

export default function Login() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);



  const connectWallet = async () => {
    try {
      dispatch(clearError());
      const initialized = await web3Service.init();
      if (initialized) {
        const address = await web3Service.getAddress();
        setWalletAddress(address);
        setWalletConnected(true);
      } else {
        alert("Please install MetaMask to continue");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      dispatch(loginFailure("Failed to connect wallet"));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!walletConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      dispatch(loginStart());

      // Switch to Polygon Amoy network
      await web3Service.switchToAmoy();

      // Skip backend authentication for now - allow anyone to login
      dispatch(loginSuccess({
        walletAddress,
        token: "dummy-token" // Use dummy token for now
      }));

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      dispatch(loginFailure("Failed to switch network"));
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-400">
          Welcome Back
        </h2>

        {!walletConnected ? (
          <div className="text-center">
            <p className="text-gray-300 mb-6">
              Connect your MetaMask wallet to continue
            </p>
            <button
              onClick={connectWallet}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg transition duration-300 mb-4"
            >
              Connect MetaMask
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 mb-6">
              <p className="text-green-400 text-sm">Wallet Connected</p>
              <p className="text-gray-300 text-xs font-mono mt-1">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </section>
  );
}
