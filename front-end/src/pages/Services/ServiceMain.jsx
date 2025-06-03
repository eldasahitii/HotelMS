import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import poolSpaImage from '../../Assets/images/pool1.jpg';
// import EventsImage from '../../Assets/images/mainevents.jpg';
import heroImage from '../../Assets/images/pool6.jpg';
import axios from "axios";

const ServiceMain = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const framedImageStyle = {
    border: '8px solid white',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    padding: '4px',
    backgroundColor: '#f8f8f8',
    borderRadius: '4px'
  };

  useEffect(() => {
    fetchHeroImage();
    fetchHeroTitle();
    fetchHeroDescription();
  }, [])

  async function fetchHeroImage() {
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelService/1/hero-image",
        {
          withCredentials: true,
        }
      );
      setImageUrl(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Failed to get hero image!");
    }
  }

  async function fetchHeroTitle() {
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelService/1/hero-title",
        {
          withCredentials: true,
        }
      );
      setTitle(res.data);
    } catch (err) {
      console.error("Failed to get hero title!");
    }
  }

  async function fetchHeroDescription() {
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelService/1/hero-description",
        {
          withCredentials: true,
        }
      );
      setDescription(res.data);
    } catch (err) {
      console.error("Failed to get hero description!");
    }
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url('https://localhost:7117/Images/Services/${imageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '2rem' }}>
          <h1 className="display-4 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h1>
          <p className="lead">
            {description}
          </p>
        </div>
      </div>

      {/* Pool & Spa Section */}
      {/* <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <div style={framedImageStyle}>
              <img src={poolSpaImage} className="img-fluid" alt="Pool and Spa" />
            </div>
          </div>
          <div className="col-md-6">
            <h2 style={{ color: '#333' }}>Pool & Spa</h2>
            <p className="text-muted">
              Relax and unwind in our luxurious pool and spa facilities. 
              Take a dip in our heated indoor and outdoor pools, or melt away stress in the hot tub, 
              sauna, or steam room. Indulge in a soothing massage or a refreshing facial from our skilled therapists. 
              Whether you're looking for quiet time or a bit of pampering, this is your perfect escape.
            </p>
            <button
              className="btn btn-dark"
              onClick={() => navigate('/services/pool-spa')}
            >
              See More
            </button>
          </div>
        </div>
      </div> */}

      {/* Events Section */}
      {/* <div className="container py-5">
        <div className="row align-items-center flex-md-row-reverse">
          <div className="col-md-6 mb-4 mb-md-0">
            <div style={framedImageStyle}>
              <img src={EventsImage} className="img-fluid" alt="Events" />
            </div>
          </div>
          <div className="col-md-6">
            <h2 style={{ color: '#333' }}>Events</h2>
            <p className="text-muted">
              Host your special moments in our elegant venues, perfect for weddings, conferences, and celebrations.
               Our experienced team will help you plan every detail to ensure a seamless and memorable event. 
               Whether it’s an intimate gathering or a large celebration, we provide the ideal setting and personalized 
               service to make your occasion truly special.
            </p>
            <button
              className="btn btn-dark"
              onClick={() => navigate('/services/event-page')}
            >
              See More
            </button>
          </div>
        </div>
      </div> */}

      {/* Footer */}
      <footer className="text-center py-4 bg-light text-muted">
        <p className="mb-1">
          Looking for more? Visit our front desk or contact the concierge for exclusive offerings.
        </p>
        <small>© 2025 Hotel Management System</small>
      </footer>
    </div>
  );
};

export default ServiceMain;