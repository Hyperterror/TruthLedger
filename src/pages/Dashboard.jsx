import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDonations } from "../store/donationSlice";
import { donationsAPI } from "../services/api";
import DonationChart from "../Components/Dashboard";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { donations } = useSelector((state) => state.donation);
  const { isAuthenticated, walletAddress } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    userDonations: 0,
    userAmount: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  // Fetch donations data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all donations
        const allDonations = await donationsAPI.getAll();
        dispatch(setDonations(allDonations));

        // Fetch statistics
        const statistics = await donationsAPI.getStatistics();

        // Calculate user-specific stats
        const userDonations = allDonations.filter(d => d.donor === walletAddress);

        setStats({
          totalDonations: allDonations.length,
          totalAmount: statistics.total_amount || allDonations.reduce((acc, curr) => acc + parseFloat(curr.amount), 0),
          userDonations: userDonations.length,
          userAmount: userDonations.reduce((acc, curr) => acc + parseFloat(curr.amount), 0),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Fallback to local data if API fails
        const totalAmount = donations.reduce((acc, curr) => acc + curr.amount, 0);
        setStats({
          totalDonations: donations.length,
          totalAmount,
          userDonations: 0,
          userAmount: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [dispatch, isAuthenticated, walletAddress]);

  if (!isAuthenticated) {
    return <div>Please log in to view dashboard.</div>;
  }

  if (loading) {
    return (
      <section>
        <h2 className="text-3xl font-semibold mb-4 text-blue-700">Dashboard</h2>
        <div className="text-center py-8">Loading dashboard data...</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4 text-blue-400">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 text-center">
          <p className="text-gray-300">Total Donations</p>
          <p className="text-4xl font-bold text-blue-400">{stats.totalDonations}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 text-center">
          <p className="text-gray-300">Total Amount (MATIC)</p>
          <p className="text-4xl font-bold text-green-400">{stats.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 text-center">
          <p className="text-gray-300">Your Donations</p>
          <p className="text-4xl font-bold text-purple-400">{stats.userDonations}</p>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700 text-center">
          <p className="text-gray-300">Your Total (MATIC)</p>
          <p className="text-4xl font-bold text-orange-400">{stats.userAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-700 mb-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-400">Wallet Information</h3>
        <p className="text-sm text-gray-300">
          Connected: {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Not connected"}
        </p>
      </div>

      {/* Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">Donation Analytics</h3>
        <DonationChart />
      </div>
    </section>
  );
}
