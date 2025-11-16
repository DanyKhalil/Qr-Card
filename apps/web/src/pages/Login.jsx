import '../Style/Login.css';
import backround from '../assets/images/icons/Backround.png';
import { useState } from "react";
import axios from "axios";

const TitleLogin = () => (
  <div className="login-title-border">
    <h1 className="login-title">Login</h1>
    <h1 className="register-title">Sign up</h1>
  </div>
);

const Image = () => (
  <div className='ImagePosition'>
    <img 
      src={backround}
      alt="Example"
      className="rounded-2xl shadow-md"
    />
  </div>
);

const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5050/api/auth/login", {
        email,
        password,
      });

      // save token + user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // redirect
       alert("user logged in");
       window.location.href = "/Filtering"; 
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className='login-body'>
      <TitleLogin />

      <form className='login-form' onSubmit={handleLogin}>
        
        {error && <p style={{ color:"red" }}>{error}</p>}

        <input 
          className='login-input'
          type='text'
          placeholder="Email or phone number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className='login-input'
          type='password'
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className='login-button' type='submit'>
          Login
        </button>

        <div>
          <Image />
        </div>
      </form>
    </div>
  );
};

export default Form;
