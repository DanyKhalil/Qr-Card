import '../Style/Login.css';
import backround from "../assets/images/icons/Background2.png";
import { useState } from "react";
import axios from "axios";

const TitleLogin = () => (
  <div className="login-title-border">
    <h1 className="register-title">Login</h1>
    <h1 className="login-title">Sign up</h1>
  </div>
);

const Image = () => (
  <div className="ImagePosition2">
    <img src={backround} alt="Example" className="rounded-2xl shadow-md" />
  </div>
);

const RegistrationForm = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5050/api/auth/register", {
        name,
        email,
        password,
        role
      });

      localStorage.setItem("token", res.data.token);
      setMessage("Registration successful!");
    } catch (err) {
      console.error(err); 
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="login-body">
      <TitleLogin />

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="dropdown-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="" disabled>Select Role</option>
          <option value="client">Client</option>
          <option value="company">Company</option>
        </select>

        <button className="login-button" type="submit">
          Sign up
        </button>

        <Image />
      </form>

      <p className="text-center">{message}</p>
    </div>
  );
};

export default RegistrationForm;
