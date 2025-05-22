import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import CleaningManagerDashboard from './pages/dashboards/cleaningdashboards/CleaningManagerDashboard';
import AssignmentsDashboard from './pages/dashboards/cleaningdashboards/AssignmentsDashboard';
import axios from 'axios';
import CleaningStaffDashboard from './pages/dashboards/cleaningdashboards/CleaningStaffDashboard';
import RoomManagerDashboard from './pages/dashboards/roomdashboards/RoomManagerDashboard'; 
import ReservationDashboard from './pages/dashboards/roomdashboards/ReservationDashboard';  
import RoomReceptionistDashboard from './pages/dashboards/roomdashboards/RoomRecepsionistDashboard';
import RoomRecepsionistManagement from './pages/dashboards/roomdashboards/RoomRecepsionistManagement'; 
import RoomsPage from './pages/Rooms/RoomsPage';
import RoomsDetails from './pages/Rooms/RoomsDetails';
import ReservationPage from './pages/Rooms/ReservationPage';
import RestaurantHostDashboard from './pages/dashboards/restaurantdashboards/RestaurantHostDashboard';
import RestaurantManagerDashboard from './pages/dashboards/restaurantdashboards/RestaurantManagerDashboard';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { useEffect, useState } from 'react';
import React from 'react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('https://localhost:7117/api/Auth/me', {
          withCredentials: true
        });
        const role = res.data.role;
        if (allowedRoles.includes(role)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch {
        setAuthorized(false);
      }
    };
    checkAuth();
  }, [allowedRoles]);

  if (authorized === null) return null; // You can add a loading spinner
  if (authorized === false) return <Navigate to="/login" />;
  return children;
};

// New ProtectedRoute that also passes userId as a prop to children
const ProtectedRouteWithUserId = ({ children, allowedRoles }) => {
  const [authorized, setAuthorized] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('https://localhost:7117/api/Auth/me', {
          withCredentials: true
        });
        const role = res.data.role;
        const id = res.data.userId;
        if (allowedRoles.includes(role)) {
          setAuthorized(true);
          setUserId(id);
        } else {
          setAuthorized(false);
        }
      } catch {
        setAuthorized(false);
      }
    };
    checkAuth();
  }, [allowedRoles]);

  if (authorized === null) return null; // You can add a loading spinner
  if (authorized === false) return <Navigate to="/login" />;
  
  // Pass userId as prop named currentUserId to the child component
  return React.cloneElement(children, { currentUserId: userId });
};

function App() {
  return (
    <Router>
      <div>
        {window.location.pathname !== "/login" && window.location.pathname !== "/signup" && <Header />}

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

          {/* UPDATED ROUTE: Pass userId prop here */}
          <Route path="/room-manager-receptionist-management" element={
            <ProtectedRouteWithUserId allowedRoles={['Admin', 'RoomManager']}>
              <RoomRecepsionistManagement />
            </ProtectedRouteWithUserId>
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
      </div>
    </Router>
  );
}

export default App;
