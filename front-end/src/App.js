import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from "./pages/dashboards/AdminDashboard"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import CleaningManagerDashboard from './pages/dashboards/CleaningManagerDashboard';

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
            <Routes>
                <Route path="/" element={<Navigate to="/signup" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['Admin']}>
                            <AdminDashboard />
                            <CleaningManagerDashboard/>
                        </ProtectedRoute>
                    }
                />
                <Route path="/test-dashboard" element={<CleaningManagerDashboard />} />  
                {/* veq per testim */}
                
                            </Routes>
        </Router>
    );
}

export default App;
