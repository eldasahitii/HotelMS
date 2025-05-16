import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import email_icon from '../Assets/emaill.png';
import password_icon from '../Assets/password.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const [userRegistration, setUserRegistration] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Password: '',
    RoleType: 'Customer'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserRegistration(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^\S+@\S+\.\S+$/;
    const errors = {
      FirstName: !userRegistration.FirstName.trim(),
      LastName: !userRegistration.LastName.trim(),
      Email: !userRegistration.Email.trim() || !emailRegex.test(userRegistration.Email),
      Password: !userRegistration.Password.trim()
    };
    setFormErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    try {
      const response = await axios.post('/api/Auth/register', userRegistration);
      console.log("RESPONSE:", response);

      const { token, isLoggedIn } = response.data;

      if (token && isLoggedIn) {
        console.log("Registration successful!");
        try {
          localStorage.setItem('token', `Bearer ${token}`);
          navigate('/login');
        } catch (navErr) {
          console.error("Navigation error:", navErr);
          setError("Signup successful but redirect failed. Please reload.");
        }
      }
    } catch (error) {
      console.log("Full Axios Error:", error);
      const message = error.response?.data?.message || error.message;
      console.error("Registration error:", message);
      if (message.includes("already exists")) {
        setError("An account with this email already exists.");
      } else {
        setError("Registration failed: " + message);
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#faf0d9', minHeight: '100vh' }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold" href="#">Hotel Name</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
              <li className="nav-item"><a className="nav-link active" href="/signup">Sign Up</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '80px' }}>
        <div className="row justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="col-md-5 text-center text-md-start">
            <h1 className="fw-semibold">Welcome to Your Getaway</h1><br />
            <h5 className="fw-normal">Create your free account and make every stay unforgettable</h5>
            <h5 className="fw-semibold">Luxury is just a click away</h5>
          </div>
          <div className="col-md-6 p-4 bg-white rounded shadow">
            <h2 className="fw-bold mb-4 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              {["FirstName", "LastName", "Email"].map(field => (
                <div className="mb-3" key={field}>
                  <input
                    type={field === "Email" ? "email" : "text"}
                    name={field}
                    className={`form-control ${formErrors[field] ? 'is-invalid' : ''}`}
                    placeholder={field.replace("Name", " Name")}
                    value={userRegistration[field]}
                    onChange={handleInputChange}
                  />
                  {formErrors[field] && (
                    <div className="invalid-feedback">
                      {field === "Email" ? "Valid email is required." : `${field.replace("Name", " name")} is required.`}
                    </div>
                  )}
                </div>
              ))}

              <div className="mb-3 d-flex align-items-start flex-column">
                <div className="d-flex w-100 align-items-center">
                  <img src={password_icon} alt="password" width="30" className="me-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="Password"
                    className={`form-control ${formErrors.Password ? 'is-invalid' : ''}`}
                    placeholder="Password"
                    value={userRegistration.Password}
                    onChange={handleInputChange}
                  />
                </div>
                {formErrors.Password && <div className="invalid-feedback d-block">Password is required.</div>}
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn btn-link p-0 mt-2">
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </button>
              </div>

              {error && <div className="text-danger mb-3">{error}</div>}
              <button type="submit" className="btn btn-dark w-100">Sign Up</button>
            </form>

            <button onClick={() => navigate('/login')} className="btn btn-link mt-3" style={{ color: '#007bff', textDecoration: 'none' }}>
              Already have an account? Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
