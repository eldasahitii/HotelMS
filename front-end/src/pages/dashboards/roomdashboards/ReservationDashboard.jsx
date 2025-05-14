import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const ReservationDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({
    roomID: '',
    checkInDate: '',
    checkOutDate: '',
    status: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get('https://localhost:7117/api/RoomReservation/GetAllReservations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleAddReservation = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing');
      return;
    }
    if (!newReservation.roomID || !newReservation.checkInDate || !newReservation.checkOutDate || !newReservation.status) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedReservation = { ...newReservation };

    try {
      const response = await axios.post('https://localhost:7117/api/RoomReservation/MakeReservation', updatedReservation, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Reservation made successfully:', response.data);
      fetchReservations();
      setMessage('Reservation made successfully.');
      setMessageType('success');
    } catch (error) {
      console.error('Error making reservation:', error.response ? error.response.data : error.message);
      alert('An error occurred while making the reservation.');
    }
  };

  const handleCancelReservation = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const isConfirmed = window.confirm('Are you sure you want to cancel this reservation?');
    if (!isConfirmed) return;

    try {
      await axios.delete(`https://localhost:7117/api/RoomReservation/CancelReservationUser?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReservations();
      setMessage('Reservation cancelled successfully.');
      setMessageType('success');
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Failed to cancel reservation.');
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
            <i className="bi bi-house-door me-2"></i> ReservationManager
          </li>
          <button className="btn btn-outline-light w-100 mt-3 mb-3" onClick={() => navigate('/admin/room-manager-dashboard')}>
            <i className="bi bi-house-door me-2"></i> Room Manager
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

        <div className="card mb-4">
          <div className="card-header bg-success text-white">
            <i className="bi bi-house-door me-2"></i> Make Reservation
          </div>
          <div className="card-body">
            <input className="form-control mb-2" placeholder="Room ID" value={newReservation.roomID} onChange={(e) => setNewReservation({ ...newReservation, roomID: e.target.value })} />
            <input className="form-control mb-2" type="date" placeholder="Check-In Date" value={newReservation.checkInDate} onChange={(e) => setNewReservation({ ...newReservation, checkInDate: e.target.value })} />
            <input className="form-control mb-2" type="date" placeholder="Check-Out Date" value={newReservation.checkOutDate} onChange={(e) => setNewReservation({ ...newReservation, checkOutDate: e.target.value })} />
            <select className="form-control mb-2" value={newReservation.status} onChange={(e) => setNewReservation({ ...newReservation, status: e.target.value })}>
              <option value="">Select Reservation Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
            </select>

            <button className="btn btn-success w-100" onClick={handleAddReservation}>
              <i className="bi bi-check-circle me-2"></i> Make Reservation
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-house-door me-2"></i> Reservations List
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>Room ID</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.reservationID}>
                    <td>{reservation.roomID}</td>
                    <td>{reservation.checkInDate}</td>
                    <td>{reservation.checkOutDate}</td>
                    <td>{reservation.status}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleCancelReservation(reservation.reservationID)}>
                        <i className="bi bi-trash"></i> Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReservationDashboard;
