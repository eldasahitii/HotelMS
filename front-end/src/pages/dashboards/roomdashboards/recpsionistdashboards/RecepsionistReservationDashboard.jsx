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
  const [rooms, setRooms] = useState([]);
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
  const [editReservationID, setEditReservationID] = useState(null);
  const [editReservationData, setEditReservationData] = useState({
    checkInDate: '',
    checkOutDate: '',
    specialRequests: '',
  });

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'https://localhost:7117/api/RoomReservation',
    withCredentials: true,
  });

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

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

  const fetchRooms = async () => {
    try {
      const res = await axios.get('https://localhost:7117/api/Room/GetAllRooms', {
        withCredentials: true,
      });
      setRooms(res.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      showMessage('Failed to load rooms.', 'danger');
    }
  };

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
        userID: r.userID || null,
        firstName: r.firstName || '',
        lastName: r.lastName || '',
        email: r.email || '',
        createdByReceptionistID: r.createdByReceptionistID || null,
        receptionistFirstName: r.receptionistFirstName || '',
        receptionistLastName: r.receptionistLastName || '',
        receptionistEmail: r.receptionistEmail || '',
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

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        await axios.get('https://localhost:7117/api/Auth/me', { withCredentials: true });
        await fetchCustomers();
        await fetchRooms();
        await fetchReservations();
      } catch (error) {
        showMessage('You must be logged in to view reservations.', 'danger');
        navigate('/login');
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

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

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await api.delete(`/staffCancelReservation?id=${id}`);
      showMessage('Reservation cancelled.', 'warning');
      await fetchReservations();
    } catch (error) {
      console.error('Cancel failed:', error);

      if (error.response?.data?.message) {
        showMessage(`Error: ${error.response.data.message}`, 'danger');
      } else {
        showMessage('Failed to cancel reservation.', 'danger');
      }
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.post('/MarkReservationCompleted', { reservationID: id });
      showMessage('Reservation marked as completed.', 'success');
      await fetchReservations();
    } catch (error) {
      console.error('Mark completed failed:', error);
      showMessage('Failed to mark reservation as completed.', 'danger');
    }
  };

  const handleAddReservation = async (e) => {
    e.preventDefault();

    if (
      !newReservation.roomID ||
      !newReservation.customerUserID ||
      !newReservation.checkInDate ||
      !newReservation.checkOutDate
    ) {
      showMessage('Please fill in all required fields.', 'danger');
      return;
    }

    if (new Date(newReservation.checkInDate) > new Date(newReservation.checkOutDate)) {
      showMessage('Check-out date must be after check-in date.', 'danger');
      return;
    }

    try {
      const payload = {
        roomID: parseInt(newReservation.roomID, 10),
        checkInDate: new Date(newReservation.checkInDate).toISOString(),
        checkOutDate: new Date(newReservation.checkOutDate).toISOString(),
        specialRequests: newReservation.specialRequests,
        customerUserID: parseInt(newReservation.customerUserID, 10),
      };

      await api.post('/MakeReservation', payload);
      showMessage('Reservation added successfully.', 'success');
      await fetchReservations();
      setNewReservation({
        roomID: '',
        checkInDate: '',
        checkOutDate: '',
        specialRequests: '',
        customerUserID: '',
      });
    } catch (error) {
      console.error('Add reservation failed:', error);
      if (error.response) {
        showMessage(`Error: ${error.response.data.message || 'Server error'}`, 'danger');
      } else {
        showMessage('Failed to add reservation.', 'danger');
      }
    }
  };

  // --- New functions for editing/updating reservation ---

  // Start editing reservation - populate form fields with existing data
  const startEditReservation = (reservation) => {
    setEditReservationID(reservation.reservationID);
    setEditReservationData({
      checkInDate: formatForInputDate(reservation.checkInDate),
      checkOutDate: formatForInputDate(reservation.checkOutDate),
      specialRequests: reservation.specialRequests || '',
    });
  };

  // Cancel editing mode
  const cancelEdit = () => {
    setEditReservationID(null);
    setEditReservationData({
      checkInDate: '',
      checkOutDate: '',
      specialRequests: '',
    });
  };

  // Format date string (e.g., "5/26/2025") to yyyy-MM-dd for input[type=date]
  const formatForInputDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle edit input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditReservationData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated reservation data via PUT request
  const handleUpdateReservation = async (e) => {
    e.preventDefault();

    if (!editReservationID) return;

    if (!editReservationData.checkInDate || !editReservationData.checkOutDate) {
      showMessage('Please fill in both check-in and check-out dates.', 'danger');
      return;
    }

    if (new Date(editReservationData.checkInDate) > new Date(editReservationData.checkOutDate)) {
      showMessage('Check-out date must be after check-in date.', 'danger');
      return;
    }

    try {
      const payload = {
        reservationID: editReservationID,
        checkInDate: new Date(editReservationData.checkInDate).toISOString(),
        checkOutDate: new Date(editReservationData.checkOutDate).toISOString(),
        specialRequests: editReservationData.specialRequests,
      };

      await api.put(`/UpdateReservation/${editReservationID}`, payload);


      showMessage('Reservation updated successfully.', 'success');
      setEditReservationID(null);
      setEditReservationData({
        checkInDate: '',
        checkOutDate: '',
        specialRequests: '',
      });
      await fetchReservations();
    } catch (error) {
      console.error('Update reservation failed:', error);
      if (error.response) {
        showMessage(`Error: ${error.response.data.message || 'Server error'}`, 'danger');
      } else {
        showMessage('Failed to update reservation.', 'danger');
      }
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Receptionist Reservation Dashboard</h2>

      {message && (
        <div className={`alert alert-${messageType}`} role="alert">
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="filterRoomType" className="form-label">
            Filter by Room Type:
          </label>
          <select
            id="filterRoomType"
            className="form-select"
            value={filterRoomType}
            onChange={(e) => setFilterRoomType(e.target.value)}
          >
            <option value="">All</option>
            {roomTypes.map((rt) => (
              <option key={rt} value={rt}>
                {rt}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="filterReservationStatus" className="form-label">
            Filter by Reservation Status:
          </label>
          <select
            id="filterReservationStatus"
            className="form-select"
            value={filterReservationStatus}
            onChange={(e) => setFilterReservationStatus(e.target.value)}
          >
            <option value="">All</option>
            {reservationStatuses.map((rs) => (
              <option key={rs} value={rs}>
                {rs}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Reservation Form */}
      <div className="card mb-4">
        <div className="card-header">Add New Reservation</div>
        <div className="card-body">
          <form onSubmit={handleAddReservation}>
            <div className="row g-3">
              <div className="col-md-3">
                <label htmlFor="roomID" className="form-label">
                  Room:
                </label>
                <select
                  id="roomID"
                  className="form-select"
                  value={newReservation.roomID}
                  onChange={(e) =>
                    setNewReservation({ ...newReservation, roomID: e.target.value })
                  }
                  required
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.roomID} value={room.roomID}>
                      {room.title} (ID: {room.roomID})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="customerUserID" className="form-label">
                  Customer:
                </label>
                <select
                  id="customerUserID"
                  className="form-select"
                  value={newReservation.customerUserID}
                  onChange={(e) =>
                    setNewReservation({ ...newReservation, customerUserID: e.target.value })
                  }
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.userID} value={customer.userID}>
                      {customer.firstName} {customer.lastName} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="checkInDate" className="form-label">
                  Check-In Date:
                </label>
                <input
                  type="date"
                  id="checkInDate"
                  className="form-control"
                  value={newReservation.checkInDate}
                  onChange={(e) =>
                    setNewReservation({ ...newReservation, checkInDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="checkOutDate" className="form-label">
                  Check-Out Date:
                </label>
                <input
                  type="date"
                  id="checkOutDate"
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
              <label htmlFor="specialRequests" className="form-label">
                Special Requests:
              </label>
              <textarea
                id="specialRequests"
                className="form-control"
                rows="2"
                value={newReservation.specialRequests}
                onChange={(e) =>
                  setNewReservation({ ...newReservation, specialRequests: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Add Reservation
            </button>
          </form>
        </div>
      </div>

      {/* Reservations Table */}
      <h4>Reservations List</h4>
      {loading ? (
        <p>Loading reservations...</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Room Type</th>
              <th>Status</th>
              <th>Check-In Date</th>
              <th>Check-Out Date</th>
              <th>Special Requests</th>
              <th>Customer</th>
              <th>Receptionist</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center">
                  No reservations found.
                </td>
              </tr>
            )}
            {filteredReservations.map((resv) => (
              <tr key={resv.reservationID}>
                <td>{resv.reservationID}</td>
                <td>{resv.roomTypeName}</td>
                <td>{resv.reservationStatusName}</td>
                <td>{resv.checkInDate}</td>
                <td>{resv.checkOutDate}</td>
                <td>{resv.specialRequests}</td>
                <td>
                  {resv.firstName} {resv.lastName} <br />
                  <small>{resv.email}</small>
                </td>
                <td>
                  {resv.receptionistFirstName} {resv.receptionistLastName} <br />
                  <small>{resv.receptionistEmail}</small>
                </td>
                <td>
                  {/* If editing this reservation, show edit form inline */}
                  {editReservationID === resv.reservationID ? (
                    <form onSubmit={handleUpdateReservation}>
                      <div className="mb-2">
                        <label className="form-label">Check-In:</label>
                        <input
                          type="date"
                          name="checkInDate"
                          className="form-control"
                          value={editReservationData.checkInDate}
                          onChange={handleEditChange}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Check-Out:</label>
                        <input
                          type="date"
                          name="checkOutDate"
                          className="form-control"
                          value={editReservationData.checkOutDate}
                          onChange={handleEditChange}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label">Special Requests:</label>
                        <textarea
                          name="specialRequests"
                          className="form-control"
                          rows="2"
                          value={editReservationData.specialRequests}
                          onChange={handleEditChange}
                        />
                      </div>
                      <button type="submit" className="btn btn-success btn-sm me-2">
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => startEditReservation(resv)}
                        title="Edit Reservation"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => handleCancel(resv.reservationID)}
                        title="Cancel Reservation"
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleComplete(resv.reservationID)}
                        title="Mark Completed"
                      >
                        <i className="bi bi-check-circle"></i>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecepsionistReservationDashboard;
