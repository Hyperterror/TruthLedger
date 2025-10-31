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
    <section>
      <h2 className="text-3xl font-semibold mb-4 text-blue-700">Donations List</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="all">All Donations</option>
              <option value="my-donations">My Donations</option>
              <option value="cause">By Cause</option>
            </select>
          </div>

          {filter === "cause" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cause</label>
              <select
                value={selectedCause}
                onChange={(e) => setSelectedCause(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select Cause</option>
                {uniqueCauses.map(cause => (
                  <option key={cause} value={cause}>{cause}</option>
                ))}
              </select>
            </div>
          )}

          <div className="text-sm text-gray-600">
            Showing {filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="overflow-auto max-h-[600px] bg-white p-6 rounded shadow">
        {loading ? (
          <div className="text-center py-8">Loading donations...</div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filter === "my-donations" ? "You haven't made any donations yet." :
             filter === "cause" ? "No donations found for this cause." :
             "No donations found."}
          </div>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border border-gray-300 text-left">Donor</th>
                <th className="p-3 border border-gray-300 text-left">Cause</th>
                <th className="p-3 border border-gray-300 text-left">Amount</th>
                <th className="p-3 border border-gray-300 text-left">Timestamp</th>
                <th className="p-3 border border-gray-300 text-left">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredDonations].reverse().map((d, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-300">
                    <span className="font-mono text-sm">
                      {d.donor.slice(0, 6)}...{d.donor.slice(-4)}
                    </span>
                    {d.donor === walletAddress && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                    )}
                  </td>
                  <td className="p-3 border border-gray-300">
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">{d.cause}</span>
                  </td>
                  <td className="p-3 border border-gray-300 font-semibold text-green-600">
                    {parseFloat(d.amount).toFixed(3)} MATIC
                  </td>
                  <td className="p-3 border border-gray-300 text-sm text-gray-600">
                    {new Date(d.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {d.tx_hash ? (
                      <a
                        href={`https://amoy.polygonscan.com/tx/${d.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm font-mono"
                      >
                        {d.tx_hash.slice(0, 6)}...{d.tx_hash.slice(-4)}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
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
