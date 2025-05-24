// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import poolSpaImage from '../../Assets/images/PoolAndSpa.PNG';
// import EventsImage from '../../Assets/images/Events.jpg';

// const ServiceMain = () => {
//   const navigate = useNavigate();

//   const services = [
//     {
//       id: 1,
//       name: 'Pool & Spa',
//       description: 'Relax and unwind in our luxurious pool and spa facilities.',
//       imageUrl: poolSpaImage,
//       route: '/services/pool-spa'
//     },
//     {
//       id: 2,
//       name: 'Events',
//       description: 'Book venues for weddings, conferences, and special occasions.',
//       imageUrl: EventsImage,
//       route: '/services/events'
//     }
//   ];

//   return (
//     <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh' }}>
//       {/* Hero Section */}
//       <div className="text-center py-5" style={{ backgroundColor: '#EADBC8' }}>
//         <h1
//           className="display-4 fw-bold"
//           style={{ color: '#6D4C41', fontFamily: "'Playfair Display', serif" }}
//         >
//           Welcome to Hotel Services
//         </h1>
//         <p className="lead" style={{ color: '#5D4037' }}>
//           Discover elegance, comfort, and premium hospitality tailored just for you.
//         </p>
//       </div>

//       {/* Service Cards Section */}
//       <div className="container py-5">
//         <h2 className="text-center mb-5" style={{ color: '#6D4C41' }}>Our Featured Services</h2>
//         <div className="row">
//           {services.map(service => (
//             <div className="col-md-6 mb-5" key={service.id}>
//               <div className="card h-100 border-0 shadow-sm" style={{ backgroundColor: '#EADBC8' }}>
//                 <img src={service.imageUrl} className="card-img-top" alt={service.name} />
//                 <div className="card-body">
//                   <h5 className="card-title" style={{ color: '#3E2723' }}>{service.name}</h5>
//                   <p className="card-text" style={{ color: '#5D4037' }}>{service.description}</p>
//                   <button
//                     className="btn"
//                     style={{ backgroundColor: '#A0522D', color: '#fff' }}
//                     onClick={() => navigate('/services/pool-spa')}
//                   >
//                     View {service.name}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer CTA */}
//       <div className="text-center py-4" style={{ backgroundColor: '#EADBC8' }}>
//         <h4 className="mb-3" style={{ color: '#6D4C41' }}>Looking for more?</h4>
//         <p className="text-muted mb-4">Visit our front desk or contact the concierge for exclusive offerings.</p>
//         <p className="text-muted small">© 2025 Hotel Management System</p>
//       </div>
//     </div>
//   );
// };

// export default ServiceMain;



// // src/components/HotelServices/ServiceMain.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import poolSpaImage from '../../Assets/images/PoolAndSpa.PNG';
// import EventsImage from '../../Assets/images/Events.jpg';



// const ServiceMain = () => {
//   const navigate = useNavigate();

//   const services = [
//     {
//       id: 1,
//       name: 'Pool & Spa',
//       description: 'Relax and unwind in our luxurious pool and spa facilities.',
//       imageUrl: poolSpaImage,
//       route: '/services/pool-spa'
//     },
//     {
//       id: 2,
//       name: 'Events',
//       description: 'Book venues for weddings, conferences, and special occasions.',
//       imageUrl: EventsImage,
//       route: '/services/events'
//     }
//   ];

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">Hotel Services</h2>
//       <div className="row">
//         {services.map(service => (
//           <div className="col-md-6 mb-4" key={service.id}>
//             <div className="card shadow-sm">
//               <img src={service.imageUrl} className="card-img-top" alt={service.name} />
//               <div className="card-body">
//                 <h5 className="card-title">{service.name}</h5>
//                 <p className="card-text">{service.description}</p>
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => navigate(service.route)}
//                 >
//                   View {service.name}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ServiceMain;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import poolSpaImage from '../../Assets/images/PoolAndSpa.PNG';
import EventsImage from '../../Assets/images/Events.jpg';
import heroImage from '../../Assets/images/hotelpool.PNG'; // Add a high-quality hero image

const ServiceMain = () => {
  const navigate = useNavigate();

  const framedImageStyle = {
    border: '8px solid white',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    padding: '4px',
    backgroundColor: '#f8f8f8',
    borderRadius: '4px'
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '2rem' }}>
          <h1 className="display-4 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome to Hotel Services
          </h1>
          <p className="lead">
            Discover elegance, comfort, and premium hospitality tailored just for you.
          </p>
        </div>
      </div>

      {/* Pool & Spa Section */}
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <div style={framedImageStyle}>
              <img src={poolSpaImage} className="img-fluid" alt="Pool and Spa" />
            </div>
          </div>
          <div className="col-md-6">
            <h2 style={{ color: '#333' }}>Pool & Spa</h2>
            <p className="text-muted">
              Relax and unwind in our luxurious pool and spa facilities.
            </p>
            <button
              className="btn btn-dark"
              onClick={() => navigate('/services/pool-spa')}
            >
              See More
            </button>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="container py-5">
        <div className="row align-items-center flex-md-row-reverse">
          <div className="col-md-6 mb-4 mb-md-0">
            <div style={framedImageStyle}>
              <img src={EventsImage} className="img-fluid" alt="Events" />
            </div>
          </div>
          <div className="col-md-6">
            <h2 style={{ color: '#333' }}>Events</h2>
            <p className="text-muted">
              Book venues for weddings, conferences, and special occasions.
            </p>
            <button
              className="btn btn-dark"
              onClick={() => navigate('/services/event-page')}
            >
              See More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 bg-light text-muted">
        <p className="mb-1">
          Looking for more? Visit our front desk or contact the concierge for exclusive offerings.
        </p>
        <small>© 2025 Hotel Management System</small>
      </footer>
    </div>
  );
};

export default ServiceMain;