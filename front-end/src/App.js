import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';  // <-- named import, correct for v4.x
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

// ProtectedRoute component to ensure role-based access
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
}

function App() {
  return (
    <Router>
      <div>
        {/* Only show Header if not on login or signup page */}
        {window.location.pathname !== "/login" && window.location.pathname !== "/signup" && <Header />}

        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/signup" />} />

          {/* Auth Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

           <Route path="/rooms" element={<RoomsPage />} />

  {/* Route for individual room card, e.g., /rooms/123 */}
  <Route path="/rooms/:roomId" element={<RoomCard />} />
  
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
      {
        (() => {
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
          return <RoomRecepsionistManagement currentUserId={currentUserId} />;
        })()
      }
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
            path="/manager/cleaning-staff"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
                <CleaningManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/assignments"
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
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

          {/* Fallback Route */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
