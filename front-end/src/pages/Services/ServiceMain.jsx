import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import poolSpaImage from '../../Assets/images/pool1.jpg';
// import EventsImage from '../../Assets/images/mainevents.jpg';
import heroImage from '../../Assets/images/pool6.jpg';
import axios from "axios";
import { CardTitle } from 'react-bootstrap';

const ServiceMain = () => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cardImageUrl, setCardImageUrl] = useState('');
  const [CardTitle, setCardTitle] = useState('');
  const [CardDescription, setCardDescription] = useState('');
  const [eventCardImage, setEventCardImage] = useState('');
  const [eventCardTitle, setEventCardTitle] = useState('');
  const [eventCardDescription, setEventCardDescription] = useState('');


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
    fetchCardImage();
    fetchCardTitle();
    fetchCardDescription();
    fetchEventCardImage();
    fetchEventCardTitle();
    fetchEventCardDescription();
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

  async function fetchCardImage() {
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelServiceCards/1/card-image",
        {
          withCredentials: true,
        }
      );
      setCardImageUrl(res.data); // Use new state
      console.log("Card image:", res.data);
    } catch (err) {
      console.error("Failed to get card image!");
    }
  }

  async function fetchCardTitle() {
    try {
      const res = await axios.get("https://localhost:7117/api/HotelServiceCards/1/card-title", {
        withCredentials: true,
      });
      setCardTitle(res.data);
    } catch (err) {
      console.error("Failed to get card title!", err);
    }
  }

  async function fetchCardDescription() {
    try {
      const res = await axios.get("https://localhost:7117/api/HotelServiceCards/1/card-description", {
        withCredentials: true,
      });
      setCardDescription(res.data);
    } catch (err) {
      console.error("Failed to get card description!", err);
    }
  }

  async function fetchEventCardImage() {
  try {
    const res = await axios.get("https://localhost:7117/api/HotelServiceCards/2/card-image", {
      withCredentials: true,
    });
    setEventCardImage(res.data);
  } catch (err) {
    console.error("Failed to get event card image!", err);
  }
}

async function fetchEventCardTitle() {
  try {
    const res = await axios.get("https://localhost:7117/api/HotelServiceCards/2/card-title", {
      withCredentials: true,
    });
    setEventCardTitle(res.data);
  } catch (err) {
    console.error("Failed to get event card title!", err);
  }
}

async function fetchEventCardDescription() {
  try {
    const res = await axios.get("https://localhost:7117/api/HotelServiceCards/2/card-description", {
      withCredentials: true,
    });
    setEventCardDescription(res.data);
  } catch (err) {
    console.error("Failed to get event card description!", err);
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
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <div style={framedImageStyle}>
              <img src={`https://localhost:7117/Images/Services/${cardImageUrl}`} className="img-fluid" alt="Pool and Spa" />
            </div>
          </div>
          <div className="col-md-6">
            <h2 style={{ color: '#333' }}>{CardTitle}</h2>
            <p className="text-muted">
              {CardDescription}
            </p>
            <button
              className="btn btn-dark"
              onClick={() => navigate('/services/pool-spa')}
            >
              See More
            </button>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="container py-5">
        <div className="row align-items-center flex-md-row-reverse">
          <div className="col-md-6 mb-4 mb-md-0">
            <div style={framedImageStyle}>
              <img src={`https://localhost:7117/Images/Services/${eventCardImage}`} className="img-fluid" alt="Events" />
            </div>
          </div>
          <div className="col-md-6">
            <h2 style={{ color: '#333' }}>{eventCardTitle}</h2>
            <p className="text-muted">
              {eventCardDescription}
            </p>
            <button
              className="btn btn-dark"
              onClick={() => navigate('/services/event-page')}
            >
              See More
            </button>
          </div>
        </div>
      </div>

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