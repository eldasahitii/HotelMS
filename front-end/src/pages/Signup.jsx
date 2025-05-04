import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import email_icon from '../Assets/emaill.png';
import password_icon from '../Assets/password.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

const Signup = () => {
    const [userRegistration, setUserRegistration] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        RoleID: 4
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({
        FirstName: false,
        LastName: false,
        Email: false,
        Password: false
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserRegistration({
            ...userRegistration,
            [name]: value,
        });

        setFormErrors({
            ...formErrors,
            [name]: false
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {
            FirstName: userRegistration.FirstName.trim() === '',
            LastName: userRegistration.LastName.trim() === '',
            Email: userRegistration.Email.trim() === '',
            Password: userRegistration.Password.trim() === ''
        };

        setFormErrors(errors);

        if (Object.values(errors).some((value) => value)) {
            return;
        }
        try {
            const response = await axios.post('https://localhost:7117/api/Auth/register', {
                FirstName: userRegistration.FirstName,
                LastName: userRegistration.LastName,
                Email: userRegistration.Email,
                Password: userRegistration.Password,
                RoleID: userRegistration.RoleID
            });
            const { token, isLoggedIn } = response.data;
            if (token && isLoggedIn) {
                localStorage.setItem('token', token);
            }
        
            console.log('Registration successful:', response.data);
            navigate('/login'); 
        } catch (error) {
            const message = error.response?.data?.message || error.response?.data || error.message;
            console.error("Registration error:", message);
        
            if (message.includes("already exists")) {
                setError("An account with this email already exists.");
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };
    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="container d-flex flex-column align-items-center mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: '500px' }}>
            <h2 className="fw-bold mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit} className="w-100">
                <div className="mb-3">
                    <input
                        type="text"
                        name="FirstName"
                        className={`form-control ${formErrors.FirstName ? 'is-invalid' : ''}`}
                        placeholder="First Name"
                        value={userRegistration.FirstName}
                        onChange={handleInputChange}
                    />
                    {formErrors.FirstName && <div className="invalid-feedback">First name is required.</div>}
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        name="LastName"
                        className={`form-control ${formErrors.LastName ? 'is-invalid' : ''}`}
                        placeholder="Last Name"
                        value={userRegistration.LastName}
                        onChange={handleInputChange}
                    />
                    {formErrors.LastName && <div className="invalid-feedback">Last name is required.</div>}
                </div>
                <div className="mb-3">
                    <img src={email_icon} alt="email" width="30" className="me-3" />
                    <input
                        type="email"
                        name="Email"
                        className={`form-control ${formErrors.Email ? 'is-invalid' : ''}`}
                        placeholder="Email"
                        value={userRegistration.Email}
                        onChange={handleInputChange}
                    />
                    
                    {formErrors.Email && <div className="invalid-feedback">Email is required.</div>}
                </div>

                
                <div className="mb-3">
                    <img src={password_icon} alt="password" width="30" className="me-3" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="Password"
                        className={`form-control ${formErrors.Password ? 'is-invalid' : ''}`}
                        placeholder="Password"
                        value={userRegistration.Password}
                        onChange={handleInputChange}
                    />
                    {formErrors.Password && <div className="invalid-feedback">Password is required.</div>}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn btn-link p-0 mt-2"
                    >
                        {showPassword ? 'Hide Password' : 'Show Password'}
                    </button>
                </div>
                {error && <div className="text-danger mb-3">{error}</div>}
                <button type="submit" className="btn btn-dark w-100">Sign Up</button>
            </form>

            <button
                onClick={goToLogin}
                className="btn btn-link mt-3"
                style={{ color: '#007bff', textDecoration: 'none' }}
            >
                Already have an account? Log in
            </button>
        </div>
    );
};

export default Signup;
