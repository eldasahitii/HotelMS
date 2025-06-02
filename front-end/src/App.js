import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { AuthProvider } from './Context/AuthContext'; //  import context
import Header from './Components/Header';
import Footer from './Components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AboutUs from './pages/AboutUs';
import AssignmentsDashboard from './pages/dashboards/cleaningdashboards/AssignmentsDashboard';
import RoomManagerDashboard from './pages/dashboards/roomdashboards/managerdashboards/RoomManagerDashboard'; 
import ReservationDashboard from './pages/dashboards/roomdashboards/managerdashboards/ReservationDashboard';  
import RoomReceptionistDashboard from './pages/dashboards/roomdashboards/recpsionistdashboards/RoomRecepsionistDashboard';
import RoomRecepsionistManagement from './pages/dashboards/roomdashboards/managerdashboards/RoomRecepsionistManagement';
import RoomsPage from './pages/Rooms/RoomsPage';
import RoomsDetails from './pages/Rooms/RoomsDetails';
import ReservationPage from './pages/Rooms/ReservationPage';
import RecepsionistReservationDashboard from './pages/dashboards/roomdashboards/recpsionistdashboards/RecepsionistReservationDashboard';
import AdminRoomTypeDashboard from './pages/dashboards/admindashboard/RoomAdmin/AdminRoomType';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AdminAddManager from './pages/dashboards/admindashboard/AdminAddManager';
import ReviewDashboard from './pages/dashboards/roomdashboards/managerdashboards/ReviewDashboard';
import RestaurantHomePage from './pages/restaurant/RestaurantHomePage';
import RestaurantMenuPage from './pages/restaurant/RestaurantMenuPage';
import RestaurantAdmin from './pages/dashboards/admindashboard/RestaurantAdmin/AdminRestaurant';
import AdminRoomStatus from './pages/dashboards/admindashboard/AdminRoomStatus';
import AdminRoomReservationStatus from './pages/dashboards/admindashboard/AdminReservationStatus';
import UserInfo from './pages/dashboards/userdashboard/UserInfo';
import UserRoomReservations from './pages/dashboards/userdashboard/UserRoomReservations';
import ServiceMain from './Components/Services/ServiceMain';
import PoolSpaPage from './Components/Services/PoolSpaPage';
import EventsPage from './Components/Services/EventsPage';
import ServiceManagerDashboard from './pages/dashboards/servicedashboard/servicemanagerdashboard';
import ServiceRecepcionist from './pages/dashboards/servicedashboard/servicerecepcionist';
import ServiceDetailManagerDashboard from './pages/dashboards/servicedashboard/servicedetailmanagerdashboard.jsx';
import ServiceManagerReservationDashboard from './pages/dashboards/servicedashboard/servicemanagerreservationdashboard.jsx';
import HomePage from './pages/HomePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CleaningManagerDashboard = lazy(() => import('./pages/dashboards/cleaningdashboards/CleaningManagerDashboard'));
const CleaningStaffDashboard = lazy(() => import('./pages/dashboards/cleaningdashboards/CleaningStaffDashboard'));
const RestaurantManagerDashboard = lazy(() => import('./pages/dashboards/restaurantdashboards/RestaurantManagerDashboard'));
const RestaurantHostDashboard = lazy(() => import('./pages/dashboards/restaurantdashboards/RestaurantHostDashboard'));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [authorized, setAuthorized] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('https://localhost:7117/api/Auth/me', {
          withCredentials: true
        });
        const role = res.data.role;
        setAuthorized(allowedRoles.includes(role));
      } catch {
        setAuthorized(false);
      }
    };
    checkAuth();
  }, [allowedRoles]);

  if (authorized === null) return <div className="text-center mt-5">Loading...</div>;
  if (!authorized) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          {!["/login"].includes(window.location.pathname) && <Header />}
          <ToastContainer position="top-right" autoClose={4000} />

          <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/homepage" />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:roomId" element={<RoomsDetails />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/room-manager/review-dashboard" element={<ReviewDashboard />} />
              <Route path="/restaurant" >
                <Route index element={<RestaurantHomePage />} />
                <Route path="menu" element={<RestaurantMenuPage />} />
              </Route>

              <Route path="/reserve" element={
                <ProtectedRoute allowedRoles={['Admin', 'RoomManager', 'RoomRecepsionist', 'Customer']}>
                  <ReservationPage />
                </ProtectedRoute>
              } />

              <Route path="/room-manager-receptionist-management" element={
                <ProtectedRoute allowedRoles={['Admin', 'RoomManager']}>
                  <RoomRecepsionistManagement />
                </ProtectedRoute>
              }/>

              <Route path="/reservations" element={
                <ProtectedRoute allowedRoles={['Admin', 'RoomManager', 'RoomRecepsionist']}>
                  <ReservationPage />
                </ProtectedRoute>
              }/>

              <Route path="/manager/cleaning-staff" element={
                <ProtectedRoute allowedRoles={['CleaningManager']}>
                  <CleaningManagerDashboard />
                </ProtectedRoute>
              }/>

              <Route path="/manager/assignments" element={
                <ProtectedRoute allowedRoles={['CleaningManager']}>
                  <AssignmentsDashboard />
                </ProtectedRoute>
              }/>

              <Route path="/cleaningstaff/dashboard" element={
                <ProtectedRoute allowedRoles={['CleaningStaff']}>
                  <CleaningStaffDashboard />
                </ProtectedRoute>
              }/>

              <Route path="/manager/room-dashboard" element={
                <ProtectedRoute allowedRoles={['RoomManager', 'Admin']}>
                  <RoomManagerDashboard />
                </ProtectedRoute>
              }/>

              <Route path="/admin/reservation-dashboard" element={
                <ProtectedRoute allowedRoles={['RoomManager', 'Admin']}>
                  <ReservationDashboard />
                </ProtectedRoute>
              }/>

              <Route path="/recepsionist-dashboard" element={
                <ProtectedRoute allowedRoles={['RoomRecepsionist', 'Admin']}>
                  <RoomReceptionistDashboard />
                </ProtectedRoute>
              }/>

              <Route path="/restaurant-manager/dashboard" element={
                <ProtectedRoute allowedRoles={['RestaurantManager']}>
                  <RestaurantManagerDashboard />
                </ProtectedRoute>
              }/>

              <Route path="/host/dashboard" element={
                <ProtectedRoute allowedRoles={['RestaurantHost']}>
                  <RestaurantHostDashboard />
                </ProtectedRoute>
              }/>

              <Route path="/recepsionist-reservations" element={
                <ProtectedRoute allowedRoles={['RoomRecepsionist', 'Admin']}>
                  <RecepsionistReservationDashboard />
                </ProtectedRoute>
              }/>

              <Route path="/admin/room-types" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminRoomTypeDashboard />
                </ProtectedRoute>
              }/>

              <Route path="/admin/add-manager" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminAddManager />
                </ProtectedRoute>
              }/>

              <Route path="/admin/roomstatus" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminRoomStatus />
                </ProtectedRoute>
              }/>

              <Route path="/admin/reservationstatus" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminRoomReservationStatus />
                </ProtectedRoute>
              }/>

              <Route path="/user/profile" element={
                <ProtectedRoute allowedRoles={['Customer']}>
                  <UserInfo />
                </ProtectedRoute>
              }/>

              <Route path="/user/userroomreservation" element={
                <ProtectedRoute allowedRoles={['Customer']}>
                  <UserRoomReservations />
                </ProtectedRoute>
              }/>

              <Route path="/admin/restaurant-dashboard" element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <RestaurantAdmin />
                </ProtectedRoute>
              }/>

              <Route path="/services" element={
                <ProtectedRoute allowedRoles={['Admin', 'ServiceManager', 'Recepcionist']}>
                  <ServiceMain />
                </ProtectedRoute>
              }/>

              <Route path="/services/pool-spa" element={
                <ProtectedRoute allowedRoles={['Admin', 'ServiceManager', 'Receptionist']}>
                  <PoolSpaPage />
                </ProtectedRoute>
              }/>

              <Route path="/services/event-page" element={
                <ProtectedRoute allowedRoles={['Admin', 'ServiceManager', 'Receptionist']}>
                  <EventsPage />
                </ProtectedRoute>
              }/>

              <Route
  path="/service-manager/dashboard"
  element={
    <ProtectedRoute allowedRoles={['ServiceManager']}>
      <ServiceManagerDashboard />
    </ProtectedRoute>
  }
