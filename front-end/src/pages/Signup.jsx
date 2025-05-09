import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
     <div style={{ backgroundColor: '#faf0d9', minHeight: '100vh' }}>
            {/* // <div className="container mt-5"> */}
 <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
  <div className="container-fluid px-4">
    <a className="navbar-brand fw-bold" href="#">
      {/* Add your logo here later */}
      Hotel Name
    </a>

    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul className="navbar-nav">
  <li className="nav-item">
    <Link className="nav-link" to="/reviews">Reviews</Link>
  </li>
  <li className="nav-item">
    <Link className="nav-link" to="/login">Login</Link>
  </li>
  <li className="nav-item">
    <Link className="nav-link" to="/signup">Sign Up</Link>
  </li>
</ul>


    </div>
  </div>
</nav>


                <div className="container" style={{ paddingTop: '80px' }}>
                <div
      className="row justify-content-center align-items-center"
      style={{ minHeight: 'calc(100vh - 80px)' }}
    >
               {/* <div className="row d-flex justify-content-center align-items-center"> */}
                  
                    <div className="col-md-5 mb-4 mb-md-0 text-center text-md-start" >
                        <h1 className="fw-semibold">Welcome to Your Getaway</h1><br />
                        {/* <p className="fw-normal">
                            Become a member and unlock exclusive deals, comfort, and personalized service.  
                            Luxury starts here.
                        </p><br /> */}
                        {/* <p>Why join?</p> */}
                        {/* <ul className="lsit-group list-group-flush">
                            <li className="list-group-item">Exclusive member discounts on rooms & suites</li>
                            <li className="list-group-item">Early check-in & late check-out privileges</li>
                            <li className="list-group-item">Access to member-only offers and events</li>
                            <li className="list-group-item">Seamless bookings and stay history tracking</li>
                        </ul><br/> */}
                        <h5 className="fw-normal">Create your free account and make every stay unforgettable</h5>
                        <h5 className="fw-semibold">Luxury is just a click away</h5>
                    </div>
        
                 
                    <div className="col-md-6 p-4 bg-white rounded shadow">
                        <h2 className="fw-bold mb-4 text-center">Sign Up</h2>
                        <form onSubmit={handleSubmit}>
                           
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
        
                       
                            <div className="mb-3 d-flex align-items-center">
                                <img src={email_icon} alt="email" width="30" className="me-2" />
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
                </div>
            </div>
            </div>
        );
        
        // <div className="container d-flex flex-column align-items-center mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: '500px' }}>
        //     <h2 className="fw-bold mb-4">Sign Up</h2>
        //     <form onSubmit={handleSubmit} className="w-100">
        //         <div className="mb-3">
        //             <input
        //                 type="text"
        //                 name="FirstName"
        //                 className={`form-control ${formErrors.FirstName ? 'is-invalid' : ''}`}
        //                 placeholder="First Name"
        //                 value={userRegistration.FirstName}
        //                 onChange={handleInputChange}
        //             />
        //             {formErrors.FirstName && <div className="invalid-feedback">First name is required.</div>}
        //         </div>
        //         <div className="mb-3">
        //             <input
        //                 type="text"
        //                 name="LastName"
        //                 className={`form-control ${formErrors.LastName ? 'is-invalid' : ''}`}
        //                 placeholder="Last Name"
        //                 value={userRegistration.LastName}
        //                 onChange={handleInputChange}
        //             />
        //             {formErrors.LastName && <div className="invalid-feedback">Last name is required.</div>}
        //         </div>
        //         <div className="mb-3">
        //             <img src={email_icon} alt="email" width="30" className="me-3" />
        //             <input
        //                 type="email"
        //                 name="Email"
        //                 className={`form-control ${formErrors.Email ? 'is-invalid' : ''}`}
        //                 placeholder="Email"
        //                 value={userRegistration.Email}
        //                 onChange={handleInputChange}
        //             />
                    
        //             {formErrors.Email && <div className="invalid-feedback">Email is required.</div>}
        //         </div>

                
        //         <div className="mb-3">
        //             <img src={password_icon} alt="password" width="30" className="me-3" />
        //             <input
        //                 type={showPassword ? "text" : "password"}
        //                 name="Password"
        //                 className={`form-control ${formErrors.Password ? 'is-invalid' : ''}`}
        //                 placeholder="Password"
        //                 value={userRegistration.Password}
        //                 onChange={handleInputChange}
        //             />
        //             {formErrors.Password && <div className="invalid-feedback">Password is required.</div>}
        //             <button
        //                 type="button"
        //                 onClick={() => setShowPassword(!showPassword)}
        //                 className="btn btn-link p-0 mt-2"
        //             >
        //                 {showPassword ? 'Hide Password' : 'Show Password'}
        //             </button>
        //         </div>
        //         {error && <div className="text-danger mb-3">{error}</div>}
        //         <button type="submit" className="btn btn-dark w-100">Sign Up</button>
        //     </form>

        //     <button
        //         onClick={goToLogin}
        //         className="btn btn-link mt-3"
        //         style={{ color: '#007bff', textDecoration: 'none' }}
        //     >
        //         Already have an account? Log in
        //     </button>
        // </div>
    // );
};

export default Signup;
