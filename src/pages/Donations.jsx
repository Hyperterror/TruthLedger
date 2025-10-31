import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDonations } from "../store/donationSlice";
import { donationsAPI } from "../services/api";

export default function Donations() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { donations } = useSelector((state) => state.donation);
  const { isAuthenticated, walletAddress } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, my-donations, cause
  const [selectedCause, setSelectedCause] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  // Fetch donations data
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        let fetchedDonations = [];

        if (filter === "my-donations" && walletAddress) {
          fetchedDonations = await donationsAPI.getByDonor(walletAddress);
        } else if (filter === "cause" && selectedCause) {
          fetchedDonations = await donationsAPI.getByCause(selectedCause);
        } else {
          fetchedDonations = await donationsAPI.getAll();
        }

        dispatch(setDonations(fetchedDonations));
      } catch (error) {
        console.error("Failed to fetch donations:", error);
        // Keep existing donations if API fails
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDonations();
    }
  }, [dispatch, isAuthenticated, filter, selectedCause, walletAddress]);

  // Get unique causes for filter dropdown
  const uniqueCauses = [...new Set(donations.map(d => d.cause))];

  const filteredDonations = donations.filter(donation => {
    if (filter === "my-donations") {
      return donation.donor === walletAddress;
    }
    if (filter === "cause") {
      return donation.cause === selectedCause;
    }
    return true;
  });

  if (!isAuthenticated) {
    return <div>Please log in to view donations.</div>;
  }

  return (
    <section className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4 text-blue-400">Donations List</h2>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-700 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Filter</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-600 rounded-lg px-3 py-2 bg-gray-700/50 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              <option value="all">All Donations</option>
              <option value="my-donations">My Donations</option>
              <option value="cause">By Cause</option>
            </select>
          </div>

          {filter === "cause" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cause</label>
              <select
                value={selectedCause}
                onChange={(e) => setSelectedCause(e.target.value)}
                className="border border-gray-600 rounded-lg px-3 py-2 bg-gray-700/50 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              >
                <option value="">Select Cause</option>
                {uniqueCauses.map(cause => (
                  <option key={cause} value={cause}>{cause}</option>
                ))}
              </select>
            </div>
          )}

          <div className="text-sm text-gray-400">
            Showing {filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="overflow-auto max-h-[600px] bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700">
        {loading ? (
          <div className="text-center py-8 text-gray-300">Loading donations...</div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {filter === "my-donations" ? "You haven't made any donations yet." :
             filter === "cause" ? "No donations found for this cause." :
             "No donations found."}
          </div>
        ) : (
          <table className="w-full border-collapse border border-gray-600">
            <thead>
              <tr className="bg-gray-700/50">
                <th className="p-3 border border-gray-600 text-left text-gray-300">Donor</th>
                <th className="p-3 border border-gray-600 text-left text-gray-300">Cause</th>
                <th className="p-3 border border-gray-600 text-left text-gray-300">Amount</th>
                <th className="p-3 border border-gray-600 text-left text-gray-300">Timestamp</th>
                <th className="p-3 border border-gray-600 text-left text-gray-300">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredDonations].reverse().map((d, idx) => (
                <tr key={idx} className="hover:bg-gray-700/30">
                  <td className="p-3 border border-gray-600">
                    <span className="font-mono text-sm text-gray-300">
                      {d.donor.slice(0, 6)}...{d.donor.slice(-4)}
                    </span>
                    {d.donor === walletAddress && (
                      <span className="ml-2 text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded border border-blue-500">You</span>
                    )}
                  </td>
                  <td className="p-3 border border-gray-600">
                    <span className="px-2 py-1 bg-gray-600/50 rounded text-sm text-gray-300 border border-gray-500">{d.cause}</span>
                  </td>
                  <td className="p-3 border border-gray-600 font-semibold text-green-400">
                    {parseFloat(d.amount).toFixed(3)} MATIC
                  </td>
                  <td className="p-3 border border-gray-600 text-sm text-gray-400">
                    {new Date(d.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 border border-gray-600">
                    {d.tx_hash ? (
                      <a
                        href={`https://amoy.polygonscan.com/tx/${d.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm font-mono"
                      >
                        {d.tx_hash.slice(0, 6)}...{d.tx_hash.slice(-4)}
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
