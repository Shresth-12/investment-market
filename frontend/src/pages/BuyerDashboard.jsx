import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BuyerDashboard = () => {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/deal/deals", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDeals(res.data);
    };
    fetchDeals();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Available Deals</h1>
      <div className="grid gap-4">
        {deals.map((deal) => (
          <div key={deal._id} className="border p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{deal.title}</h2>
              <p>{deal.description}</p>
              <p className="text-sm text-gray-500">Price: ₹{deal.price}</p>
            </div>
            <button onClick={() => navigate(`/deal/${deal._id}`)} className="btn flex items-center gap-2">
              <Eye size={18} /> View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;
