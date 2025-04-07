import React, { useState } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom"; // <-- updated import

const Register = () => {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", role: "buyer" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:3000/api/v1/user/signup", form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", form.role);
    navigate(form.role === "seller" ? "/seller" : "/buyer");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl p-8 rounded-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <UserPlus size={24} /> Register
        </h2>
        <input name="fullName" onChange={handleChange} placeholder="Full Name" required className="input" />
        <input name="email" onChange={handleChange} placeholder="Email" type="email" required className="input" />
        <input name="password" onChange={handleChange} placeholder="Password" type="password" required className="input" />
        <select name="role" onChange={handleChange} className="input">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button className="btn">Register</button>

        {/* Login link */}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
