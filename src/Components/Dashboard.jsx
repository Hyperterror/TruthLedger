import React from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const donations = useSelector((state) => state.donation.donations);

  // Prepare data, fallback empty
  const chartData = {
    labels: donations.map((d) => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "Donation Amount (MATIC)",
        data: donations.map((d) => d.amount),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <section
  id="dashboard"
  className="relative mb-12 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg border border-gray-200 overflow-hidden"
>
  {/* Decorative gradient circle background */}
  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_#3b82f6,_transparent_50%)] pointer-events-none"></div>

  {/* Title Section */}
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
      Donation Dashboard
    </h2>
    <span className="text-sm text-gray-500">Updated recently</span>
  </div>

  {/* Chart or Empty State */}
  <div className="relative bg-white rounded-xl shadow-inner p-6 transition-transform duration-300 hover:scale-[1.01]">
    {donations.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-48 text-gray-500">
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
        <p className="text-sm text-gray-400 mt-1">Start making an impact today!</p>
      </div>
    ) : (
      <div className="animate-fadeIn">
        <Line data={chartData} />
      </div>
    )}
  </div>
</section>

  );
}
