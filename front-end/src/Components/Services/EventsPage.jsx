// import React, { useState, useRef, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import ConferenceRoom from '../../Assets/images/conference.png';
// import WeddingVenue from '../../Assets/images/2.png';
// import heroImage from '../../Assets/images/mainevents.jpg';

// const defaultSlots = {
//   conference: ['10:00 AM - 6:00 PM', '12:00 PM - 8:00 PM'],
//   wedding: ['Whole Day (9:00 AM - 11:00 PM)']
// };

// const framedImageStyle = {
//   border: '10px solid #ffffff',
//   boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
//   padding: '4px',
//   backgroundColor: '#ffffff',
//   borderRadius: '4px'
// };

// const Events = () => {
//   const [activeForm, setActiveForm] = useState(null);
//   const [selectedSlot, setSelectedSlot] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: ''
//   });
//   const [confirmation, setConfirmation] = useState('');
//   const [takenSlots, setTakenSlots] = useState([]);
//   const [availableSlots, setAvailableSlots] = useState(defaultSlots);

//   const formRefs = useRef([]);

//   useEffect(() => {
//     const fetchTakenSlots = async () => {
//       const simulatedResponse = {
//         '2025-06-01': ['10:00 AM - 6:00 PM'],
//         '2025-06-02': ['Whole Day (9:00 AM - 11:00 PM)']
//       };
//       setTakenSlots(simulatedResponse[selectedDate] || []);
//     };

//     if (selectedDate) fetchTakenSlots();
//   }, [selectedDate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e, type) => {
//     e.preventDefault();
//     if (takenSlots.includes(selectedSlot)) {
//       setConfirmation('Selected time is unavailable.');
//     } else {
//       setConfirmation('Reservation made successfully.');
//       setTimeout(() => {
//         setActiveForm(null);
//       }, 1500);
//     }
//   };

//   const openForm = (index) => {
//     setActiveForm(index);
//     setConfirmation('');
//     setFormData({ firstName: '', lastName: '', email: '', phone: '' });
//     setSelectedSlot('');
//     setSelectedDate('');
//     setTimeout(() => {
//       formRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }, 100);
//   };

//   const sections = [
//     {
//       type: 'conference',
//       img: ConferenceRoom,
//       title: 'Modern Conference Room',
//       text: 'Host your next meeting or seminar in our fully equipped conference room, featuring high-speed internet, audio-visual equipment, and comfortable seating. Designed for productivity and professionalism, the space is ideal for business gatherings, workshops, or corporate presentations. Catering and technical support services are also available to ensure a seamless experience for you and your attendees.',
//       price: '€200 per session'
//     },
//     {
//       type: 'wedding',
//       img: WeddingVenue,
//       title: 'Elegant Wedding Venue',
//       text: 'Celebrate your special day in our romantic wedding venue, where timeless charm meets modern elegance. Surrounded by beautiful architecture and customizable decor options, the venue provides the perfect setting for ceremonies and receptions. From intimate gatherings to grand celebrations, our team is here to help bring your dream wedding to life.',
//       price: '€1,500 per day'
//     }
//   ];

//   return (
//     <div style={{ backgroundColor: '#ffffff' }}>
//       {/* Hero Section */}
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
//             Events
//           </h1>
//           <p className="lead">Discover perfect venues for every occasion.</p>
//         </div>
//       </div>

//       {/* Sections */}
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
//               <p className="mt-2">
//                 <span className="fw-bold text-dark">Price:</span>{' '}
//                 <span className="fw-bold text-primary">{section.price}</span>
//               </p>
//               <button className="btn btn-dark" onClick={() => openForm(idx)}>Reserve</button>

//               {activeForm === idx && (
//                 <form onSubmit={(e) => handleSubmit(e, section.type)} className="border mt-4 p-4 rounded bg-light">
//                   <div className="row mb-3">
//                     <div className="col">
//                       <input
//                         type="text"
//                         name="firstName"
//                         placeholder="First Name"
//                         className="form-control"
//                         value={formData.firstName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                     <div className="col">
//                       <input
//                         type="text"
//                         name="lastName"
//                         placeholder="Last Name"
//                         className="form-control"
//                         value={formData.lastName}
//                         onChange={handleInputChange}
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="mb-3">
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="Email"
//                       className="form-control"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <input
//                       type="tel"
//                       name="phone"
//                       placeholder="Phone Number"
//                       className="form-control"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Select Date</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       value={selectedDate}
//                       onChange={(e) => setSelectedDate(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Select Time</label>
//                     <select
//                       className="form-select"
//                       value={selectedSlot}
//                       onChange={(e) => setSelectedSlot(e.target.value)}
//                       required
//                     >
//                       <option value="">-- Select a time --</option>
//                       {availableSlots[section.type]?.map((slot, idx) => (
//                         <option key={idx} value={slot} disabled={takenSlots.includes(slot)}>
//                           {slot} {takenSlots.includes(slot) ? '(Unavailable)' : ''}
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

// export default Events;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EventsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reservation form state
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
    if (!id) {
      setError("Event service ID is missing.");
      setLoading(false);
      return;
    }
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${backendBaseUrl}api/HotelService/get`, {
          params: { id },
          withCredentials: true,
        });
        setEvent(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load event service details.");
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

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
      // Check authentication
      const auth = await axios.get(`${backendBaseUrl}api/Auth/me`, {
        withCredentials: true,
      });
      if (!auth.data.role) {
        navigate("/login");
        return;
      }

      const reservationData = {
        ServiceId: event.id,
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

  if (loading) return <div className="m-3">Loading event details...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container mt-3">
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>
        <strong>Price:</strong> ${event.price}
      </p>
      {event.images && event.images.length > 0 && (
        <div className="mb-3">
          {event.images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={`Event image ${idx + 1}`}
              style={{ width: "200px", marginRight: "10px" }}
            />
          ))}
        </div>
      )}

      <h3>Make a Reservation</h3>

      {submitError && (
        <div className="alert alert-danger" role="alert">
          {submitError}
        </div>
      )}
      {submitSuccess && (
        <div className="alert alert-success" role="alert">
          {submitSuccess}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="FirstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              id="FirstName"
              name="FirstName"
              className="form-control"
              value={form.FirstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="LastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="LastName"
              name="LastName"
              className="form-control"
              value={form.LastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="Email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="Email"
              name="Email"
              className="form-control"
              value={form.Email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="Phone" className="form-label">
              Phone
            </label>
            <input
              type="tel"
              id="Phone"
              name="Phone"
              className="form-control"
              value={form.Phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label htmlFor="ReservationDate" className="form-label">
              Reservation Date
            </label>
            <input
              type="date"
              id="ReservationDate"
              name="ReservationDate"
              className="form-control"
              value={form.ReservationDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="StartTime" className="form-label">
              Start Time
            </label>
            <input
              type="time"
              id="StartTime"
              name="StartTime"
              className="form-control"
              value={form.StartTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="EndTime" className="form-label">
              End Time
            </label>
            <input
              type="time"
              id="EndTime"
              name="EndTime"
              className="form-control"
              value={form.EndTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Book Event"}
        </button>
      </form>
    </div>
  );
}

