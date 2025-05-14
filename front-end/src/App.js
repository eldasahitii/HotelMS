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
import RestaurantManagerDashboard from './pages/dashboards/restaurantdashboards/RestaurantManagerDashboard';
import RestaurantHostDashboard from './pages/dashboards/restaurantdashboards/RestaurantHostDashboard';


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

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');

    if(!token) return <Navigate to="/Login" />;

    try{
        const decoded = jwtDecode(token);
        const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        
        if (!allowedRoles.includes(userRole)) return <Navigate to="/Login" />;
        return children;
    }catch{
        return <Navigate to="/Login" />
    }
}

function App() {
    return (
        <Router>
            <div>
                {window.location.pathname !== "/login" && window.location.pathname !== "/signup" }
                
                <Routes>
                    <Route path="/" element={<Navigate to="/signup" />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                     <Route path='/header' element={<Header/>}/>
                     
                    
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

<Route
path="/restaurant-manager/dashboard"
element={
  <ProtectedRoute allowedRoles={['RestaurantManager']}>
    <RestaurantManagerDashboard/>
  </ProtectedRoute>
}

/>
<Route
path="/host/dashboard"
element={
  <ProtectedRoute allowedRoles={['RestaurantHost']}>
    <RestaurantHostDashboard/>
  </ProtectedRoute>
}
/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;

