import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const timeSlots = [
  '10:00 AM - 6:00 PM',
  '12:00 PM - 8:00 PM',
  'Whole Day (9:00 AM - 11:00 PM)'
];

const Events = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [confirmation, setConfirmation] = useState('');
  const [ImageUrl, setImageUrl] = useState('');
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [services, setServices] = useState([]);
  const formRefs = useRef([]);

  useEffect(() => {
    fetchHeroImage();
    fetchHeroTitle();
    fetchHeroDescription();
    fetchFeaturedServices();
  }, []);

  async function fetchHeroImage() {
    try {
      const res = await axios.get("https://localhost:7117/api/HotelService/3/hero-image", {
        withCredentials: true
      });
      setImageUrl(res.data);
    } catch (err) {
      console.error("Failed to get hero image!");
    }
  }

  async function fetchHeroTitle() {
    try {
      const res = await axios.get("https://localhost:7117/api/HotelService/3/hero-title", {
        withCredentials: true
      });
      setTitle(res.data);
    } catch (err) {
      console.error("Failed to get hero title!");
    }
  }

  async function fetchHeroDescription() {
    try {
      const res = await axios.get("https://localhost:7117/api/HotelService/3/hero-description", {
        withCredentials: true
      });
      setDescription(res.data);
    } catch (err) {
      console.error("Failed to get hero description!");
    }
  }

async function fetchFeaturedServices() {
  try {
    const idsToFetch = [5, 6];
    // Fetch service details by ID concurrently
    const requests = idsToFetch.map(id =>
      axios.get(`https://localhost:7117/api/HotelServiceDetail/GetServiceDetail/${id}`, {
        withCredentials: true
      })
    );

    const responses = await Promise.all(requests);
    const fetchedServices = responses.map(res => res.data);
    setServices(fetchedServices);
  } catch (err) {
    console.error("Failed to get featured services!", err);
  }
}



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedSlot) {
      setConfirmation('Please select a date and time slot.');
      return;
    }

    setConfirmation('Reservation made successfully.');
    setTimeout(() => setActiveForm(null), 1500);
  };

  const openForm = (index) => {
    setActiveForm(index);
    setConfirmation('');
    setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    setSelectedSlot('');
    setSelectedDate('');
    setTimeout(() => {
      formRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const framedImageStyle = {
    border: '10px solid #ffffff',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    padding: '4px',
    backgroundColor: '#ffffff',
    borderRadius: '4px'
  };

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section - unchanged as requested */}
      <div
        style={{
          backgroundImage: `url('https://localhost:7117/Images/Services/${ImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '2rem' }}>
          <h1 className="display-4 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {Title || "Loading..."}
          </h1>
          <p className="lead">{Description}</p>
        </div>
      </div>

      {/* Services Section (only IDs 5 & 6) */}
      <div className="container py-5">
        {services.map((section, idx) => (
          <div
            key={section.id}
            className={`row align-items-center mb-5 ${idx % 2 !== 0 ? 'flex-md-row-reverse' : ''}`}
          >
            <div className="col-md-6 mb-4 mb-md-0">
              <div style={framedImageStyle}>
                <img
                  src={`https://localhost:7117/Images/Services/${section.detailImage}`}
                  alt={section.detailTitle}
                  className="img-fluid"
                />
              </div>
            </div>
            <div className="col-md-6" ref={el => formRefs.current[idx] = el}>
              <h3 style={{ color: '#333' }}>{section.detailTitle}</h3>
              <p className="text-muted">{section.detailDescription}</p>
              <p className="fw-semibold mt-2">
                Price: <span className="text-primary">{section.price}</span>
              </p>
              <button className="btn btn-dark" onClick={() => openForm(idx)}>Reserve</button>

              {activeForm === idx && (
                <form onSubmit={handleSubmit} className="border mt-4 p-4 rounded bg-light">
                  <div className="row mb-3">
                    <div className="col">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Select Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Select Time</label>
                    <select
                      className="form-select"
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      required
                    >
                      <option value="">-- Select a time --</option>
                      {timeSlots.map((slot, idx) => (
                        <option key={idx} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                  <button className="btn btn-primary" type="submit">Submit Reservation</button>
                  {confirmation && (
                    <p className={`mt-3 fw-bold ${confirmation.includes('successfully') ? 'text-success' : 'text-danger'}`}>
                      {confirmation}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
