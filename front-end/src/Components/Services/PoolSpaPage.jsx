// import React, { useState, useEffect } from 'react';
// import InsidePool from '../../Assets/images/inside pool.png';
// import Insidepool from '../../Assets/images/insidepool.png';
// import OutsidePool from '../../Assets/images/outside pool.png';
// import Outsidepool from '../../Assets/images/outsidepool.png';
// import SpaandSauna from '../../Assets/images/spa & sauna.png';
// import SpaSauna from '../../Assets/images/spa&sauna.png';
// const galleryImages = [InsidePool, OutsidePool, SpaandSauna, Insidepool];
// // Add this in your index.html or import Sacramento font in your CSS:
// // <link href="https://fonts.googleapis.com/css2?family=Sacramento&display=swap" rel="stylesheet">

// const servicesData = [
//   {
//     id: 1,
//     type: "Pool & Spa",
//     name: "Pool & Sauna Session",
//     description: "30-minute sauna to relax your body",
//     price: 30.0,
//   },
//   {
//     id: 2,
//     type: "Pool & Spa",
//     name: "Pool & Full Body Massage",
//     description: "1-hour relaxing massage by professionals",
//     price: 60.0,
//   },
// ];

// const schedulesData = [
//   { id: 1, date: "2025-06-01", time: "10:00 AM", serviceName: "Sauna Session" },
//   { id: 2, date: "2025-06-01", time: "12:00 PM", serviceName: "Full Body Massage" },
//   { id: 3, date: "2025-06-02", time: "02:00 PM", serviceName: "Sauna Session" },
//   { id: 4, date: "2025-06-02", time: "04:00 PM", serviceName: "Full Body Massage" },
// ];

// const galleryTexts = [
//   "Tranquil poolside escape",
//   "Professional spa ambiance",
//   "Deep relaxation massage",
//   "Traditional sauna comfort",
// ];

// export default function PoolSpaPage() {
//   const [services, setServices] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [selectedSchedule, setSelectedSchedule] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const [reservationSuccess, setReservationSuccess] = useState(false);

//   useEffect(() => {
//     setServices(servicesData);
//     setSchedules(schedulesData);
//   }, []);

//   function handleScheduleChange(e) {
//     setSelectedSchedule(e.target.value);
//   }

//   function handleNameChange(e) {
//     setCustomerName(e.target.value);
//   }

//   function handleReservation(e) {
//     e.preventDefault();
//     if (!customerName || !selectedSchedule) return alert("Please fill all fields");

//     console.log("Reservation made:", {
//       customerName,
//       scheduleId: selectedSchedule,
//     });
//     setReservationSuccess(true);
//     setCustomerName('');
//     setSelectedSchedule('');
//   }

//   return (
//     <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', paddingBottom: '3rem' }}>
//       {/* Hero Section */}
//       <div className="text-center py-5" style={{ backgroundColor: '#EADBC8' }}>
//         <h1
//           style={{
//             fontFamily: "'Sacramento', cursive",
//             fontSize: '3rem',
//             color: '#5D4037',
//             marginBottom: '0.5rem',
//           }}
//         >
//           Relax. Refresh. Rejuvenate.
//         </h1>
//         <p className="lead" style={{ color: '#5D4037' }}>
//           Experience premium spa and pool services for your well-being.
//         </p>
//       </div>

//       {/* Services Section */}
//       <div className="container mt-5">
//         <h2 style={{ fontFamily: "'Sacramento', cursive", color: '#5D4037', marginBottom: '1.5rem' }}>
//           Our Services
//         </h2>
//         <div className="row">
//           {services.map((service) => (
//             <div className="col-md-6 mb-4" key={service.id}>
//               <div className="card shadow-sm h-100" style={{ backgroundColor: '#EADBC8' }}>
//                 <div className="card-body">
//                   <h5 style={{ color: '#5D4037' }}>{service.name}</h5>
//                   <p>{service.description}</p>
//                   <p className="text-muted">${service.price.toFixed(2)}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Gallery Section */}
//       <div className="container mt-5">
//         <h2 style={{ fontFamily: "'Sacramento', cursive", color: '#5D4037', marginBottom: '1.5rem' }}>
//           Pool & Spa Gallery
//         </h2>
//         <div className="row g-4">
//           {galleryImages.map((img, i) => (
//             <div className="col-md-6" key={i}>
//               <div className="card border-0">
//                 <img
//                   src={img}
//                   className="card-img-top rounded-4 shadow-sm"
//                   alt="Pool & Spa"
//                   style={{ maxHeight: '300px', objectFit: 'cover' }}
//                 />
//                 <div className="card-body">
//                   <p className="card-text text-muted fst-italic">{galleryTexts[i]}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Schedule Section */}
//       <div className="container mt-5">
//         <h2 style={{ fontFamily: "'Sacramento', cursive", color: '#5D4037', marginBottom: '1rem' }}>
//           Available Schedules
//         </h2>
//         <select
//           className="form-select mb-4"
//           value={selectedSchedule}
//           onChange={handleScheduleChange}
//           aria-label="Select schedule"
//         >
//           <option value="" disabled>
//             -- Select a schedule --
//           </option>
//           {schedules.map((s) => (
//             <option key={s.id} value={s.id}>
//               {s.date} at {s.time} ({s.serviceName})
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Reservation Form */}
//       <div className="container mt-4">
//         <h2 style={{ fontFamily: "'Sacramento', cursive", color: '#5D4037', marginBottom: '1rem' }}>
//           Make a Reservation
//         </h2>
//         <form onSubmit={handleReservation}>
//           <div className="mb-3">
//             <label htmlFor="customerName" className="form-label">
//               Your Name
//             </label>
//             <input
//               id="customerName"
//               type="text"
//               className="form-control"
//               value={customerName}
//               onChange={handleNameChange}
//               placeholder="Enter your full name"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="scheduleSelect" className="form-label">
//               Select Schedule
//             </label>
//             <select
//               id="scheduleSelect"
//               className="form-select"
//               value={selectedSchedule}
//               onChange={handleScheduleChange}
//               required
//             >
//               <option value="" disabled>
//                 -- Select a schedule --
//               </option>
//               {schedules.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.date} at {s.time} ({s.serviceName})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button type="submit" className="btn" style={{ backgroundColor: '#A0522D', color: '#fff' }}>
//             Book Now
//           </button>
//         </form>

