import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import CleaningManagerDashboard from './pages/dashboards/cleaningdashboards/CleaningManagerDashboard';
import AssignmentsDashboard from './pages/dashboards/cleaningdashboards/AssignmentsDashboard';
import axios from 'axios';
import CleaningStaffDashboard from './pages/dashboards/cleaningdashboards/CleaningStaffDashboard';
import RoomManagerDashboard from './pages/dashboards/roomdashboards/RoomManagerDashboard'; 
import ReservationDashboard from './pages/dashboards/roomdashboards/ReservationDashboard';  
import RoomReceptionistDashboard from './pages/dashboards/roomdashboards/RoomRecepsionistDashboard';
import RoomRecepsionistManagement from './pages/dashboards/roomdashboards/RoomRecepsionistManagement'; 
import ServiceMain from './Components/Services/ServiceMain';
import RoomsPage from './pages/Rooms/RoomsPage';
import RoomCard from './pages/Rooms/RoomCard';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import RestaurantHostDashboard from './pages/dashboards/restaurantdashboards/RestaurantHostDashboard';
import RestaurantManagerDashboard from './pages/dashboards/restaurantdashboards/RestaurantManagerDashboard';
import RoomsDetails from './pages/Rooms/RoomsDetails';
import ReservationPage from './pages/Rooms/ReservationPage';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (!allowedRoles.includes(userRole)) return <Navigate to="/login" />;
    return children;
  } catch {
    return <Navigate to="/login" />;
  }
};

function App() {
  const token = localStorage.getItem('token');
  let currentUserId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
    } catch {
      currentUserId = null;
    }
  }

  return (
    <Router>
      <div>
        {window.location.pathname !== "/login" && window.location.pathname !== "/signup" && <Header />}

        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />

          {/* Public Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:roomId" element={<RoomsDetails />} />

          {/* NEW: Reservation Page route */}
<Route
  path="/reserve"
  element={
    <ProtectedRoute allowedRoles={['Admin', 'RoomManager', 'RoomRecepsionist', 'Customer']}>
      <ReservationPage />
    </ProtectedRoute>
  }
/>



          {/* Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/room-manager-receptionist-management"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'RoomManager']}>
                <RoomRecepsionistManagement currentUserId={currentUserId} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'RoomManager', 'RoomRecepsionist']}>
                <ReservationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/cleaning-staff"
            element={
              <ProtectedRoute allowedRoles={['CleaningManager']}>
                <CleaningManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/assignments"
            element={
              <ProtectedRoute allowedRoles={['CleaningManager']}>
                <AssignmentsDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cleaningstaff/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CleaningStaff']}>
                <CleaningStaffDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/room-dashboard"
            element={
              <ProtectedRoute allowedRoles={['RoomManager', 'Admin']}>
                <RoomManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reservation-dashboard"
            element={
              <ProtectedRoute allowedRoles={['RoomManager', 'Admin']}>
                <ReservationDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recepsionist-dashboard"
            element={
              <ProtectedRoute allowedRoles={['RoomRecepsionist', 'Admin']}>
                <RoomReceptionistDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/restaurant-manager/dashboard"
            element={
              <ProtectedRoute allowedRoles={['RestaurantManager']}>
                <RestaurantManagerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/host/dashboard"
            element={
              <ProtectedRoute allowedRoles={['RestaurantHost']}>
                <RestaurantHostDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
