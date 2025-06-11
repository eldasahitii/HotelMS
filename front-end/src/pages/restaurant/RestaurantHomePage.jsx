import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../Components/Header';
import './RestaurantHomePage.css';
import axios from 'axios';
import {useState} from 'react';
import { Link } from 'react-router-dom';



const RestaurantHomePage = () => {

  const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  dateTime: ''
});

const [settings, setSettings] = useState(null);

const [menuItems, setMenuItems] = useState([]);

const [message, setMessage] = useState('');

const fetchSettings = async () => {
  try {
    const res = await axios.get('/api/RestaurantSettings/get', {
      withCredentials: true
    });
    setSettings(res.data);
  } catch (err) {
    console.error("Error loading settings: ", err);
  }
};

const fetchMenuItems = async () => {
  try {
    const res = await axios.get('/api/MenuItem/getAllMenuItems', {
      withCredentials: true
    });
    setMenuItems(res.data);
  } catch (err) {
    console.error("Failed to load menu items: ", err);
  }
};

useEffect(() => {
  fetchSettings();
  fetchMenuItems();
}, []);

const handleChange = (e) => {
  setFormData({...formData, [e.target.name]: e.target.value});
};

const handleSubmit = async(e) => {
  e.preventDefault();
  try {
    await axios.post('/api/PublicRestaurantRes/make', formData, {
      withCredentials: true
    });
    setMessage('Reservation submitted successfully!');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateTime: ''
    });
  } catch (error) {
    const errorData = error.response?.data;

if (typeof errorData === 'string') {
  setMessage(errorData);
} else if (errorData?.error || errorData?.details) {
  setMessage(`${errorData.error ?? 'Error'}: ${errorData.details ?? ''}`);
} else {
  setMessage('Error creating reservation');
}

  }

  if(!settings) return <div>Loading...</div>
};
  return (
   <div style={{ fontFamily: "'Crimson Text', serif" }}>
     <section className="container-fluid p-0 position-relative">
       
        <div

         className="position-absolute top-0 start-0 w-100 h-100"
         style={{
          backgroundImage: `url(${settings?.welcomeImageUrl})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           filter: 'blur(4px) brightness(0.6)',
           zIndex: 1,
          }}
        />

  
        <div
          className="d-flex justify-content-center align-items-center text-center text-white"
          style={{
            height: '100vh',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div className="container px-3">

            <h1 className="display-4 fw-bold">{settings?.welcomeTitle}</h1>
            <p className="lead mx-auto">{settings?.welcomeMessage}</p>
          </div>
        </div>
      </section>

    <section className="about-section py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
              src={settings?.aboutImageUrl1}
              alt="Terrace"
              className="img-fluid rounded shadow w-50"
              />
              <img
              src={settings?.aboutImageUrl2}
              alt="Interior"
              className="img-fluid rounded shadow w-50"
              />
            </div>
            <div className="col-md-6 text-center text-md-start">

              <h2 className="mb-4">{settings?.aboutTitle}</h2>
              <p className="lead">{settings?.aboutMessage}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
  <div className="container text-center">
    <h2 className="mb-4 fw-bold">Chef's Selections</h2>
    <p className="mb-5 lead">A taste of our favorites, hand-picked by our head chef.</p>

    <div className="row justify-content-center g-4 menu-card">
      {menuItems
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((item) => (
        <div className="col-sm-6 col-md-4 col-lg-3" key={item.menuItemID}>
          <div className="card shadow-sm">
            <img src={item.image_url} className="card-img-top" alt={item.name} style={{ height: '200px', objectFit: 'cover' }} />
            <div className="card-body">
              <h5 className="card-title fw-bold">{item.name}</h5>
              <p className="card-text small">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-5">
      <Link to="/restaurant/menu" className="btn btn-dark btn-1g">View Full Menu</Link>
    </div>
  </div>
</section>



      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Book a Table</h2>

          <form className="row g-3 fade-in" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                type="tel"
                className="form-control"
                id="phoneNumber"
                placeholder="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <input
                type="datetime-local"
                className="form-control"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-dark px-5 py-2 rounded-pill shadow-sm">
                <i className="bi bi-calendar-check me-2"></i>
                Submit Reservation
              </button>
            </div>
          </form>

          {message && (
            <div className="alert alert-info mt-3 text-center">{message}</div>
          )}
        </div>
      </section>


   </div>
  );
};

export default RestaurantHomePage;
