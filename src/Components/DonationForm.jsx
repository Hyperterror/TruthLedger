import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addDonation } from "../store/donationSlice";

export default function DonationForm() {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [cause, setCause] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!amount || parseFloat(amount) <= 0 || !cause.trim()) {
      alert("Please enter valid amount and cause.");
      return;
    }

    const newDonation = {
      donor: "0xYourWalletAddress", // Replace or get from wallet connection
      amount: parseFloat(amount),
      cause,
      timestamp: new Date().toISOString(),
    };

    dispatch(addDonation(newDonation));
    setAmount("");
    setCause("");
    alert("Donation added (simulate)!");
  };

  return (
    <section id="donate" className="mt-12 bg-white rounded-md p-6 shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Make a Donation</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Amount (MATIC)
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 mt-1"
            required
          />
        </label>
        <label>
          Cause
          <input
            type="text"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2 mt-1"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-semibold"
        >
          Donate
        </button>
      </form>
    </section>
  );
}
