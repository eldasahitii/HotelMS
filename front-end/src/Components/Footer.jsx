import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="bg-light text-dark border-top mt-5 pt-4 pb-2">
      <div className="container text-center text-md-start">
        <div className="row">
          {/* Column 1: Logo & Description */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Hotel Amé</h5>
            <p className="text-muted small">
              Experience luxury and comfort in the heart of the city. Your perfect stay awaits.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-semibold mb-2">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-secondary">Home</Link></li>
              <li><Link to="/about" className="text-decoration-none text-secondary">About Us</Link></li>
              <li><Link to="/restaurant" className="text-decoration-none text-secondary">Restaurant</Link></li>
              <li><Link to="/services" className="text-decoration-none text-secondary">Pool & Spa</Link></li>
              <li><Link to="/book" className="text-decoration-none text-secondary">Book Now</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-semibold mb-2">Contact Us</h6>
            <p className="mb-1 text-muted small">
              📍 123 Luxury St, Dreamville
            </p>
            <p className="mb-1 text-muted small">
              📞 +1 (234) 567-890
            </p>
            <p className="mb-1 text-muted small">
              ✉️ contact@hotelame.com
            </p>
          </div>
        </div>

        <div className="text-center border-top pt-3 mt-3 small text-muted">
          &copy; {new Date().getFullYear()} Hotel Amé. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
