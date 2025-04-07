import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const BuyerDashboard = () => {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  const fetchDeals = async () => {
    const res = await axios.get("https://investment-market-backend.onrender.com/api/v1/deal/deals", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setDeals(res.data);
  };

  const handleAction = async (id, action) => {
    try {
      await axios.put(
        `https://investment-market-backend.onrender.com/api/v1/deal/${action}/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchDeals(); // Refresh deals after action
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return (
    <div className="p-8">
        <Navbar/>
      <h1 className="text-xl font-bold mb-4">Available Deals</h1>
      <div className="grid gap-4">
        {deals.map((deal) => (
          <div
            key={deal._id}
            className="border p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{deal.title}</h2>
              <p>{deal.description}</p>
              <p className="text-sm text-gray-500">Price: ₹{deal.price}</p>
              <p className="text-sm mt-1">
                Status:{" "}
                <span
                  className={`font-medium ${
                    deal.status === "Completed"
                      ? "text-green-600"
                      : deal.status === "Cancelled"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {deal.status}
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <button
                onClick={() => navigate(`/deal/${deal._id}`)}
                className="btn flex items-center gap-2"
              >
                <Eye size={18} /> View
              </button>

              {deal.status === "Pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAction(deal._id, "accept")}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(deal._id, "reject")}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;