/>

 <Route
  path="/service-manager/service-recepcionist"
  element={
    <ProtectedRoute allowedRoles={['ServiceRecepsionist']}>
      <ServiceRecepcionist />
    </ProtectedRoute>
  }
/>


              <Route
              path="/service-manager/service-details"
              element={
             <ProtectedRoute allowedRoles={['ServiceManager']}>
             <ServiceDetailManagerDashboard />
             </ProtectedRoute>
             }
            />

            <Route
  path="/service-manager/reservations"
  element={
    <ProtectedRoute allowedRoles={["HotelServiceManager"]}>
      <ServiceManagerReservationDashboard />
    </ProtectedRoute>
  }
/>


              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
// import React, { Suspense, lazy } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import axios from 'axios';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
// import { AuthProvider } from './Context/AuthContext'; //  import context
// import Header from './Components/Header';
// import Footer from './Components/Footer';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import AboutUs from './pages/AboutUs';
// import AssignmentsDashboard from './pages/dashboards/cleaningdashboards/AssignmentsDashboard';
// import RoomManagerDashboard from './pages/dashboards/roomdashboards/managerdashboards/RoomManagerDashboard'; 
// import ReservationDashboard from './pages/dashboards/roomdashboards/managerdashboards/ReservationDashboard';  
// import RoomReceptionistDashboard from './pages/dashboards/roomdashboards/recpsionistdashboards/RoomRecepsionistDashboard';
// import RoomRecepsionistManagement from './pages/dashboards/roomdashboards/managerdashboards/RoomRecepsionistManagement';
// import RoomsPage from './pages/Rooms/RoomsPage';
// import RoomsDetails from './pages/Rooms/RoomsDetails';
// import ReservationPage from './pages/Rooms/ReservationPage';
// import RecepsionistReservationDashboard from './pages/dashboards/roomdashboards/recpsionistdashboards/RecepsionistReservationDashboard';
// import AdminRoomTypeDashboard from './pages/dashboards/admindashboard/RoomAdmin/AdminRoomType';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import AdminAddManager from './pages/dashboards/admindashboard/AdminAddManager';
// import ReviewDashboard from './pages/dashboards/roomdashboards/managerdashboards/ReviewDashboard';
// import RestaurantHomePage from './pages/restaurant/RestaurantHomePage';
// import RestaurantMenuPage from './pages/restaurant/RestaurantMenuPage';
// import RestaurantAdmin from './pages/dashboards/admindashboard/RestaurantAdmin/AdminRestaurant';
// import AdminRoomStatus from './pages/dashboards/admindashboard/AdminRoomStatus';
// import AdminRoomReservationStatus from './pages/dashboards/admindashboard/AdminReservationStatus';
// import UserInfo from './pages/dashboards/userdashboard/UserInfo';
// import UserRoomReservations from './pages/dashboards/userdashboard/UserRoomReservations';
// import HomePage from './pages/HomePage';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const CleaningManagerDashboard = lazy(() => import('./pages/dashboards/cleaningdashboards/CleaningManagerDashboard'));
// const CleaningStaffDashboard = lazy(() => import('./pages/dashboards/cleaningdashboards/CleaningStaffDashboard'));
// const RestaurantManagerDashboard = lazy(() => import('./pages/dashboards/restaurantdashboards/RestaurantManagerDashboard'));
// const RestaurantHostDashboard = lazy(() => import('./pages/dashboards/restaurantdashboards/RestaurantHostDashboard'));

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const [authorized, setAuthorized] = React.useState(null);

