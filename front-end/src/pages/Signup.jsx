import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignupPage = () => {
  const [user, setUser] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
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
        {/* LEFT SIDE - FORM */}
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
          <form className="p-5 rounded shadow w-75 border border-dark bg-white" onSubmit={handleSubmit}>
            <h2 className="mb-4 text-center fw-bold">MONVELLI</h2>

            {/* INPUT FIELDS */}
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

            {/* PASSWORD FIELD */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control border-0 border-bottom rounded-0 shadow-none ${formErrors.Password ? 'is-invalid border-danger' : ''}`}
                  name="Password"
                  value={user.Password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {formErrors.Password && <div className="invalid-feedback d-block">Password is required.</div>}
            </div>

            {/* ERROR MESSAGE */}
            {error && <div className="alert alert-danger">{error}</div>}

            <button type="submit" className="btn btn-dark w-100">Sign Up</button>

            <div className="text-center mt-3">
              <span style={{ fontSize: '0.95rem' }}>Already have an account?</span>{' '}
              <a href="/login" className="text-decoration-none fw-semibold" style={{ color: '#2a52be' }}>
                Log In
              </a>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE - IMAGE */}
        <div
          className="col-md-6 d-none d-md-block"
          style={{
            backgroundImage: 'url("/your-image.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>
    </div>
  );
};

export default SignupPage;
