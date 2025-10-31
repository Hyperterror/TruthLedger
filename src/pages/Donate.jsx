import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addDonation } from "../store/donationSlice";
import { donationsAPI } from "../services/api";
import web3Service from "../services/web3";

export default function Donate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { walletAddress, isAuthenticated } = useSelector((state) => state.auth);

  const [amount, setAmount] = useState("");
  const [cause, setCause] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0 || !cause.trim()) {
      alert("Please enter valid amount & cause.");
      return;
    }

    if (!walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    setLoading(true);

    try {
      // Make blockchain donation
      const result = await web3Service.makeDonation(amount, cause);

      if (result.success) {
        setTxHash(result.txHash);

        // Create donation object for local state
        const newDonation = {
          donor: walletAddress,
          amount: parseFloat(amount),
          cause,
          timestamp: new Date().toISOString(),
          tx_hash: result.txHash,
        };

        // Add to Redux store
        dispatch(addDonation(newDonation));

        // Optionally sync with backend (though event listener should handle this)
        try {
          await donationsAPI.getAll(); // This will refresh data from backend
        } catch (error) {
          console.log("Backend sync optional, event listener will handle");
        }

        alert(`Thank you for your donation! Transaction: ${result.txHash.slice(0, 10)}...`);

        // Reset form
        setAmount("");
        setCause("");
        setTxHash("");
      } else {
        alert(`Donation failed: ${result.error}`);
      }
    } catch (donationError) {
      console.error("Donation error:", donationError);
      alert("Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to make a donation.</div>;
  }

  return (
    <section className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-semibold mb-6 text-center">Make a Donation</h2>

      <div className="mb-4 p-3 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          Connected Wallet: {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Not connected"}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="block font-medium">
          Amount (MATIC)
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            placeholder="0.00"
            required
            disabled={loading}
          />
        </label>

        <label className="block font-medium">
          Cause
          <input
            type="text"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            placeholder="e.g., Education, Healthcare, Environment"
            required
            disabled={loading}
          />
        </label>

        <button
          type="submit"
          disabled={loading || !amount || !cause.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded py-2 font-semibold transition duration-200"
        >
          {loading ? "Processing Donation..." : "Donate"}
        </button>
      </form>

      {txHash && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-sm text-green-800">
            Transaction successful! Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </p>
          <a
            href={`https://amoy.polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            View on PolygonScan
          </a>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>⚠️ This will initiate a blockchain transaction requiring MATIC and gas fees.</p>
      </div>
    </section>
  );
}