//         {reservationSuccess && (
//           <div
//             className="alert mt-4"
//             role="alert"
//             style={{
//               maxWidth: '500px',
//               backgroundColor: '#D7CCC8',
//               color: '#3E2723',
//               border: 'none',
//             }}
//           >
//             Thank you for your reservation! We look forward to welcoming you.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect } from 'react';
// import InsidePool from '../../Assets/images/inside pool.png';
// import Insidepool from '../../Assets/images/insidepool.png';
// import OutsidePool from '../../Assets/images/outside pool.png';
// import Outsidepool from '../../Assets/images/outsidepool.png';
// import SpaandSauna from '../../Assets/images/spa & sauna.png';
// import SpaSauna from '../../Assets/images/spa&sauna.png';

// const galleryImages = [InsidePool, OutsidePool, SpaandSauna, Insidepool];

// const galleryTexts = [
//   'Tranquil poolside escape',
//   'Professional spa ambiance',
//   'Deep relaxation massage',
//   'Traditional sauna comfort',
// ];

// const servicesData = [
//   {
//     id: 1,
//     type: 'Pool & Spa',
//     name: 'Pool & Sauna Session',
//     description: '30-minute sauna to relax your body',
//     price: 30.0,
//   },
//   {
//     id: 2,
//     type: 'Pool & Spa',
//     name: 'Pool & Full Body Massage',
//     description: '1-hour relaxing massage by professionals',
//     price: 60.0,
//   },
// ];

// const schedulesData = [
//   { id: 1, date: 'Monday-Sunday', time: '10:00-10:30 AM', serviceName: 'Sauna Session' },
//   { id: 2, date: 'Monday-Sunday', time: '12:00-13:00 PM', serviceName: 'Full Body Massage' },
//   { id: 3, date: 'Monday-Saturday', time: '14:00-14:30 PM', serviceName: 'Sauna Session' },
//   { id: 4, date: 'Monday-Saturday', time: '16:00-17:00 PM', serviceName: 'Full Body Massage' },
// ];

// export default function PoolSpaPage() {
//   const [services, setServices] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [selectedSchedule, setSelectedSchedule] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const [reservationSuccess, setReservationSuccess] = useState(false);

//   useEffect(() => {
//     setServices(servicesData);
//     setSchedules(schedulesData);
//   }, []);

//   function handleScheduleChange(e) {
//     setSelectedSchedule(e.target.value);
//   }

//   function handleNameChange(e) {
//     setCustomerName(e.target.value);
//   }

//   function handleReservation(e) {
//     e.preventDefault();
//     if (!customerName || !selectedSchedule) return alert('Please fill all fields');

//     console.log('Reservation made:', {
//       customerName,
//       scheduleId: selectedSchedule,
//     });
//     setReservationSuccess(true);
//     setCustomerName('');
//     setSelectedSchedule('');
//   }

//   return (
//     <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', paddingBottom: '3rem' }}>
//       {/* Hero Section */}
//       <div className="text-center py-5" style={{ backgroundColor: '#EADBC8' }}>
//         <h1
//           style={{
//             fontFamily: "'Sacramento', cursive",
//             fontSize: '3rem',
//             color: '#5D4037',
//             marginBottom: '0.5rem',
//           }}
//         >
//           Relax. Refresh. Rejuvenate.
//         </h1>
//         <p className="lead" style={{ color: '#5D4037' }}>
//           Experience premium spa and pool services for your well-being.
//         </p>
//       </div>

//       {/* Services Section */}
//       <div className="container mt-5">
//         <h2 style={{ fontFamily: "'Sacramento', cursive", color: '#5D4037', marginBottom: '1.5rem' }}>
//           Our Services
//         </h2>
//         <div className="row">
//           {services.map((service) => (
//             <div className="col-md-6 mb-4" key={service.id}>
//               <div className="card shadow-sm h-100" style={{ backgroundColor: '#EADBC8' }}>
//                 <div className="card-body">
//                   <h5 style={{ color: '#5D4037' }}>{service.name}</h5>
//                   <p>{service.description}</p>
//                   <p className="text-muted">${service.price.toFixed(2)}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Gallery Section */}
//       <div className="container mt-5">
//         <h2 style={{ fontFamily: "'Sacramento', cursive", color: '#5D4037', marginBottom: '1.5rem' }}>
//           Pool & Spa Gallery
//         </h2>
//         <div className="row g-4">
//           {galleryImages.map((img, i) => (
//             <div className="col-md-6" key={i}>
//               <div className="card border-0">
//                 <img
//                   src={img}
//                   className="card-img-top rounded-4 shadow-sm"
//                   alt="Pool & Spa"
//                   style={{ maxHeight: '300px', objectFit: 'cover' }}
//                 />
//                 <div className="card-body">
//                   <p className="card-text text-muted fst-italic">{galleryTexts[i]}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Enhanced Reservation & Schedule Section */}
//       <div className="container mt-5">
//         <div className="p-4 rounded-4 shadow-lg" style={{ backgroundColor: '#EADBC8' }}>
//           <div className="row g-5 align-items-start">
//             {/* Schedule Column */}
//             <div className="col-md-6">
//               <h3
//                 style={{
//                   fontFamily: "'Sacramento', cursive",
//                   color: '#5D4037',
//                   borderBottom: '2px solid #A0522D',
//                   paddingBottom: '0.5rem',
//                   marginBottom: '1rem',
//                 }}
//               >
//                 🕒 Available Schedules
//               </h3>

//               <div className="d-flex flex-column gap-3">
//                 {schedules.map((s) => (
//                   <div
//                     key={s.id}
//                     className={`p-3 rounded shadow-sm border ${
//                       selectedSchedule == s.id ? 'border-2 border-dark' : 'border-0'
//                     }`}
//                     style={{ backgroundColor: '#FAF9F6', cursor: 'pointer' }}
//                     onClick={() => setSelectedSchedule(s.id.toString())}
//                   >
//                     <h6 style={{ color: '#5D4037' }}>{s.date}</h6>
//                     <p className="mb-1">
//                       <strong>{s.time}</strong> - {s.serviceName}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Reservation Form Column */}
//             <div className="col-md-6">
//               <h3
//                 style={{
//                   fontFamily: "'Sacramento', cursive",
//                   color: '#5D4037',
//                   borderBottom: '2px solid #A0522D',
//                   paddingBottom: '0.5rem',
//                   marginBottom: '1rem',
//                 }}
//               >
//                 📋 Make a Reservation
//               </h3>
//               <form onSubmit={handleReservation}>
//                 <div className="mb-3">
//                   <label htmlFor="customerName" className="form-label">
//                     Your Name
//                   </label>
//                   <input
//                     id="customerName"
//                     type="text"
//                     className="form-control shadow-sm"
//                     value={customerName}
//                     onChange={handleNameChange}
//                     placeholder="Enter your full name"
//                     required
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="form-label">Selected Schedule</label>
//                   <input
//                     type="text"
//                     className="form-control shadow-sm"
//                     readOnly
//                     value={
//                       selectedSchedule
//                         ? `#${selectedSchedule} – ${
//                             schedules.find((s) => s.id == selectedSchedule)?.serviceName
//                           }`
//                         : 'No schedule selected'
//                     }
//                     style={{ backgroundColor: '#f0e8df' }}
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="btn w-100 shadow-sm"
//                   style={{ backgroundColor: '#A0522D', color: '#fff' }}
//                 >
//                   Book Now
//                 </button>
//               </form>

//               {reservationSuccess && (
//                 <div
//                   className="alert mt-4"
//                   role="alert"
//                   style={{ backgroundColor: '#D7CCC8', color: '#3E2723', border: 'none' }}
//                 >
//                   🎉 Thank you for your reservation! We look forward to welcoming you.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import InsidePool from '../../Assets/images/inside pool.png';
import Insidepool from '../../Assets/images/insidepool.png';
import OutsidePool from '../../Assets/images/outside pool.png';
import Outsidepool from '../../Assets/images/outsidepool.png';
import SpaandSauna from '../../Assets/images/spa & sauna.png';
import SpaSauna from '../../Assets/images/spa&sauna.png';
import heroImage from '../../Assets/images/hotelpool.PNG';

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
      text: 'Relax in our temperature-controlled indoor pool, perfect for year-round swims.'
    },
    {
      img: OutsidePool,
      title: 'Scenic Outdoor Pool',
      text: 'Bask in the sun by our expansive outdoor pool with lush surroundings.'
    },
    {
      img: Insidepool,
      title: 'Family Indoor Area',
      text: 'Enjoy quality time in our family-friendly indoor section with comfortable amenities.'
    },
    {
      img: SpaandSauna,
      title: 'Spa & Sauna Zone',
      text: 'Rejuvenate your senses in our luxury spa and authentic sauna environment.'
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
