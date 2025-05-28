import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Static imports
import Login from './pages/Login';
import Signup from './pages/Signup';
import AboutUs from './pages/AboutUs';
import RoomsPage from './pages/Rooms/RoomsPage';
import RoomsDetails from './pages/Rooms/RoomsDetails';
import ReservationPage from './pages/Rooms/ReservationPage';
import AssignmentsDashboard from './pages/dashboards/cleaningdashboards/AssignmentsDashboard';
import RoomManagerDashboard from './pages/dashboards/roomdashboards/managerdashboards/RoomManagerDashboard';
import ReservationDashboard from './pages/dashboards/roomdashboards/managerdashboards/ReservationDashboard';
import RoomRecepsionistManagement from './pages/dashboards/roomdashboards/managerdashboards/RoomRecepsionistManagement';
import RoomReceptionistDashboard from './pages/dashboards/roomdashboards/recpsionistdashboards/RoomRecepsionistDashboard';
import RecepsionistReservationDashboard from './pages/dashboards/roomdashboards/recpsionistdashboards/RecepsionistReservationDashboard';
import RestaurantHostDashboard from './pages/dashboards/restaurantdashboards/RestaurantHostDashboard';
import RestaurantManagerDashboard from './pages/dashboards/restaurantdashboards/RestaurantManagerDashboard';
import AdminRoomTypeDashboard from './pages/dashboards/admindashboard/RoomAdmin/AdminRoomType';
import AdminAddManager from './pages/dashboards/admindashboard/AdminAddManager';

// Lazy imports
const CleaningManagerDashboard = lazy(() => import('./pages/dashboards/cleaningdashboards/CleaningManagerDashboard'));
const CleaningStaffDashboard = lazy(() => import('./pages/dashboards/cleaningdashboards/CleaningStaffDashboard'));

// Axios token interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  try {
    const decoded = jwtDecode(token);
    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return allowedRoles.includes(role) ? children : <Navigate to="/login" />;
  } catch {
    return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <Router>
      <div>
        {window.location.pathname !== "/login" && window.location.pathname !== "/signup" && <Header />}

        <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutUs />} />

            {/* Rooms */}
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:roomId" element={<RoomsDetails />} />

            <Route path="/reserve" element={
              <ProtectedRoute allowedRoles={['Admin', 'RoomManager', 'RoomRecepsionist', 'Customer']}>
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

            <Route path="/room-manager-receptionist-management" element={
              <ProtectedRoute allowedRoles={['Admin', 'RoomManager']}>
                <RoomRecepsionistManagement />
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

            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;


