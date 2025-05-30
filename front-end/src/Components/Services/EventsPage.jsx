import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ConferenceRoom from '../../Assets/images/conference.png';
import WeddingVenue from '../../Assets/images/2.png';
import heroImage from '../../Assets/images/mainevents.jpg';

const timeSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];
const takenSlots = ['12:00 PM', '4:00 PM'];

const framedImageStyle = {
  border: '10px solid #ffffff', // changed to white
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  padding: '4px',
  backgroundColor: '#ffffff',
  borderRadius: '4px'
};

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
      img: ConferenceRoom,
      title: 'Modern Conference Room',
      text: 'Host your next meeting or seminar in our fully equipped conference room, featuring high-speed internet, audio-visual equipment, and comfortable seating. Designed for productivity and professionalism, the space is ideal for business gatherings, workshops, or corporate presentations. Catering and technical support services are also available to ensure a seamless experience for you and your attendees.',
      price: '€200 per session'
    },
    {
      img: WeddingVenue,
      title: 'Elegant Wedding Venue',
      text: 'Celebrate your special day in our romantic wedding venue, where timeless charm meets modern elegance. Surrounded by beautiful architecture and customizable decor options, the venue provides the perfect setting for ceremonies and receptions. From intimate gatherings to grand celebrations, our team is here to help bring your dream wedding to life.',
      price: '€1,500 per day'
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
            Events
          </h1>
          <p className="lead">Discover perfect venues for every occasion.</p>
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
              <p className="mt-2">
                <span className="fw-bold text-dark">Price:</span>{' '}
                <span className="fw-bold text-primary">{section.price}</span>
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