import React from "react";
import { useSelector } from "react-redux";

export default function DonationsList() {
  const donations = useSelector((state) => state.donation.donations);

  return (
    <section
  id="donations"
  className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 rounded-2xl shadow-lg border border-gray-200 max-h-[420px] overflow-y-auto transition-transform duration-300 hover:scale-[1.01]"
>
  {/* Decorative gradient glow */}
  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_right,_#6366f1,_transparent_60%)] pointer-events-none"></div>

  {/* Title */}
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
      Recent Donations
    </h2>
    <span className="text-sm text-gray-500">Live updates</span>
  </div>

  {/* Donation List or Empty State */}
  {donations.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <svg
        className="w-16 h-16 mb-3 text-gray-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zm0 2c-3.866 0-7 3.134-7 7v3h14v-3c0-3.866-3.134-7-7-7z"
        />
      </svg>
      <p className="text-lg font-medium">No donations yet</p>
      <p className="text-sm text-gray-400 mt-1">Be the first to make a difference!</p>
    </div>
  ) : (
    <div className="animate-fadeIn overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <th className="p-3 rounded-l-lg">Donor</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Cause</th>
            <th className="p-3 rounded-r-lg">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {[...donations].reverse().map((donation, idx) => (
            <tr
              key={idx}
              className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 hover:translate-y-[-2px]"
            >
              <td className="p-3 font-medium text-gray-700 truncate max-w-xs">{donation.donor}</td>
              <td className="p-3 text-indigo-600 font-semibold">{donation.amount.toFixed(3)} MATIC</td>
              <td className="p-3 text-gray-600">{donation.cause}</td>
              <td className="p-3 text-gray-500 text-sm">{new Date(donation.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

  );
}
