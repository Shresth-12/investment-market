import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const AdminDashboard = () => {
  const [dealStats, setDealStats] = useState({});
  const [userStats, setUserStats] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#4ade80", "#facc15", "#f87171", "#38bdf8"];
  const chartData = [
    { name: "Completed", value: dealStats.completed || 0 },
    { name: "Pending", value: dealStats.pending || 0 },
    { name: "Cancelled", value: dealStats.cancelled || 0 },
    { name: "In Progress", value: dealStats.inProgress || 0 },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const checkAdmin = async () => {
      try {
        const res = await axios.get("https://investment-market-backend.onrender.com/api/v1/admin/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.admin) setIsAdmin(true);
      } catch (error) {
        console.error("Admin check failed:", error);
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://investment-market-backend.onrender.com/api/v1/admin/user-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDealStats(res.data.dealStats);
        setUserStats(res.data.userStats);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (!isAdmin) return null;

  if (loading) return <div className="p-6 text-lg">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Completed Deals</h2>
          <p>{dealStats.completed}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Pending Deals</h2>
          <p>{dealStats.pending}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h2 className="font-semibold text-lg">Cancelled Deals</h2>
          <p>{dealStats.cancelled}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-2">Deal Distribution</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <h2 className="text-xl font-bold mb-2">User Engagement</h2>
      <table className="w-full table-auto border mb-6">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Total Deals</th>
          </tr>
        </thead>
        <tbody>
          {userStats.map((user, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.totalDeals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
