import React, { useState } from "react";

export default function Login() {
  const [wallet, setWallet] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!wallet) return alert("Enter wallet address");
    alert(`Logged in as ${wallet}`);
    // TODO: Implement login & redirect to dashboard
  };

  return (
    <section className="mx-auto max-w-md p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-semibold mb-4 text-center">Log In</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <label className="block font-medium text-left">Wallet Address</label>
        <input
          type="text"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          placeholder="0xabc123..."
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </section>
  );
}
