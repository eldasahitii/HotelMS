import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loginRes = await axios.post(
        "https://localhost:7117/api/Auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (loginRes.data.isLoggedIn) {
        const meRes = await axios.get("https://localhost:7117/api/Auth/me", {
          withCredentials: true,
        });

        const { role, userId, userName } = meRes.data;

        localStorage.setItem("userId", userId);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userRole", role);

        switch (role) {
          case "Customer":
            navigate("/rooms");
            break;
          case "Admin":
            navigate("/admin/room-types");
            break;
          case "RoomManager":
            navigate("/manager/room-dashboard");
            break;
          case "RoomRecepsionist":
            navigate("/recepsionist-dashboard");
            break;
          case "CleaningManager":
            navigate("/manager/cleaning-staff");
            break;
          case "CleaningStaff":
            navigate("/cleaningstaff/dashboard");
            break;
          case "RestaurantManager":
            navigate("/restaurant-manager/dashboard");
            break;
          case "RestaurantHost":
            navigate("/host/dashboard");
            break;
          default:
            setError("Unknown role. Access denied.");
            break;
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error("Login error:", message);
      setError("Login failed. Please check your credentials or try again.");
    }
  };

  return (
    <div
      className="container d-flex flex-column align-items-center mt-5 p-4 bg-white rounded shadow"
      style={{ maxWidth: "500px" }}
    >
      <h2 className="fw-bold mb-4">Log In</h2>
      <form onSubmit={handleLogin} className="w-100">
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="text-danger mb-3">{error}</div>}

        <button type="submit" className="btn btn-dark w-100">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