//   React.useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get('https://localhost:7117/api/Auth/me', {
//           withCredentials: true
//         });
//         const role = res.data.role;
//         setAuthorized(allowedRoles.includes(role));
//       } catch {
//         setAuthorized(false);
//       }
//     };
//     checkAuth();
//   }, [allowedRoles]);

//   if (authorized === null) return <div className="text-center mt-5">Loading...</div>;
//   if (!authorized) return <Navigate to="/login" />;
//   return children;
// };

// function App() {
//   return (
    
//     <Router>
//       <AuthProvider> {/*  Wrap the whole app */}
//         <div>
//           {!["/login"].includes(window.location.pathname) && <Header />}
//      <ToastContainer position="top-right" autoClose={4000} />

//           <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
//             <Routes>
//               <Route path="/" element={<Navigate to="/homepage" />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/rooms" element={<RoomsPage />} />
//               <Route path="/rooms/:roomId" element={<RoomsDetails />} />
//               <Route path="/about" element={<AboutUs />} />
//               <Route path="/homepage" element={<HomePage />} />
//               <Route path="/room-manager/review-dashboard" element={<ReviewDashboard />} />
//               <Route path="/restaurant" >
//                 <Route index element={<RestaurantHomePage />} />
//                 <Route path="menu" element={<RestaurantMenuPage />} />
//               </Route>

