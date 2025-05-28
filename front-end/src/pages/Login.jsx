import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^\S+@\S+\.\S+$/;
    const errors = {
      email: !email.trim() || !emailRegex.test(email),
      password: !password.trim()
    };

    setFormErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    try {
      const loginRes = await axios.post(
        "https://localhost:7117/api/Auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (loginRes.data.isLoggedIn) {
        const meRes = await axios.get('https://localhost:7117/api/Auth/me', {
          withCredentials: true,
        });

        const { role } = meRes.data;

        switch (role) {
          case "Customer": navigate("/rooms"); break;
          case "Admin": navigate("/admin/room-types"); break;
          case "RoomManager": navigate("/manager/room-dashboard"); break;
          case "RoomRecepsionist": navigate("/recepsionist-dashboard"); break;
          case "CleaningManager": navigate("/manager/cleaning-staff"); break;
          case "CleaningStaff": navigate("/cleaningstaff/dashboard"); break;
          case "RestaurantManager": navigate("/restaurant-manager/dashboard"); break;
          case "RestaurantHost": navigate("/host/dashboard"); break;
          default:
            setError("Unknown role. Access denied.");
            break;
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error('Login error:', message);

      if (message.toLowerCase().includes("email")) {
        setFormErrors(prev => ({ ...prev, email: true }));
        setError("No account found with this email.");
      } else if (message.toLowerCase().includes("password")) {
        setFormErrors(prev => ({ ...prev, password: true }));
        setError("Incorrect password.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center py-5"
      style={{
        minHeight: '100vh',
        backgroundColor: '#e6f3fb',
        fontFamily: "'Playfair Display', serif"
      }}
    >
      <div className="w-100 px-3" style={{ maxWidth: '500px' }}>
        <form
          onSubmit={handleLogin}
          className="bg-white p-4 p-md-5 rounded shadow-lg"
        >
          <h3 className="fw-bold text-center mb-3">Hotel Amé</h3>
          <h2 className="fw-bold text-center mb-3">Welcome Back</h2>
          <p className="text-center text-muted mb-4">
            Log in to access your account and explore your next stay.
            Don’t have an account?{' '}
            <a href="/signup" className="text-decoration-none" style={{ color: '#2a52be' }}>Sign Up</a>
          </p>

          <div className="mb-3">
            <label className="form-label">Email <span className="text-danger">*</span></label>
            <input
              type="email"
              className={`form-control ${formErrors.email ? 'is-invalid border-danger' : ''}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormErrors(prev => ({ ...prev, email: false }));
              }}
            />
            {formErrors.email && <div className="invalid-feedback d-block">Enter a valid email.</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password <span className="text-danger">*</span></label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${formErrors.password ? 'is-invalid border-danger' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormErrors(prev => ({ ...prev, password: false }));
                }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {formErrors.password && <div className="invalid-feedback d-block">Password is required.</div>}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-dark w-100">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

