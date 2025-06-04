import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
// import InsidePool from '../../Assets/images/indoorpool3.png';
// import OutsidePool from '../../Assets/images/pool2.jpg';
// import Spa from '../../Assets/images/spa.jpg';
// import Sauna from '../../Assets/images/4.png';
// import heroImage from '../../Assets/images/pool6.jpg';

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
    const [HeroImageUrl, setHeroImageUrl] = useState('');
    const [HeroTitle, setHeroTitle] = useState('');
    const [HeroDescription, setHeroDescription] = useState('');
    const formRefs = useRef([]);

    useEffect(() => {
        fetchHeroImage();
        fetchHeroTitle();
        fetchHeroDescription();
      }, [])

      async function fetchHeroImage() {
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelService/2/hero-image",
        {
          withCredentials: true,
        }
      );
      setHeroImageUrl(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Failed to get hero image!");
    }
  }

  async function fetchHeroTitle() {
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelService/2/hero-title",
        {
          withCredentials: true,
        }
      );
      setHeroTitle(res.data);
    } catch (err) {
      console.error("Failed to get hero title!");
    }
  }

  async function fetchHeroDescription() {
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelService/2/hero-description",
        {
          withCredentials: true,
        }
      );
      setHeroDescription(res.data);
    } catch (err) {
      console.error("Failed to get hero description!");
    }
  }

    // const sections = [
    //     {
    //         id: 1,
    //         img: InsidePool,
    //         title: 'Heated Indoor Pool',
    //         text: 'Relax in our temperature-controlled indoor pool...',
    //         price: '€25 per person'
    //     },
    //     {
    //         id: 2,
    //         img: OutsidePool,
    //         title: 'Scenic Outdoor Pool',
    //         text: 'Escape to our breathtaking outdoor pool area...',
    //         price: '€35 per person'
    //     },
    //     {
    //         id: 3,
    //         img: Spa,
    //         title: 'Massage & Relaxation Room',
    //         text: 'Step into our peaceful massage and relaxation room...',
    //         price: '€50 per session'
    //     },
    //     {
    //         id: 4,
    //         img: Sauna,
    //         title: 'Sauna Room',
    //         text: 'Experience the soothing warmth of our dedicated sauna room...',
    //         price: '€30 per session'
    //     }
    // ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmation('Reservation submitted (mock).');
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
            <div
                style={{
                    backgroundImage: `url('https://localhost:7117/Images/Services/${HeroImageUrl}')`,
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
                        {HeroTitle}
                    </h1>
                    <p className="lead">{HeroDescription}</p>
                </div>
            </div>

            {/* <div className="container py-5">
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
                                                <option key={idx} value={slot}>{slot}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button className="btn btn-primary" type="submit">Submit Reservation</button>
                                    {confirmation && (
                                        <p className={`mt-3 fw-bold ${confirmation.includes('successfully') ? 'text-success' : 'text-info'}`}>
                                            {confirmation}
                                        </p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>
                ))}
            </div> */}
        </div>
    );
};

export default PoolSpa;
