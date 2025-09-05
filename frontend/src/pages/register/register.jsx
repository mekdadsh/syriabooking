import axios from "axios";
import API_BASE_URL from "../../config";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./register.css";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    city: "",
    phone: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "REGISTER_START" });
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, credentials);
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data.details });
      navigate("/");
    } catch (err) {
      dispatch({ type: "REGISTER_FAILURE", payload: err.response.data });
    }
  };

  return (
    <div className="register-page">
      <Navbar />
      
      <div className="register-content">
        <div className="rContainer">
          <h2>Create your account</h2>
          <input
            type="text"
            placeholder="Username"
            id="username"
            onChange={handleChange}
            className="rInput"
            required
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            onChange={handleChange}
            className="rInput"
            required
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            onChange={handleChange}
            className="rInput"
            required
          />
          <input
            type="text"
            placeholder="Country"
            id="country"
            onChange={handleChange}
            className="rInput"
          />
          <input
            type="text"
            placeholder="City"
            id="city"
            onChange={handleChange}
            className="rInput"
          />
          <input
            type="text"
            placeholder="Phone"
            id="phone"
            onChange={handleChange}
            className="rInput"
          />
          <button
            disabled={loading}
            onClick={handleClick}
            className="rButton"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <div className="error-message">{error.message}</div>}
          <div className="login-link">
            Already have an account? <a href="/login">Login</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
