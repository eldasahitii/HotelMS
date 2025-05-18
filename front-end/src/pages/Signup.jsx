import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import signupImage from '../Assets/images/signup.jpg';

const SignupPage = () => {
  const [user, setUser] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Password: '',
    RoleType: 'Customer'
  });

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^\S+@\S+\.\S+$/;
    const errors = {
      FirstName: !user.FirstName.trim(),
      LastName: !user.LastName.trim(),
      Email: !user.Email.trim() || !emailRegex.test(user.Email),
      Password: !user.Password.trim()
    };
    setFormErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    try {
      const response = await axios.post('/api/Auth/register', user);
      const { token, isLoggedIn } = response.data;
      if (token && isLoggedIn) {
        localStorage.setItem('token', `Bearer ${token}`);
        navigate('/login');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message.includes("already exists")
        ? "An account with this email already exists."
        : "Registration failed: " + message);
    }
  };

  return (
    <div className="container-fluid vh-100 p-0" style={{ fontFamily: "'Playfair Display', serif" }}>
      <div className="row h-100 g-0">
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
          <form className="p-5 rounded shadow w-75 border border-dark bg-white" onSubmit={handleSubmit}>
            <h2 className="mb-4 text-center fw-bold">Hotel ROLVE</h2>

            {['FirstName', 'LastName', 'Email'].map(field => (
              <div className="mb-3" key={field}>
                <label className="form-label">
                  {field === 'FirstName' ? 'Name' : field === 'LastName' ? 'Surname' : 'Email'}
                </label>
                <input
                  type={field === 'Email' ? 'email' : 'text'}
                  className={`form-control border-0 border-bottom rounded-0 shadow-none ${formErrors[field] ? 'is-invalid border-danger' : ''}`}
                  name={field}
                  value={user[field]}
                  onChange={handleChange}
                />
                {formErrors[field] && <div className="invalid-feedback">{`${field} is required.`}</div>}
              </div>
            ))}

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="Phone"
                className="form-control border-0 border-bottom rounded-0 shadow-none"
                value={user.Phone}
                onChange={handleChange}
                placeholder="e.g. +123 45 678 910"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group align-items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control border-0 border-bottom rounded-0 shadow-none ${formErrors.Password ? 'is-invalid border-danger' : ''}`}
                  name="Password"
                  value={user.Password}
                  onChange={handleChange}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer', paddingLeft: '10px', fontSize: '1.2rem', color: '#6c757d' }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </span>
              </div>
              {formErrors.Password && <div className="invalid-feedback d-block">Password is required.</div>}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-dark w-100">Sign Up</button>

            <div className="text-center mt-3">
              <span style={{ fontSize: '0.95rem' }}>Already have an account?</span>{' '}
              <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#2a52be' }}>
                Log In
              </Link>
            </div>
          </form>
        </div>

        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <div
            style={{
              backgroundImage: `url(${signupImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '20px',
              width: '75%',
              height: '95%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          />
          <div
            className="position-absolute text-center"
            style={{
              bottom: '30px',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '0.95rem'
            }}
          >
            <h3 className="fw-bold mb-2" style={{ color: 'white' }}>S i g n U p</h3>
            <span>Already have an account? </span>
            <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#2a52be' }}>
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
