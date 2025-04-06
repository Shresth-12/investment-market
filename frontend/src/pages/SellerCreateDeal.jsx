import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SellerCreateDeal = () => {
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const navigate = useNavigate();
const token=localStorage.getItem('token')
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:3000/api/v1/deal/deal", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/seller");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold">Create Deal</h2>
        <input name="title" onChange={handleChange} placeholder="Title" required className="input" />
        <textarea name="description" onChange={handleChange} placeholder="Description" required className="input" />
        <input name="price" type="number" onChange={handleChange} placeholder="Price" required className="input" />
        <button className="btn">Create</button>
      </form>
    </div>
  );
};

export default SellerCreateDeal;
