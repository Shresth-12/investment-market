import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("https://investment-market-backend.onrender.com/api/v1/admin/check", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.admin) setIsAdmin(true);
      } catch (error) {
        console.error("Admin check failed:", error);
      }
    };

    checkAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="px-6 py-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Investment Market
      </h1>

      <div className="flex items-center gap-4">
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Admin Page
          </button>
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
