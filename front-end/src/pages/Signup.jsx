import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../Context/AuthContext';

const SignupPage = () => {
  const [user, setUser] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Password: '',
    RoleType: 'Customer'
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { fetchUser } = useAuth(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\+?\d{7,15}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const errors = {
      FirstName: !user.FirstName.trim(),
      LastName: !user.LastName.trim(),
      Email: !user.Email.trim() || !emailRegex.test(user.Email),
      Phone: user.Phone && !phoneRegex.test(user.Phone),
      Password: !user.Password || !passwordRegex.test(user.Password),
      ConfirmPassword: user.Password !== confirmPassword
    };

    setFormErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    try {
      const response = await axios.post('/api/Auth/register', user, { withCredentials: true });

      if (response.data.isLoggedIn) {
        await fetchUser(); 

        const meRes = await axios.get('/api/Auth/me', { withCredentials: true });
        const { role } = meRes.data;

        switch (role) {
          case 'Customer': navigate('/homepage'); break;
          case 'Admin': navigate('/admin/room-types'); break;
          case 'RoomManager': navigate('/manager/room-dashboard'); break;
          case 'RoomRecepsionist': navigate('/recepsionist-dashboard'); break;
          case 'CleaningManager': navigate('/manager/cleaning-staff'); break;
          case 'CleaningStaff': navigate('/cleaningstaff/dashboard'); break;
          case 'RestaurantManager': navigate('/restaurant-manager/dashboard'); break;
          case 'RestaurantHost': navigate('/host/dashboard'); break;
          case 'ServiceManager': navigate ('/manager/service-manager'); break;
          case 'ServiceRecepsionist': navigate ('/manager/service-recepcionist'); break;
          default:
            setError('Unknown role. Access denied.');
            break;
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message.includes("already exists")
        ? "An account with this email already exists."
        : "Registration failed: " + message);
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', fontFamily: "'Playfair Display', serif", backgroundColor: '#e6f3fb' }}>
      <div className="w-100 px-3" style={{ maxWidth: '720px' }}>
        <form className="bg-white p-4 p-md-5 shadow-lg rounded" onSubmit={handleSubmit}>
          <h3 className="fw-bold text-center mb-3">Hotel Amé</h3>
          <h2 className="fw-bold text-center mb-3">Join the Experience</h2>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="FirstName"
                className={`form-control ${formErrors.FirstName ? 'is-invalid border-danger' : ''}`}
                value={user.FirstName}
                onChange={handleChange}
              />
              {formErrors.FirstName && <div className="invalid-feedback d-block">First name is required.</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name <span className="text-danger">*</span></label>
              <input
                type="text"
                name="LastName"
                className={`form-control ${formErrors.LastName ? 'is-invalid border-danger' : ''}`}
                value={user.LastName}
                onChange={handleChange}
              />
              {formErrors.LastName && <div className="invalid-feedback d-block">Last name is required.</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email <span className="text-danger">*</span></label>
            <input
              type="email"
              name="Email"
              className={`form-control ${formErrors.Email ? 'is-invalid border-danger' : ''}`}
              value={user.Email}
              onChange={handleChange}
            />
            {formErrors.Email && <div className="invalid-feedback d-block">Enter a valid email address.</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="Phone"
              className={`form-control ${formErrors.Phone ? 'is-invalid border-danger' : ''}`}
              value={user.Phone}
              onChange={handleChange}
              placeholder="e.g. +1234567890"
            />
            {formErrors.Phone && <div className="invalid-feedback d-block">Enter a valid phone number.</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password <span className="text-danger">*</span></label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="Password"
                className={`form-control ${formErrors.Password ? 'is-invalid border-danger' : ''}`}
                value={user.Password}
                onChange={handleChange}
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
            {formErrors.Password && (
              <div className="invalid-feedback d-block">
                Password must be at least 8 characters, include uppercase, lowercase, number, and special character.
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password <span className="text-danger">*</span></label>
            <input
              type="password"
              className={`form-control ${formErrors.ConfirmPassword ? 'is-invalid border-danger' : ''}`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFormErrors(prev => ({ ...prev, ConfirmPassword: false }));
              }}
            />
            {formErrors.ConfirmPassword && (
              <div className="invalid-feedback d-block">Passwords do not match.</div>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <p className="text-center text-muted mb-4">
            Enjoy personalized experiences when you create your account and tell us more about yourself.
            Already have an account?{' '}
            <Link to="/login" className="text-decoration-none" style={{ color: '#2a52be' }}>Log In</Link>
          </p>

          <button type="submit" className="btn btn-dark w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
