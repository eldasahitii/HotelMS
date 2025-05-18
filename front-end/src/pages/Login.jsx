import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import email_icon from '../Assets/emaill.png';
import password_icon from '../Assets/password.png';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://localhost:7117/api/Auth/login', {
        email,
        password,
      });

      const { token, isLoggedIn } = response.data;

      if (token && isLoggedIn) {
        const decoded = jwtDecode(token);

        localStorage.setItem('token', token);
        localStorage.setItem('email', decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]);
        localStorage.setItem('role', decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
        localStorage.setItem('userID', decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

        console.log('Login successful:', decoded);

        switch (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
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
            setError("Unknown role. Access denied.");
            break;
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('Login error:', message);
      setError("Login failed. Please check your credentials or try again.");
    }
  };

  return (
    <div style={{ backgroundColor: '#fff7e6', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold" href="#">Hotel Name</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><Link className="nav-link" to="/reviews">Reviews</Link></li>
              <li className="nav-item"><Link className="nav-link active" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/signup">Sign Up</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ paddingTop: '120px', maxWidth: '500px' }}>
        <div className="w-100 p-4 bg-white rounded shadow">
          <h2 className="fw-bold mb-4 text-center">Log In</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3 d-flex align-items-center">
              <img src={email_icon} alt="email" width="30" className="me-3" />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <img src={password_icon} alt="password" width="30" className="me-3" />
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
      </div>
    </div>
  );
};

export default Login;

