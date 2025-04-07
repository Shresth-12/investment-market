import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import CreateDeal from "./pages/SellerCreateDeal";
import DealChat from "./pages/DealChat";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to={role === "seller" ? "/seller" : "/buyer"} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/create" element={<CreateDeal />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/deal/:id" element={<DealChat />} />
        <Route path="/admin" element={<AdminDashboard/>} />
      </Routes>
    </Router>
  );
};

export default App;