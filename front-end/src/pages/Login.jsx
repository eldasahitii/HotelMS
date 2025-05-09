import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import email_icon from '../Assets/emaill.png'; 
import password_icon from '../Assets/password.png'; 
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try
        {
            const response = await axios.post('https://localhost:7117/api/Auth/login', {
                email,
                password,
            });
            const { token, isLoggedIn } = response.data;
      
            if (token && isLoggedIn) {
              const decoded = jwtDecode(token);
              console.log('Decoded token:', decoded);
              localStorage.setItem('token', token);
              localStorage.setItem('email', decoded.email);
              localStorage.setItem('role', decoded.role);
              localStorage.setItem('userID', decoded.nameid);

            }
            
            console.log('Login successful:', response.data);
        }
        catch (error)
        {
            console.error('Login error:', error.response ? error.response.data : error.message);
            
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
        <div className="col-md-6 col-lg-4 p-4 bg-white rounded shadow text-center">
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

            
            <div className="mb-4 d-flex align-items-center">
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

            <button type="submit" className="btn btn-dark w-100">Log In</button>
          </form>
        </div>
      </div>
    </div>
  </div>
//         < div className = "container d-flex flex-column align-items-center mt-5 p-4 bg-white rounded shadow" style ={ { maxWidth: '500px' } }>
//             < h2 className = "fw-bold mb-4" > Log In </ h2 >
//             < form onSubmit ={ handleLogin}
//     className = "w-100" >
//                 < div className = "mb-3 d-flex align-items-center" >
//                     < img src ={ email_icon}
//     alt = "email" width = "30" className = "me-3" />
//                     < input
//                         type = "email"
//                         className = "form-control"
//                         placeholder = "Email"
//                         value ={ email}
//     onChange ={ (e) => setEmail(e.target.value)}
//     required
// />

// </ div >

// < div className = "mb-3 d-flex align-items-center" >

// < img src ={ password_icon}
//     alt = "password" width = "30" className = "me-3" />

// < input
//                         type = "password"
//                         className = "form-control"
//                         placeholder = "Password"
//                         value ={ password}
//     onChange ={ (e) => setPassword(e.target.value)}
//     required
// />

// </ div >

// < div className = "text-end mb-4" >



// </ div >

// < button type = "submit" className = "btn btn-dark w-100" > Log In </ button >

// </ form >

// </ div >
    );
};

export default Login;
