import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const loginRes = await axios.post(
        'https://localhost:7117/api/Auth/login',
        { email, password },
        { withCredentials: true }
      );

      if (loginRes.data.isLoggedIn) {
        // Fetch role securely after login
        const meRes = await axios.get('https://localhost:7117/api/Auth/me', {
          withCredentials: true,
        });

        const { role } = meRes.data;

        console.log(" Logged in as:", role);

        // Navigate based on role
        switch (role) {
          case 'Customer':
            navigate('/rooms');
            break;
          case 'Admin':
            navigate('/admin-dashboard');
            break;
          case 'RoomManager':
            navigate('/manager/room-dashboard');
            break;
          case 'RoomRecepsionist':
            navigate('/recepsionist-dashboard');
            break;
          case 'CleaningManager':
            navigate('/manager/cleaning-staff');
            break;
          case 'CleaningStaff':
            navigate('/cleaningstaff/dashboard');
            break;
          case 'RestaurantManager':
            navigate('/restaurant-manager/dashboard');
            break;
          case 'RestaurantHost':
            navigate('/host/dashboard');
            break;
          default:
            console.log("Unknown role:", role);
            setError("Unknown role. Access denied.");
            break;
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      console.error('Login error:', message);
      setError("Login failed. Please check your credentials or try again.");
    }
  };

  return (
    <div
      className="container d-flex flex-column align-items-center mt-5 p-4 bg-white rounded shadow"
      style={{ maxWidth: '500px' }}
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

        <button type="submit" className="btn btn-dark w-100">Log In</button>
      </form>
    </div>
  );
};

export default Login;
