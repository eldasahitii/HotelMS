// import React, { useState, useRef, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import InsidePool from '../../Assets/images/indoorpool3.png';
// import OutsidePool from '../../Assets/images/pool2.jpg';
// import Spa from '../../Assets/images/spa.jpg';
// import Sauna from '../../Assets/images/4.png';
// import heroImage from '../../Assets/images/pool6.jpg';

// const timeSlots = [
//   '10:00 AM - 11:00 AM',
//   '11:00 AM - 12:00 PM',
//   '12:00 PM - 1:00 PM',
//   '1:00 PM - 2:00 PM',
//   '2:00 PM - 3:00 PM',
//   '3:00 PM - 4:00 PM',
//   '4:00 PM - 5:00 PM',
//   '5:00 PM - 6:00 PM',
//   '6:00 PM - 7:00 PM'
// ];

// const framedImageStyle = {
//   border: '10px solid #ffffff',
//   boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
//   padding: '4px',
//   backgroundColor: '#ffffff',
//   borderRadius: '4px'
// };

// const PoolSpa = () => {
//   const [activeForm, setActiveForm] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [takenSlots, setTakenSlots] = useState([]);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: ''
//   });
//   const [confirmation, setConfirmation] = useState('');
//   const formRefs = useRef([]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (takenSlots.includes(selectedSlot)) {
//       setConfirmation('Selected time is unavailable.');
//     } else {
//       // TODO: Send reservation data to backend
//       setConfirmation('Reservation made successfully.');
//       setTimeout(() => {
//         setActiveForm(null);
//       }, 1500);
//     }
//   };

//   const fetchTakenSlots = async (date) => {
//     try {
//       const response = await fetch(`/api/reservations?takenDate=${date}`);
//       const data = await response.json();
//       setTakenSlots(data);
//     } catch (error) {
//       console.error('Error fetching taken slots:', error);
//       setTakenSlots([]);
//     }
//   };

//   useEffect(() => {
//     if (selectedDate) {
//       fetchTakenSlots(selectedDate);
//     }
//   }, [selectedDate]);

//   const openForm = (index) => {
//     setActiveForm(index);
//     setConfirmation('');
//     setFormData({ firstName: '', lastName: '', email: '', phone: '' });
//     setSelectedSlot('');
//     setSelectedDate('');
//     setTakenSlots([]);
//     setTimeout(() => {
//       formRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }, 100);
//   };

//   const sections = [
//     {
//       img: InsidePool,
//       title: 'Heated Indoor Pool',
//       text: 'Relax in our temperature-controlled indoor pool, perfect for year-round swims. Ideal for solo visitors or families looking for a calm, refreshing environment regardless of the season. Enjoy clean, modern facilities and a peaceful atmosphere designed for your comfort.',
//       price: '€25 per person'
//     },
//     {
//       img: OutsidePool,
//       title: 'Scenic Outdoor Pool',
//       text: 'Escape to our breathtaking outdoor pool area, where tranquility meets natural beauty. Surrounded by lush greenery and designed with relaxation in mind, our expansive pool offers the perfect setting to soak up the sun or enjoy a peaceful swim. Lounge on comfortable sunbeds, sip refreshing drinks from our poolside bar, and take in the serene views that create a true resort-style experience.',
//       price: '€35 per person'
//     },
//     {
//       img: Spa,
//       title: 'Massage & Relaxation Room',
//       text: 'Step into our peaceful massage and relaxation room, where expert therapists help release tension and restore balance. From full-body massages to targeted treatments, each session is tailored to your needs in a calm, private environment. Ideal for guests seeking deep relaxation or relief from stress and fatigue.',
//       price: '€50 per session'
//     },
//     {
//       img: Sauna,
//       title: 'Sauna Room',
//       text: 'Experience the soothing warmth of our dedicated sauna room, designed to relax muscles, improve circulation, and promote overall well-being. Enjoy the quiet, wood-lined space as heat gently eases tension and clears your mind. Perfect for unwinding after a swim or simply taking time for yourself in a peaceful setting.',
//       price: '€30 per session'
//     }
//   ];

//   return (
//     <div style={{ backgroundColor: '#ffffff' }}>
//       <div
//         style={{
//           backgroundImage: `url(${heroImage})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           height: '70vh',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           color: '#fff',
//           textAlign: 'center'
//         }}
//       >
//         <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '2rem' }}>
//           <h1 className="display-4 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
//             Pool & Spa Experiences
//           </h1>
//           <p className="lead">Refresh, recharge, and relax with our premium water and wellness services.</p>
//         </div>
//       </div>

