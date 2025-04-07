import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const SellerDashboard = () => {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/deal/deals", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const sellerId = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).userId;
      const myDeals = res.data.filter((d) => d.seller._id === sellerId);
      setDeals(myDeals);
    };
    fetchDeals();
  }, []);

  return (
    <div className="p-8">
      <Navbar/>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Your Deals</h1>
        <button onClick={() => navigate("/seller/create")} className="btn flex items-center gap-2">
          <Plus size={18} /> Create Deal
        </button>
      </div>
      <div className="grid gap-4">
        {deals.map((deal) => (
          <div key={deal._id} className="border p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h2 className="font-semibold">{deal.title}</h2>
              <p>{deal.description}</p>
              <p className="text-sm text-gray-500">Price: ₹{deal.price}</p>
              <p className="text-sm mt-1">
                <span className="font-medium">Status:</span>{" "}
                <span className={
                  deal.status === "Pending" ? "text-yellow-600" :
                  deal.status === "Completed" ? "text-green-600" :
                  "text-red-600"
                }>
                  {deal.status}
                </span>
              </p>
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

export default SellerDashboard;
