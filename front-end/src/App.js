import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReviewsPage from './pages/ReviewPage'; // or correct path

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/signup" />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reviews" element={<ReviewsPage />} />

            </Routes>
        </Router>
    );
}

export default App;
