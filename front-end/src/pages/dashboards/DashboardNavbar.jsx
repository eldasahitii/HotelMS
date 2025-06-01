// import React from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';

// export default function DashboardNavbar({ role }) {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const navLinkStyle = (path) =>
//     `nav-link px-3 fw-semibold fs-6 ${
//       location.pathname === path ? 'text-dark border-bottom border-2 border-dark' : 'text-secondary'
//     }`;

//   // Define dashboard links per role
//   const dashboardLinks = {
//     CleaningManager: [
//       { path: "/manager/cleaning-staff", label: "Cleaning Staff" },
//       { path: "/manager/assignments", label: "Assignments" },
//     ],
//   RoomManager: [
//     { path: "/manager/room-dashboard", label: "Room Dashboard" },
//     { path: "/admin/reservation-dashboard", label: "Room Reservations" },
//     { path: "room-manager/review-dashboard", label: "Room Reviews" },
//     { path: "/room-manager-receptionist-management", label: "Manage Recepsionists" },
//   ],
//     RoomRecepsionist: [
//     { path: "/recepsionist-dashboard", label: "Room Availability Dashboard" },
//     { path: "/recepsionist-reservations", label: "Room Reservations" },
//   ],
//       Customer: [
//     { path: "/user/profile", label: "My Profile" },
//   ],
//     // Add other roles here...
//   };

//   const links = dashboardLinks[role] || [];

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom py-2">
//       <div className="container">
//         <Link to="/" className="navbar-brand fw-bold">
//           HotelMS Dashboard
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#dashboardNavbar"
//           aria-controls="dashboardNavbar"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="dashboardNavbar">
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             {links.map(({ path, label }) => (
//               <li className="nav-item" key={path}>
//                 <Link to={path} className={navLinkStyle(path)}>
//                   {label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//           <button className="btn btn-outline-danger" onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }
