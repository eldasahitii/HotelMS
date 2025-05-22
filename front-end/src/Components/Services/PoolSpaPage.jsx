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
import React, { useState, useEffect } from 'react';
import InsidePool from '../../Assets/images/inside pool.png';
import Insidepool from '../../Assets/images/insidepool.png';
import OutsidePool from '../../Assets/images/outside pool.png';
import Outsidepool from '../../Assets/images/outsidepool.png';
import SpaandSauna from '../../Assets/images/spa & sauna.png';
import SpaSauna from '../../Assets/images/spa&sauna.png';

const galleryImages = [InsidePool, OutsidePool, SpaandSauna, Insidepool];

const galleryTexts = [
  'Tranquil poolside escape',
  'Professional spa ambiance',
  'Deep relaxation massage',
  'Traditional sauna comfort',
];

const servicesData = [
  {
    id: 1,
    type: 'Pool & Spa',
    name: 'Pool & Sauna Session',
    description: '30-minute sauna to relax your body',
    price: 30.0,
  },
  {
    id: 2,
    type: 'Pool & Spa',
    name: 'Pool & Full Body Massage',
    description: '1-hour relaxing massage by professionals',
    price: 60.0,
  },
];

const schedulesData = [
  { id: 1, date: 'Monday-Sunday', time: '10:00-10:30 AM', serviceName: 'Sauna Session' },
  { id: 2, date: 'Monday-Sunday', time: '12:00-13:00 PM', serviceName: 'Full Body Massage' },
  { id: 3, date: 'Monday-Saturday', time: '14:00-14:30 PM', serviceName: 'Sauna Session' },
  { id: 4, date: 'Monday-Saturdat', time: '16:00-17:00 PM', serviceName: 'Full Body Massage' },
];

export default function PoolSpaPage() {
  const [services, setServices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [reservationSuccess, setReservationSuccess] = useState(false);

  useEffect(() => {
    setServices(servicesData);
    setSchedules(schedulesData);
  }, []);

  function handleScheduleChange(e) {
    setSelectedSchedule(e.target.value);
  }

  function handleNameChange(e) {
    setCustomerName(e.target.value);
  }

  function handleReservation(e) {
    e.preventDefault();
    if (!customerName || !selectedSchedule) return alert('Please fill all fields');

    console.log('Reservation made:', {
      customerName,
      scheduleId: selectedSchedule,
    });
    setReservationSuccess(true);
    setCustomerName('');
    setSelectedSchedule('');
  }

  return (
    <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <div className="text-center py-5" style={{ backgroundColor: '#EADBC8' }}>
        <h1
          style={{
            fontFamily: "'Sacramento', cursive",
            fontSize: '3rem',
            color: '#5D4037',
            marginBottom: '0.5rem',
          }}
        >
          Relax. Refresh. Rejuvenate.
        </h1>
        <p className="lead" style={{ color: '#5D4037' }}>
          Experience premium spa and pool services for your well-being.
        </p>
      </div>

      {/* Services Section */}
      <div className="container mt-5">
        <h2 style={{ fontFamily: "'Sacramento', cursive", color: '#5D4037', marginBottom: '1.5rem' }}>
          Our Services
        </h2>
        <div className="row">
          {services.map((service) => (
            <div className="col-md-6 mb-4" key={service.id}>
              <div className="card shadow-sm h-100" style={{ backgroundColor: '#EADBC8' }}>
                <div className="card-body">
                  <h5 style={{ color: '#5D4037' }}>{service.name}</h5>
                  <p>{service.description}</p>
                  <p className="text-muted">${service.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mt-5">
        <h2 style={{ fontFamily: "'Sacramento', cursive", color: '#5D4037', marginBottom: '1.5rem' }}>
          Pool & Spa Gallery
        </h2>
        <div className="row g-4">
          {galleryImages.map((img, i) => (
            <div className="col-md-6" key={i}>
              <div className="card border-0">
                <img
                  src={img}
                  className="card-img-top rounded-4 shadow-sm"
                  alt="Pool & Spa"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <p className="card-text text-muted fst-italic">{galleryTexts[i]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Reservation & Schedule Section */}
      <div className="container mt-5">
        <div className="p-4 rounded-4 shadow-lg" style={{ backgroundColor: '#EADBC8' }}>
          <div className="row g-5 align-items-start">
            {/* Schedule Column */}
            <div className="col-md-6">
              <h3
                style={{
                  fontFamily: "'Sacramento', cursive",
                  color: '#5D4037',
                  borderBottom: '2px solid #A0522D',
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                🕒 Available Schedules
              </h3>

              <div className="d-flex flex-column gap-3">
                {schedules.map((s) => (
                  <div
                    key={s.id}
                    className={`p-3 rounded shadow-sm border ${
                      selectedSchedule == s.id ? 'border-2 border-dark' : 'border-0'
                    }`}
                    style={{ backgroundColor: '#FAF9F6', cursor: 'pointer' }}
                    onClick={() => setSelectedSchedule(s.id.toString())}
                  >
                    <h6 style={{ color: '#5D4037' }}>{s.date}</h6>
                    <p className="mb-1">
                      <strong>{s.time}</strong> - {s.serviceName}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reservation Form Column */}
            <div className="col-md-6">
              <h3
                style={{
                  fontFamily: "'Sacramento', cursive",
                  color: '#5D4037',
                  borderBottom: '2px solid #A0522D',
                  paddingBottom: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                📋 Make a Reservation
              </h3>
              <form onSubmit={handleReservation}>
                <div className="mb-3">
                  <label htmlFor="customerName" className="form-label">
                    Your Name
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    className="form-control shadow-sm"
                    value={customerName}
                    onChange={handleNameChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Selected Schedule</label>
                  <input
                    type="text"
                    className="form-control shadow-sm"
                    readOnly
                    value={
                      selectedSchedule
                        ? `#${selectedSchedule} – ${
                            schedules.find((s) => s.id == selectedSchedule)?.serviceName
                          }`
                        : 'No schedule selected'
                    }
                    style={{ backgroundColor: '#f0e8df' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 shadow-sm"
                  style={{ backgroundColor: '#A0522D', color: '#fff' }}
                >
                  Book Now
                </button>
              </form>

              {reservationSuccess && (
                <div
                  className="alert mt-4"
                  role="alert"
                  style={{ backgroundColor: '#D7CCC8', color: '#3E2723', border: 'none' }}
                >
                  🎉 Thank you for your reservation! We look forward to welcoming you.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
