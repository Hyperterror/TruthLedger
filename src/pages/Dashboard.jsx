import React from "react";
import { useSelector } from "react-redux";
import DonationChart from "./Donations";

export default function Dashboard() {
  const donations = useSelector((state) => state.donation.donations);
  const totalAmount = donations.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <section>
      <h2 className="text-3xl font-semibold mb-4 text-blue-700">Dashboard</h2>
      <div className="flex gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow w-1/3 text-center">
          <p className="text-gray-600">Total Donations</p>
          <p className="text-4xl font-bold">{donations.length}</p>
        </div>
        <div className="bg-white p-6 rounded shadow w-1/3 text-center">
          <p className="text-gray-600">Total Amount (MATIC)</p>
          <p className="text-4xl font-bold">{totalAmount.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6">
        <DonationChart />
      </div>
    </section>
  );
}
