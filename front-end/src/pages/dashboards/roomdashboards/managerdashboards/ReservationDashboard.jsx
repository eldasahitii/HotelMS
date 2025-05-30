import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


const ReservationDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [reservationStatuses, setReservationStatuses] = useState([]);
  const [filterRoomType, setFilterRoomType] = useState('');
  const [filterReservationStatus, setFilterReservationStatus] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'https://localhost:7117/api/RoomReservation',
    withCredentials: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('https://localhost:7117/api/Auth/me', { withCredentials: true });
        fetchReservations();
      } catch (error) {
        toast.error('You must be logged in to view reservations.');
        navigate('/login');
      }
    };
    checkAuth();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/GetAllReservations');
      const data = response.data.map((r) => ({
        reservationID: r.reservationID,
        roomTypeName: r.roomTypeName || 'Unknown',
        reservationStatusName: r.reservationStatusName || 'Unknown',
        checkInDate: r.checkInDate ? new Date(r.checkInDate).toLocaleDateString() : 'N/A',
        checkOutDate: r.checkOutDate ? new Date(r.checkOutDate).toLocaleDateString() : 'N/A',
        specialRequests: r.specialRequests || '',
      }));

      setReservations(data);
      setFilteredReservations(data);

      setRoomTypes([...new Set(data.map((r) => r.roomTypeName).filter(Boolean))]);
      setReservationStatuses([...new Set(data.map((r) => r.reservationStatusName).filter(Boolean))]);

      setMessage('');
    } catch (error) {
      console.error('Error fetching reservations:', error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.warn('Unauthorized. Please log in again.');
          navigate('/login');
        } else {
          toast.error(`Server error: ${error.response.status} ${error.response.statusText}`);
        }
      } else {
        toast.error('Network error or server not reachable.');

      }
    }
  };

  useEffect(() => {
    let filtered = reservations;
    if (filterRoomType) {
      filtered = filtered.filter(
        (r) => r.roomTypeName && r.roomTypeName.toLowerCase() === filterRoomType.toLowerCase()
      );
    }
    if (filterReservationStatus) {
      filtered = filtered.filter(
        (r) => r.reservationStatusName && r.reservationStatusName.toLowerCase() === filterReservationStatus.toLowerCase()
      );
    }
    setFilteredReservations(filtered);
  }, [filterRoomType, filterReservationStatus, reservations]);

  const handleLogout = async () => {
    try {
      await axios.post('https://localhost:7117/api/Auth/logout', null, { withCredentials: true });
    } catch {
      // ignore errors
    }
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <i className="bi bi-house-door me-2"></i> Reservation Managing
          </li>
          <button
            className="btn btn-outline-light w-100 mt-3 mb-3"
            onClick={() => navigate('/manager/room-dashboard')}
          >
            <i className="bi bi-bookmark-plus me-2"></i> Room Managing
          </button>
          <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/room-manager-receptionist-management")}
          >
            <i className="bi bi-person-lines-fill me-2"></i> Receptionist Management
          </button>
          <button className="btn btn-outline-light w-100 mt-2" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-house-door me-2"></i> Reservation Dashboard
        </h2>



        <div className="mb-3 d-flex gap-3">
          <select
            className="form-select"
            value={filterRoomType}
            onChange={(e) => setFilterRoomType(e.target.value)}
          >
            <option value="">All Room Types</option>
            {roomTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={filterReservationStatus}
            onChange={(e) => setFilterReservationStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            {reservationStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-house-door me-2"></i> Reservations List
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>Room Type</th>
                  <th>Status</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Requests</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((r) => (
                    <tr key={r.reservationID}>
                      <td>{r.roomTypeName}</td>
                      <td>{r.reservationStatusName}</td>
                      <td>{r.checkInDate}</td>
                      <td>{r.checkOutDate}</td>
                      <td>{r.specialRequests}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No reservations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationDashboard;
