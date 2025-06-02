
import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import InsidePool from '../../Assets/images/indoorpool3.png';
import OutsidePool from '../../Assets/images/pool2.jpg';
import Spa from '../../Assets/images/spa.jpg';
import Sauna from '../../Assets/images/4.png';
import heroImage from '../../Assets/images/pool6.jpg';

const timeSlots = [
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 1:00 PM',
  '1:00 PM - 2:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
  '5:00 PM - 6:00 PM',
  '6:00 PM - 7:00 PM'
];

const parseTimeSlot = (slot) => {
  const [start, end] = slot.split(' - ');
  const to24Hour = (time) => {
    const [rawTime, meridian] = time.split(' ');
    let [hours, minutes] = rawTime.split(':').map(Number);
    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };
  return {
    startTime: to24Hour(start),
    endTime: to24Hour(end)
  };
};

const PoolSpa = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [takenSlots, setTakenSlots] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [confirmation, setConfirmation] = useState('');
  const formRefs = useRef([]);

  const sections = [
    {
      id: 1,
      img: InsidePool,
      title: 'Heated Indoor Pool',
      text: 'Relax in our temperature-controlled indoor pool...',
      price: '€25 per person'
    },
    {
      id: 2,
      img: OutsidePool,
      title: 'Scenic Outdoor Pool',
      text: 'Escape to our breathtaking outdoor pool area...',
      price: '€35 per person'
    },
    {
      id: 3,
      img: Spa,
      title: 'Massage & Relaxation Room',
      text: 'Step into our peaceful massage and relaxation room...',
      price: '€50 per session'
    },
    {
      id: 4,
      img: Sauna,
      title: 'Sauna Room',
      text: 'Experience the soothing warmth of our dedicated sauna room...',
      price: '€30 per session'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (takenSlots.includes(selectedSlot)) {
      setConfirmation('Selected time is unavailable.');
      return;
    }

    const { startTime, endTime } = parseTimeSlot(selectedSlot);

    const reservationPayload = {
      reservationID: 0,
      serviceId: sections[activeForm].id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      reservationDate: selectedDate,
      startTime,
      endTime,
      reservationStatusID: 0,
      reservationStatusName: "Pending",
      createdAt: new Date().toISOString()
    };

    console.log('Sending reservationPayload:', reservationPayload);

    try {
      const response = await fetch('/api/HotelServiceReservation/MakeReservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(reservationPayload)
      });

      const text = await response.text();

      if (!response.ok) {
        let errorMsg = text;
        try {
          const errorData = JSON.parse(text);
          errorMsg = errorData.message || JSON.stringify(errorData);
        } catch { }
        setConfirmation(`Error: ${errorMsg}`);
        return;
      }

      setConfirmation('Reservation made successfully.');
      setTimeout(() => setActiveForm(null), 1500);

    } catch (error) {
      setConfirmation(`Error: ${error.message}`);
    }
  };

  const fetchTakenSlots = async (date) => {
    try {
      const response = await fetch(`/api/HotelServiceReservation/TakenSlots?date=${date}`);
      const data = await response.json();
      setTakenSlots(data);
    } catch (error) {
      console.error('Error fetching taken slots:', error);
      setTakenSlots([]);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchTakenSlots(selectedDate);
    }
  }, [selectedDate]);

  const openForm = (index) => {
    setActiveForm(index);
    setConfirmation('');
    setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    setSelectedSlot('');
    setSelectedDate('');
    setTakenSlots([]);
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
                        <option key={idx} value={slot} disabled={takenSlots.includes(slot)}>
                          {slot} {takenSlots.includes(slot) ? ' (Unavailable)' : ''}
                        </option>
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