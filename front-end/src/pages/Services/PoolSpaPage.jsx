// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';

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

// const PoolSpa = () => {
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
//   const [HeroImageUrl, setHeroImageUrl] = useState('');
//   const [HeroTitle, setHeroTitle] = useState('');
//   const [HeroDescription, setHeroDescription] = useState('');
//   const formRefs = useRef([]);

//   const [services, setServices] = useState([]);

//   useEffect(() => {
//     fetchHeroImage();
//     fetchHeroTitle();
//     fetchHeroDescription();
//     fetchFeaturedServices();
//   }, []);

//   async function fetchHeroImage() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelService/2/hero-image",
//         { withCredentials: true }
//       );
//       setHeroImageUrl(res.data);
//     } catch {
//       console.error("Failed to get hero image!");
//     }
//   }

//   async function fetchHeroTitle() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelService/2/hero-title",
//         { withCredentials: true }
//       );
//       setHeroTitle(res.data);
//     } catch {
//       console.error("Failed to get hero title!");
//     }
//   }

//   async function fetchHeroDescription() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelService/2/hero-description",
//         { withCredentials: true }
//       );
//       setHeroDescription(res.data);
//     } catch {
//       console.error("Failed to get hero description!");
//     }
//   }

//   async function fetchFeaturedServices() {
//     try {
//       const res = await axios.get(
//         "https://localhost:7117/api/HotelServiceDetail/featured",
//         { withCredentials: true }
//       );
//       setServices(res.data);
//     } catch (err) {
//       console.error("Failed to get featured services!", err);
//     }
//   }

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const submitReservation = async (service, formData, selectedDate, selectedSlot) => {
//     try {
//       const reservationPayload = {
//         reservationID: 0,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone: formData.phone,
//         reservationDate: selectedDate,
//         timeSlot: selectedSlot,
//         hotelServiceDetailID: service.id,
//         hotelServiceName: service.detailTitle,
//         reservationStatusID: 1,
//         createdAt: new Date().toISOString(),
//         serviceReceptionistId: 1,
//         receptionistFirstName: "Erblina",
//         receptionistLastName: "Kadriu",
//         receptionistEmail: "erblina@gmail.com"
//       };

//       const response = await axios.post(
//         'https://localhost:7117/api/HotelServiceReservation/CreateReservation',
//         reservationPayload,
//         { withCredentials: true }
//       );

//       if (response.status === 200 || response.status === 201) {
//         setConfirmation('Reservation submitted successfully!');
//         setTimeout(() => setActiveForm(null), 1500);
//       } else {
//         setConfirmation('Failed to submit reservation.');
//       }
//     } catch (error) {
//       console.error('Error submitting reservation:', error);
//       setConfirmation('Error submitting reservation. Please try again.');
//     }
//   };

//   const handleSubmit = (e, service) => {
//     e.preventDefault();
//     if (!selectedDate || !selectedSlot) {
//       setConfirmation('Please select date and time slot.');
//       return;
//     }
//     submitReservation(service, formData, selectedDate, selectedSlot);
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

//   return (
//     <div className="bg-white">
//       {/* Hero Section */}
//       <div
//         className="d-flex align-items-center justify-content-center text-center text-white"
//         style={{
//           backgroundImage: `url('https://localhost:7117/Images/Services/${HeroImageUrl}')`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           height: '70vh'
//         }}
//       >
//         <div className="p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <h1 className="display-4 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
//             {HeroTitle}
//           </h1>
//           <p className="lead">{HeroDescription}</p>
//         </div>
//       </div>

//       {/* Services Section */}
//       <div className="container py-5">
//         {services.map((section, idx) => (
//           <div
//             key={section.id}
//             className={`row align-items-center mb-5 ${idx % 2 !== 0 ? 'flex-md-row-reverse' : ''}`}
//           >
//             <div className="col-md-6 mb-4 mb-md-0">
//               <div className="border border-4 rounded shadow-sm p-1 bg-white">
//                 <img
//                   src={`https://localhost:7117/Images/Services/${section.detailImage}`}
//                   alt={section.detailTitle}
//                   className="img-fluid rounded"
//                 />
//               </div>
//             </div>
//             <div className="col-md-6" ref={el => formRefs.current[idx] = el}>
//               <h3 className="text-dark">{section.detailTitle}</h3>
//               <p className="text-muted">{section.detailDescription}</p>
//               <p className="fw-semibold mt-2">
//                 Price: <span className="text-primary">{section.price}</span>
//               </p>
//               <button className="btn btn-dark" onClick={() => openForm(idx)}>Reserve</button>

//               {activeForm === idx && (
//                 <form onSubmit={(e) => handleSubmit(e, section)} className="border mt-4 p-4 rounded bg-light">
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
//                       {timeSlots.map((slot, idx) => (
//                         <option key={idx} value={slot}>{slot}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <button className="btn btn-primary" type="submit">Submit Reservation</button>
//                   {confirmation && (
//                     <p className={`mt-3 fw-bold ${confirmation.includes('successfully') ? 'text-success' : 'text-info'}`}>
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
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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

  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchHeroImage();
    fetchHeroTitle();
    fetchHeroDescription();
    fetchAllRelevantServices();
  }, []);

  async function fetchHeroImage() {
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelService/2/hero-image",
        { withCredentials: true }
      );
      setHeroImageUrl(res.data);
    } catch {
      console.error("Failed to get hero image!");
    }
  }

  async function fetchHeroTitle() {
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelService/2/hero-title",
        { withCredentials: true }
      );
      setHeroTitle(res.data);
    } catch {
      console.error("Failed to get hero title!");
    }
  }

  async function fetchHeroDescription() {
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelService/2/hero-description",
        { withCredentials: true }
      );
      setHeroDescription(res.data);
    } catch {
      console.error("Failed to get hero description!");
    }
  }

  async function fetchAllRelevantServices() {
    try {
      const [featuredRes, allRes] = await Promise.all([
        axios.get("https://localhost:7117/api/HotelServiceDetail/featured", {
          withCredentials: true,
        }),
        axios.get("https://localhost:7117/api/HotelServiceDetail/GetAllServiceDetails", {
          withCredentials: true,
        }),
      ]);

      const featured = featuredRes.data;
      const all = allRes.data;

      const poolSpaExtras = all.filter(
        item =>
          (item.detailTitle?.toLowerCase().includes("pool") ||
           item.detailTitle?.toLowerCase().includes("spa")) &&
          !featured.some(f => f.id === item.id)
      );

      setServices([...featured, ...poolSpaExtras]);
    } catch (err) {
      console.error("Failed to fetch service details!", err);
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitReservation = async (service, formData, selectedDate, selectedSlot) => {
    try {
      const reservationPayload = {
        reservationID: 0,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        reservationDate: selectedDate,
        timeSlot: selectedSlot,
        hotelServiceDetailID: service.id,
        hotelServiceName: service.detailTitle,
        reservationStatusID: 1,
        createdAt: new Date().toISOString(),
        serviceReceptionistId: 1,
        receptionistFirstName: "Erblina",
        receptionistLastName: "Kadriu",
        receptionistEmail: "erblina@gmail.com"
      };

      const response = await axios.post(
        'https://localhost:7117/api/HotelServiceReservation/CreateReservation',
        reservationPayload,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        setConfirmation('Reservation submitted successfully!');
        setTimeout(() => setActiveForm(null), 1500);
      } else {
        setConfirmation('Failed to submit reservation.');
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setConfirmation('Error submitting reservation. Please try again.');
    }
  };

  const handleSubmit = (e, service) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setConfirmation('Please select date and time slot.');
      return;
    }
    submitReservation(service, formData, selectedDate, selectedSlot);
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div
        className="d-flex align-items-center justify-content-center text-center text-white"
        style={{
          backgroundImage: `url('https://localhost:7117/Images/Services/${HeroImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '70vh'
        }}
      >
        <div className="p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <h1 className="display-4 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {HeroTitle}
          </h1>
          <p className="lead">{HeroDescription}</p>
        </div>
      </div>

      {/* Services Section */}
      <div className="container py-5">
        {services.map((section, idx) => (
          <div
            key={section.id}
            className={`row align-items-center mb-5 ${idx % 2 !== 0 ? 'flex-md-row-reverse' : ''}`}
          >
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="border border-4 rounded shadow-sm p-1 bg-white">
                <img
                  src={`https://localhost:7117/Images/Services/${section.detailImage}`}
                  alt={section.detailTitle}
                  className="img-fluid rounded"
                />
              </div>
            </div>
            <div className="col-md-6" ref={el => formRefs.current[idx] = el}>
              <h3 className="text-dark">{section.detailTitle}</h3>
              <p className="text-muted">{section.detailDescription}</p>
              <p className="fw-semibold mt-2">
                Price: <span className="text-primary">{section.price}</span>
              </p>
              <button className="btn btn-dark" onClick={() => openForm(idx)}>Reserve</button>

              {activeForm === idx && (
                <form onSubmit={(e) => handleSubmit(e, section)} className="border mt-4 p-4 rounded bg-light">
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
      </div>
    </div>
  );
};

export default PoolSpa;

