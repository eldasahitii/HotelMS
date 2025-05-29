import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  return (
    <header className="headerContainer navbar navbar-expand-lg navbar-light bg-light p-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        <div className="logo">
          {/* <img src="imgs/logo1.png" alt="Logo" className="img-fluid" /> */}
        </div>
        <ul className="nav ms-auto">
          <li className="nav-item">
            <a href="index.php" className="nav-link custom-nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="AboutUs.php" className="nav-link custom-nav-link">Rooms</a>
          </li>
          <li className="nav-item">
            <a href="/restaurant" className="nav-link custom-nav-link">Restaurant</a>
          </li>
          <li className="nav-item">
            <a href="poolAndSpa.php" className="nav-link custom-nav-link">Pool & Spa</a>
          </li>
          <li className="nav-item">
            <a href="BookNow.php" className="nav-link custom-nav-link" target="_blank">Book Now</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
