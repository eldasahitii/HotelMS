import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link from react-router-dom
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  return (
    <header className="headerContainer navbar navbar-expand-lg navbar-light bg-light p-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="logo">
          {/* Optional: <img src="/imgs/logo1.png" alt="Logo" className="img-fluid" /> */}
        </div>
        <ul className="nav ms-auto">
          <li className="nav-item">
            <Link to="/" className="nav-link custom-nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link custom-nav-link">About Us</Link>
          </li>
          <li className="nav-item">
            <Link to="/restaurant" className="nav-link custom-nav-link">Restaurant</Link>
          </li>
          <li className="nav-item">
            <Link to="/spa" className="nav-link custom-nav-link">Pool & Spa</Link>
          </li>
          <li className="nav-item">
            <Link to="/book" className="nav-link custom-nav-link">Book Now</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;

