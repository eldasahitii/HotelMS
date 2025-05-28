import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
// Static imports (not lazy)
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import RoomManagerDashboard from './pages/dashboards/roomdashboards/RoomManagerDashboard';
import ReservationDashboard from './pages/dashboards/roomdashboards/ReservationDashboard';
import RoomReceptionistDashboard from './pages/dashboards/roomdashboards/RoomRecepsionistDashboard';
import RoomRecepsionistManagement from './pages/dashboards/roomdashboards/RoomRecepsionistManagement';
import RoomsPage from './pages/Rooms/RoomsPage';
import RoomsDetails from './pages/Rooms/RoomsDetails';
import ReservationPage from './pages/Rooms/ReservationPage';
import RestaurantHostDashboard from './pages/dashboards/restaurantdashboards/RestaurantHostDashboard';
import RestaurantManagerDashboard from './pages/dashboards/restaurantdashboards/RestaurantManagerDashboard';

// Lazy imports
const CleaningManagerDashboard = lazy(() => import('./pages/dashboards/cleaningdashboards/CleaningManagerDashboard'));
const AssignmentsDashboard = lazy(() => import('./pages/dashboards/cleaningdashboards/AssignmentsDashboard'));
const CleaningStaffDashboard = lazy(() => import('./pages/dashboards/cleaningdashboards/CleaningStaffDashboard'));


// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
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
      <div>
       {window.location.pathname === "/signup" && <Header />}
        <Suspense fallback={<div className="text-center mt-5">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:roomId" element={<RoomsDetails />} />

            <Route path="/reserve" element={
              <ProtectedRoute allowedRoles={['Admin', 'RoomManager', 'RoomRecepsionist', 'Customer']}>
                <ReservationPage />
              </ProtectedRoute>
            } />

            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }/>

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

            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
