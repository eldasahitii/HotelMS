import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const ReservationDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [reservationStatuses, setReservationStatuses] = useState([]);
  const [filterRoomType, setFilterRoomType] = useState('');
  const [filterReservationStatus, setFilterReservationStatus] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let userRole = '';
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(atob(base64));
      userRole = decodedToken['role'] || '';
    } catch {
      userRole = '';
    }
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    let filtered = reservations;

    if (filterRoomType) {
      filtered = filtered.filter(r => r.roomTypeName === filterRoomType);
    }
    if (filterReservationStatus) {
      filtered = filtered.filter(r => r.reservationStatusName === filterReservationStatus);
    }

    setFilteredReservations(filtered);
  }, [filterRoomType, filterReservationStatus, reservations]);

  const fetchReservations = async () => {
    if (!token) return;
    try {
      const response = await axios.get(
        'https://localhost:7117/api/RoomReservation/GetAllReservations',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const normalizedData = response.data.map(r => ({
        reservationID: r.reservationID,
        roomID: r.roomID,
        roomTypeName: r.roomTypeName || '',
        roomStatusName: r.roomStatusName || '',
        reservationStatusName: r.reservationStatusName || '',
        checkInDate: r.checkInDate ? new Date(r.checkInDate).toLocaleDateString() : '',
        checkOutDate: r.checkOutDate ? new Date(r.checkOutDate).toLocaleDateString() : '',
        specialRequests: r.specialRequests || '',
      }));

      setReservations(normalizedData);

      const types = [...new Set(normalizedData.map(r => r.roomTypeName).filter(Boolean))];
      const statuses = [...new Set(normalizedData.map(r => r.reservationStatusName).filter(Boolean))];

      setRoomTypes(types);
      setReservationStatuses(statuses);
      setFilteredReservations(normalizedData);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!token) return;

    const isConfirmed = window.confirm('Are you sure you want to cancel this reservation?');
    if (!isConfirmed) return;

    try {
      const endpoint =
        userRole === 'Customer'
          ? `https://localhost:7117/api/RoomReservation/CancelReservationUser?id=${id}`
          : `https://localhost:7117/api/RoomReservation/staffCancelReservation?id=${id}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchReservations();
      setMessage('Reservation cancelled successfully.');
      setMessageType('success');
    } catch (error) {
      console.error('Error cancelling reservation:', error.response?.data || error.message);
      setMessage('Failed to cancel reservation.');
      setMessageType('danger');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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
            <i className="bi bi-house-door me-2"></i> ReservationManaging
          </li>
<button
  className="btn btn-outline-light w-100 mt-3 mb-3"
  onClick={() => navigate('/manager/room-dashboard')}
>
  <i className="bi bi-bookmark-plus me-2"></i> Room Managing
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

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {/* Filters */}
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
            <option value="">All Reservation Statuses</option>
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
                  <th>Room Status</th>
                  <th>Reservation Status</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((reservation) => (
                    <tr key={reservation.reservationID}>
                      <td>{reservation.roomTypeName}</td>
                      <td>{reservation.roomStatusName}</td>
                      <td>{reservation.reservationStatusName || 'N/A'}</td>
                      <td>{reservation.checkInDate}</td>
                      <td>{reservation.checkOutDate}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancelReservation(reservation.reservationID)}
                        >
                          <i className="bi bi-trash"></i> Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
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