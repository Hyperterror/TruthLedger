import React from "react";
import { useSelector } from "react-redux";

export default function Donations() {
  const donations = useSelector((state) => state.donation.donations);

  return (
    <section>
      <h2 className="text-3xl font-semibold mb-4 text-blue-700">Donations List</h2>
      <div className="overflow-auto max-h-[400px] bg-white p-6 rounded shadow">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border border-gray-300 text-left">Donor</th>
              <th className="p-2 border border-gray-300 text-left">Cause</th>
              <th className="p-2 border border-gray-300 text-left">Amount</th>
              <th className="p-2 border border-gray-300 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {[...donations].reverse().map((d, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-300 truncate max-w-xs">{d.donor}</td>
                <td className="p-2 border border-gray-300">{d.cause}</td>
                <td className="p-2 border border-gray-300">{d.amount.toFixed(3)} MATIC</td>
                <td className="p-2 border border-gray-300">{new Date(d.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