//             {/* Room Reservation route */}
//             <Route path="/reserve" element={
// <ProtectedRoute allowedRoles={['Admin', 'RoomManager', 'RoomRecepsionist', 'Customer']}>
//   <ReservationPage />
// </ProtectedRoute>
//             } />

//               <Route path="/room-manager-receptionist-management" element={
//                 <ProtectedRoute allowedRoles={['Admin', 'RoomManager']}>
//                   <RoomRecepsionistManagement />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/reservations" element={
//                 <ProtectedRoute allowedRoles={['Admin', 'RoomManager', 'RoomRecepsionist']}>
//                   <ReservationPage />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/manager/cleaning-staff" element={
//                 <ProtectedRoute allowedRoles={['CleaningManager']}>
//                   <CleaningManagerDashboard />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/manager/assignments" element={
//                 <ProtectedRoute allowedRoles={['CleaningManager']}>
//                   <AssignmentsDashboard />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/cleaningstaff/dashboard" element={
//                 <ProtectedRoute allowedRoles={['CleaningStaff']}>
//                   <CleaningStaffDashboard />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/manager/room-dashboard" element={
//                 <ProtectedRoute allowedRoles={['RoomManager', 'Admin']}>
//                   <RoomManagerDashboard />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/admin/reservation-dashboard" element={
//                 <ProtectedRoute allowedRoles={['RoomManager', 'Admin']}>
//                   <ReservationDashboard />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/recepsionist-dashboard" element={
//                 <ProtectedRoute allowedRoles={['RoomRecepsionist', 'Admin']}>
//                   <RoomReceptionistDashboard />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/restaurant-manager/dashboard" element={
//                 <ProtectedRoute allowedRoles={['RestaurantManager']}>
//                   <RestaurantManagerDashboard />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/host/dashboard" element={
//                 <ProtectedRoute allowedRoles={['RestaurantHost']}>
//                   <RestaurantHostDashboard />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/recepsionist-reservations" element={
//                 <ProtectedRoute allowedRoles={['RoomRecepsionist', 'Admin']}>
//                   <RecepsionistReservationDashboard />
//                 </ProtectedRoute>
//               }/>

//               <Route path="/admin/room-types" element={
//                 <ProtectedRoute allowedRoles={['Admin']}>
//                   <AdminRoomTypeDashboard />
//                 </ProtectedRoute>
//               }/>

//            <Route
//              path="/admin/add-manager"
//              element={
//             <ProtectedRoute allowedRoles={['Admin']}>
//             <AdminAddManager />
//             </ProtectedRoute>
//   }
// />
//            <Route
//              path="/admin/roomstatus"
//              element={
//             <ProtectedRoute allowedRoles={['Admin']}>
//             <AdminRoomStatus />
//             </ProtectedRoute>
//   }
// />
//            <Route
//              path="/admin/reservationstatus"
//              element={
//             <ProtectedRoute allowedRoles={['Admin']}>
//             <AdminRoomReservationStatus />
//             </ProtectedRoute>
//   }
// />
//            <Route
//              path="/user/profile"
//              element={
//             <ProtectedRoute allowedRoles={['Customer']}>
//             <UserInfo />
//             </ProtectedRoute>
//   }
// />
//            <Route
//              path="/user/userroomreservation"
//              element={
//             <ProtectedRoute allowedRoles={['Customer']}>
//             <UserRoomReservations />
//             </ProtectedRoute>
//   }
// />
//               <Route path="/admin/restaurant-dashboard" element={
//                 <ProtectedRoute allowedRoles={['Admin']}>
//                   <RestaurantAdmin />
//                 </ProtectedRoute>
//               }/>

//               <Route path="*" element={<div>Page Not Found</div>} />
//             </Routes>
//           </Suspense>
//           <Footer />
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// }

// export default App;