//       <div className="container py-5">
//         {sections.map((section, idx) => (
//           <div className={`row align-items-center mb-5 ${idx % 2 !== 0 ? 'flex-md-row-reverse' : ''}`} key={idx}>
//             <div className="col-md-6 mb-4 mb-md-0">
//               <div style={framedImageStyle}>
//                 <img src={section.img} alt={section.title} className="img-fluid" />
//               </div>
//             </div>
//             <div className="col-md-6" ref={el => formRefs.current[idx] = el}>
//               <h3 style={{ color: '#333' }}>{section.title}</h3>
//               <p className="text-muted">{section.text}</p>
//               <p className="fw-semibold mt-2">Price: <span className="text-primary">{section.price}</span></p>
//               <button className="btn btn-dark" onClick={() => openForm(idx)}>Reserve</button>

//               {activeForm === idx && (
//                 <form onSubmit={handleSubmit} className="border mt-4 p-4 rounded bg-light">
//                   <div className="row mb-3">
//                     <div className="col">
//                       <input type="text" name="firstName" placeholder="First Name" className="form-control" value={formData.firstName} onChange={handleInputChange} required />
//                     </div>
//                     <div className="col">
//                       <input type="text" name="lastName" placeholder="Last Name" className="form-control" value={formData.lastName} onChange={handleInputChange} required />
//                     </div>
//                   </div>
//                   <div className="mb-3">
//                     <input type="email" name="email" placeholder="Email" className="form-control" value={formData.email} onChange={handleInputChange} required />
//                   </div>
//                   <div className="mb-3">
//                     <input type="tel" name="phone" placeholder="Phone Number" className="form-control" value={formData.phone} onChange={handleInputChange} required />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Select Date</label>
//                     <input type="date" className="form-control" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Select Time</label>
//                     <select className="form-select" value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} required>
//                       <option value="">-- Select a time --</option>
//                       {timeSlots.map((slot, idx) => (
//                         <option key={idx} value={slot} disabled={takenSlots.includes(slot)}>
//                           {slot} {takenSlots.includes(slot) ? ' (Unavailable)' : ''}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <button className="btn btn-primary" type="submit">Submit Reservation</button>
//                   {confirmation && (
//                     <p className={`mt-3 fw-bold ${confirmation.includes('successfully') ? 'text-success' : 'text-danger'}`}>
//                       {confirmation}
//                     </p>
//                   )}
//                 </form>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PoolSpa;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function PoolsPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    ReservationDate: "",
    StartTime: "",
    EndTime: "",
  });

  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backendBaseUrl = "https://localhost:7117/";

  useEffect(() => {
    if (!serviceId) {
      setError("Pool service ID is missing.");
      setLoading(false);
      return;
    }
    const fetchPool = async () => {
      try {
        const res = await axios.get(`${backendBaseUrl}api/HotelService/get`, {
          params: { id: serviceId },
          withCredentials: true,
        });
        setPool(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load pool service details.");
        setLoading(false);
      }
    };
    fetchPool();
  }, [serviceId]);

  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function validateForm() {
    if (
      !form.FirstName ||
      !form.LastName ||
      !form.Email ||
      !form.Phone ||
      !form.ReservationDate ||
      !form.StartTime ||
      !form.EndTime
    ) {
      return "All fields are required.";
    }
    if (new Date(form.ReservationDate) < new Date().setHours(0, 0, 0, 0)) {
      return "Reservation date cannot be in the past.";
    }
    if (form.EndTime <= form.StartTime) {
      return "End time must be after start time.";
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const auth = await axios.get(`${backendBaseUrl}api/Auth/me`, {
        withCredentials: true,
      });
      if (!auth.data.role) {
        navigate("/login");
        return;
      }

      const reservationData = {
        ServiceId: pool.id,
        FirstName: form.FirstName,
        LastName: form.LastName,
        Email: form.Email,
        Phone: form.Phone,
        ReservationDate: form.ReservationDate,
        StartTime: form.StartTime,
        EndTime: form.EndTime,
        ReservationStatusID: 1,
        CreatedAt: new Date().toISOString(),
      };

      const response = await axios.post(
        `${backendBaseUrl}api/HotelServiceReservation/make`,
        reservationData,
        { withCredentials: true }
      );

      setSubmitSuccess(response.data || "Reservation successful!");
      setForm({
        FirstName: "",
        LastName: "",
        Email: "",
        Phone: "",
        ReservationDate: "",
        StartTime: "",
        EndTime: "",
      });
    } catch (err) {
      setSubmitError(
        err.response?.data || "Failed to make reservation, please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <div className="m-3">Loading pool details...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container mt-3">
      <h2>{pool.name}</h2>
      <p>{pool.description}</p>
      <p>
        <strong>Price:</strong> ${pool.price}
      </p>
      {pool.images && pool.images.length > 0 && (
        <div className="mb-3">
          {pool.images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={`Pool image ${idx + 1}`}
              style={{ width: "200px", marginRight: "10px" }}
            />
          ))}
        </div>
      )}

      <h3>Make a Reservation</h3>

      {submitError && (
        <div className="alert alert-danger">{submitError}</div>
      )}
      {submitSuccess && (
        <div className="alert alert-success">{submitSuccess}</div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Form fields (same as before) */}
        {/* ... */}
        {/* Add your form controls here - already in your original code */}
      </form>
    </div>
  );
}
