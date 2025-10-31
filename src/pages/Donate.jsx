import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addDonation } from "../store/donationSlice";

export default function Donate() {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [cause, setCause] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0 || !cause.trim()) {
      alert("Please enter valid amount & cause.");
      return;
    }

    const newDonation = {
      donor: "0xYourWalletAddress",  // Replace with actual wallet login state
      amount: parseFloat(amount),
      cause,
      timestamp: new Date().toISOString(),
    };

    dispatch(addDonation(newDonation));
    setAmount("");
    setCause("");
    alert("Thank you for your simulated donation!");
  };

  return (
    <section className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-semibold mb-6 text-center">Make a Donation</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="block font-medium">
          Amount (MATIC)
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            required
          />
        </label>

        <label className="block font-medium">
          Cause
          <input
            type="text"
            value={cause}
            onChange={(e) => setCause(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
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
