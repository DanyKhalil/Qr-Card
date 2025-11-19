import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "../Style/AdminUsers.css"; // Make sure your CSS includes the login-input, dropdown-input, login-button classes

const AddUserPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/users3", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User created successfully!");
      setForm({ name: "", email: "", password: "", role: "user" });
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create user");
    }
  };

  return (
    <div className="admin-users-page login-body">
      <Header />

      {/* Added marginTop and marginBottom for spacing */}
      <div className="admin-users-container" style={{ marginTop: "100px", marginBottom: "40px" }}>
        <h1 className="login-title" style={{ backgroundColor: "transparent", border: "none" }}>
          Add New User
        </h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="login-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="login-input"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="dropdown-input"
          >
            <option value="user">User</option>
            <option value="company">Company</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="login-button">
            Create User
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default AddUserPage;
