import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReviewsPage from './pages/ReviewPage';
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import CleaningManagerDashboard from './pages/dashboards/cleaningdashboards/CleaningManagerDashboard';
import AssignmentsDashboard from './pages/dashboards/cleaningdashboards/AssignmentsDashboard';
import CleaningStaffDashboard from './pages/dashboards/cleaningdashboards/CleaningStaffDashboard';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Axios token interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (!allowedRoles.includes(userRole)) return <Navigate to="/login" />;
    return children;
  } catch {
    return <Navigate to="/login" />
  }
};

function App() {
  return (
    <Router>
      <div>
        {/* Show Header except on login/signup */}
        {window.location.pathname !== "/login" && window.location.pathname !== "/signup" && <Header />}
        
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/header" element={<Header />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;

