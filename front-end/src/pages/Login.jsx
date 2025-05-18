import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  setError('');  // Reset error state

  try {
    // Sending login request
    const response = await axios.post('https://localhost:7117/api/Auth/login', {
      email,
      password,
    });

    const { token, isLoggedIn } = response.data;

    if (token && isLoggedIn) {
      const decoded = jwtDecode(token);  // No need to strip "Bearer "

      // Storing data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('email', decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]);
      localStorage.setItem('role', decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      localStorage.setItem('userID', decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);

      console.log('Login successful:', decoded);

      // Redirecting based on user role
      switch (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
        case 'Admin':
          navigate('/admin-dashboard');
        } else if (userRole === 'CleaningManager') {
          navigate('/manager/cleaning-staff');
        } else if (userRole === 'CleaningStaff') {
          navigate('/cleaningstaff/dashboard');
          break;
        default:
          setError("Unknown role. Access denied.");
          break;
      }
    }
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    console.error('Login error:', error.response?.data || error);
    setError("Login failed. Please check your credentials or try again.");
  }
};


  return (
    <div className="container d-flex flex-column align-items-center mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: '500px' }}>
      <h2 className="fw-bold mb-4">Log In</h2>
      <form onSubmit={handleLogin} className="w-100">
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
  );
};

export default Login;
