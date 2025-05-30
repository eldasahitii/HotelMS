import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import InsidePool from '../../Assets/images/indoorpool3.png';
import OutsidePool from '../../Assets/images/pool2.jpg';
import Spa from '../../Assets/images/spa.jpg';
import Sauna from '../../Assets/images/4.png';
import heroImage from '../../Assets/images/pool6.jpg';

const timeSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];
const takenSlots = ['12:00 PM', '4:00 PM'];

const framedImageStyle = {
  border: '10px solid #ffffff',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  padding: '4px',
  backgroundColor: '#ffffff',
  borderRadius: '4px'
};

const PoolSpa = () => {
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

  const formRefs = useRef([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (takenSlots.includes(selectedSlot)) {
      setConfirmation('Selected time is unavailable.');
    } else {
      setConfirmation('Reservation made successfully.');
      setTimeout(() => {
        setActiveForm(null);
      }, 1500);
    }
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

  const sections = [
    {
      img: InsidePool,
      title: 'Heated Indoor Pool',
      text: 'Relax in our temperature-controlled indoor pool, perfect for year-round swims. Ideal for solo visitors or families looking for a calm, refreshing environment regardless of the season. Enjoy clean, modern facilities and a peaceful atmosphere designed for your comfort.',
      price: '€25 per person'
    },
    {
      img: OutsidePool,
      title: 'Scenic Outdoor Pool',
      text: 'Escape to our breathtaking outdoor pool area, where tranquility meets natural beauty. Surrounded by lush greenery and designed with relaxation in mind, our expansive pool offers the perfect setting to soak up the sun or enjoy a peaceful swim. Lounge on comfortable sunbeds, sip refreshing drinks from our poolside bar, and take in the serene views that create a true resort-style experience.',
      price: '€35 per person'
    },
    {
      img: Spa,
      title: 'Massage & Relaxation Room',
      text: 'Step into our peaceful massage and relaxation room, where expert therapists help release tension and restore balance. From full-body massages to targeted treatments, each session is tailored to your needs in a calm, private environment. Ideal for guests seeking deep relaxation or relief from stress and fatigue.',
      price: '€50 per session'
    },
    {
      img: Sauna,
      title: 'Sauna Room',
      text: 'Experience the soothing warmth of our dedicated sauna room, designed to relax muscles, improve circulation, and promote overall well-being. Enjoy the quiet, wood-lined space as heat gently eases tension and clears your mind. Perfect for unwinding after a swim or simply taking time for yourself in a peaceful setting.',
      price: '€30 per session'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${heroImage})`,
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
            Pool & Spa Experiences
          </h1>
          <p className="lead">Refresh, recharge, and relax with our premium water and wellness services.</p>
        </div>
      </div>

      {/* Sections */}
      <div className="container py-5">
        {sections.map((section, idx) => (
          <div className={`row align-items-center mb-5 ${idx % 2 !== 0 ? 'flex-md-row-reverse' : ''}`} key={idx}>
            <div className="col-md-6 mb-4 mb-md-0">
              <div style={framedImageStyle}>
                <img src={section.img} alt={section.title} className="img-fluid" />
              </div>
            </div>
            <div className="col-md-6" ref={el => formRefs.current[idx] = el}>
              <h3 style={{ color: '#333' }}>{section.title}</h3>
              <p className="text-muted">{section.text}</p>
              <p className="fw-semibold mt-2">Price: <span className="text-primary">{section.price}</span></p>
              <button className="btn btn-dark" onClick={() => openForm(idx)}>Reserve</button>

              {/* Reservation Form Inline */}
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

export default PoolSpa;