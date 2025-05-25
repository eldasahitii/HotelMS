import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const RecepsionistReservationDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [reservationStatuses, setReservationStatuses] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filterRoomType, setFilterRoomType] = useState('');
  const [filterReservationStatus, setFilterReservationStatus] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [newReservation, setNewReservation] = useState({
    roomID: '',
    checkInDate: '',
    checkOutDate: '',
    specialRequests: '',
    customerUserID: '',
  });

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'https://localhost:7117/api/RoomReservation',
    withCredentials: true,
  });

  // Helper to show messages with auto-hide after 3 seconds
  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://localhost:7117/api/User/GetAllCustomers', {
        withCredentials: true,
      });
      setCustomers(res.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showMessage('Failed to load customers.', 'danger');
    }
  };

  // Fetch reservations and metadata
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/GetAllReservations');
      const data = res.data.map((r) => ({
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
    } catch (error) {
      console.error('Error fetching reservations:', error);
      if (error.response) {
        if (error.response.status === 401) {
          showMessage('Unauthorized. Please log in again.', 'danger');
          navigate('/login');
        } else {
          showMessage(`Server error: ${error.response.status} ${error.response.statusText}`, 'danger');
        }
      } else {
        showMessage('Network error or server not reachable.', 'danger');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        await axios.get('https://localhost:7117/api/Auth/me', { withCredentials: true });
        await fetchCustomers();
        await fetchReservations();
      } catch (error) {
        showMessage('You must be logged in to view reservations.', 'danger');
        navigate('/login');
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  // Apply filters
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

  // Cancel reservation
  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await api.delete(`/staffCancelReservation?id=${id}`);
      showMessage('Reservation cancelled.', 'warning');
      fetchReservations();
    } catch (error) {
      console.error('Cancel failed:', error);

      if (error.response?.data?.message) {
        showMessage(`Error: ${error.response.data.message}`, 'danger');
      } else {
        showMessage('Failed to cancel reservation.', 'danger');
      }
    }
  };

  // Complete reservation
  const handleComplete = async (id) => {
    try {
      await api.post('/MarkReservationCompleted', { reservationID: id });
      showMessage('Reservation marked as completed.', 'success');
      fetchReservations();
    } catch (error) {
      console.error('Mark completed failed:', error);
      showMessage('Failed to mark reservation as completed.', 'danger');
    }
  };

  // Add reservation
  const handleAddReservation = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !newReservation.roomID ||
      !newReservation.customerUserID ||
      !newReservation.checkInDate ||
      !newReservation.checkOutDate
    ) {
      showMessage('Please fill in all required fields.', 'danger');
      return;
    }

    // Check dates
    if (new Date(newReservation.checkInDate) > new Date(newReservation.checkOutDate)) {
      showMessage('Check-out date must be after check-in date.', 'danger');
      return;
    }

    try {
      const payload = {
        roomID: parseInt(newReservation.roomID, 10),
        checkInDate: newReservation.checkInDate,
        checkOutDate: newReservation.checkOutDate,
        specialRequests: newReservation.specialRequests,
        customerUserID: parseInt(newReservation.customerUserID, 10),
      };
      await api.post('/MakeReservation', payload);
      showMessage('Reservation added successfully.', 'success');
      fetchReservations();
      setNewReservation({
        roomID: '',
        checkInDate: '',
        checkOutDate: '',
        specialRequests: '',
        customerUserID: '',
      });
    } catch (error) {
      console.error('Add reservation failed:', error);
      if (error.response?.data?.message) {
        showMessage(`Error: ${error.response.data.message}`, 'danger');
      } else {
        showMessage('Failed to add reservation.', 'danger');
      }
    }
  };

  // Logout handler
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
      {/* Sidebar */}
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <i className="bi bi-journal-check me-2"></i> Reservation Management
          </li>
          <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate('/recepsionist-dashboard')}
          >
            <i className="bi bi-house-door me-2"></i> Room Management
          </button>
          <button className="btn btn-outline-light w-100 mt-2" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-journal-check me-2"></i> Reservation Dashboard
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {loading && (
          <div className="text-center my-3">
            <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
            <span className="ms-2">Loading...</span>
          </div>
        )}

        {/* Add Reservation Form */}
        <div className="card mb-4">
          <div className="card-header bg-success text-white">
            <i className="bi bi-plus-circle me-2"></i> Add New Reservation
          </div>
          <div className="card-body">
            <form onSubmit={handleAddReservation}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Room ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newReservation.roomID}
                    onChange={(e) =>
                      setNewReservation({ ...newReservation, roomID: e.target.value })
                    }
                    required
                    min={1}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Customer</label>
                  <select
                    className="form-select"
                    value={newReservation.customerUserID}
                    onChange={(e) =>
                      setNewReservation({ ...newReservation, customerUserID: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c.userID} value={c.userID}>
                        {c.firstName} {c.lastName} ({c.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Check-in Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newReservation.checkInDate}
                    onChange={(e) =>
                      setNewReservation({ ...newReservation, checkInDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Check-out Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newReservation.checkOutDate}
                    onChange={(e) =>
                      setNewReservation({ ...newReservation, checkOutDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="form-label">Special Requests</label>
                <textarea
                  className="form-control"
                  value={newReservation.specialRequests}
                  onChange={(e) =>
                    setNewReservation({ ...newReservation, specialRequests: e.target.value })
                  }
                  rows={2}
                  placeholder="Optional"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-success mt-3">
                Add Reservation
              </button>
            </form>
          </div>
        </div>

        {/* Filters */}
        <div className="d-flex gap-3 mb-4">
          <select
            className="form-select"
            value={filterRoomType}
            onChange={(e) => setFilterRoomType(e.target.value)}
          >
            <option value="">Filter by Room Type</option>
            {roomTypes.map((type, i) => (
              <option key={i} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            value={filterReservationStatus}
            onChange={(e) => setFilterReservationStatus(e.target.value)}
          >
            <option value="">Filter by Status</option>
            {reservationStatuses.map((status, i) => (
              <option key={i} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setFilterRoomType('');
              setFilterReservationStatus('');
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* Reservations Table */}
        <div className="table-responsive shadow rounded">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Reservation ID</th>
                <th>Room Type</th>
                <th>Status</th>
                <th>Check-in Date</th>
                <th>Check-out Date</th>
                <th>Special Requests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    No reservations found.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr key={res.reservationID}>
                    <td>{res.reservationID}</td>
                    <td>{res.roomTypeName}</td>
                    <td>{res.reservationStatusName}</td>
                    <td>{res.checkInDate}</td>
                    <td>{res.checkOutDate}</td>
                    <td>{res.specialRequests || '-'}</td>
                    <td>
<button
  className="btn btn-sm btn-danger"
  onClick={() => handleCancel(res.reservationID)}
  disabled={
    res.reservationStatusName.toLowerCase() === 'cancelled' ||
    res.reservationStatusName.toLowerCase() === 'completed'
  }
  title={
    res.reservationStatusName.toLowerCase() === 'cancelled'
      ? 'Already cancelled'
      : res.reservationStatusName.toLowerCase() === 'completed'
      ? 'Cannot cancel a completed reservation'
      : 'Cancel reservation'
  }
>
  Cancel
</button>

         <button
  className="btn btn-sm btn-success"
  onClick={() => handleComplete(res.reservationID)}
  disabled={
    res.reservationStatusName.toLowerCase() === 'cancelled' ||
    res.reservationStatusName.toLowerCase() === 'completed'
  }
  title={
    res.reservationStatusName.toLowerCase() === 'cancelled'
      ? 'Cannot mark completed (cancelled)'
      : res.reservationStatusName.toLowerCase() === 'completed'
      ? 'Already completed'
      : 'Mark reservation completed'
  }
>
  Mark Completed
</button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default RecepsionistReservationDashboard;
