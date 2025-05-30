import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

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

 

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('https://localhost:7117/api/User/GetAllCustomers', {
        withCredentials: true,
      });
      setCustomers(res.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers.');
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
      toast.error('Failed to load rooms.');
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
          toast.error('Unauthorized. Please log in again.');
          navigate('/login');
        } else {
          toast.error(`Server error: ${error.response.status} ${error.response.statusText}`);
        }
      } else {
        toast.error('Network error or server not reachable.');
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
        toast.error('You must be logged in to view reservations.');
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
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This will cancel the reservation.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, cancel it!',
    cancelButtonText: 'No, keep it',
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/staffCancelReservation?id=${id}`);
    toast.info('Reservation cancelled.');
    await fetchReservations();
    Swal.fire('Cancelled', 'The reservation has been cancelled.', 'success');
  } catch (error) {
    console.error('Cancel failed:', error);

    if (error.response?.data?.message) {
      toast.error(`Error: ${error.response.data.message}`);
      Swal.fire('Error', error.response.data.message, 'error');
    } else {
      toast.error('Failed to cancel reservation.');
      Swal.fire('Error', 'Failed to cancel reservation.', 'error');
    }
  }
};

const handleComplete = async (id) => {
  try {
    await api.post('/MarkReservationCompleted', { reservationID: id });
    toast.success('Reservation marked as completed.');
    await fetchReservations();
  } catch (error) {
    console.error('Mark completed failed:', error);

    const backendMessage = error.response?.data?.error || error.response?.data?.message;

    if (backendMessage) {
      toast.error(backendMessage);
    } else {
      toast.error('Failed to mark reservation as completed.');
    }
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
      toast.error('Please fill in all required fields.');
      return;
    }

    if (new Date(newReservation.checkInDate) > new Date(newReservation.checkOutDate)) {
      toast.error('Check-out date must be after check-in date.');
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
      toast.success('Reservation added successfully.');
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
        toast.error(`Error: ${error.response.data.message || 'Server error'}`);
      } else {
        toast.error('Failed to add reservation.');
      }
    }
  };



  const startEditReservation = (reservation) => {
    setEditReservationID(reservation.reservationID);
    setEditReservationData({
      checkInDate: formatForInputDate(reservation.checkInDate),
      checkOutDate: formatForInputDate(reservation.checkOutDate),
      specialRequests: reservation.specialRequests || '',
    });
  };


  const cancelEdit = () => {
    setEditReservationID(null);
    setEditReservationData({
      checkInDate: '',
      checkOutDate: '',
      specialRequests: '',
    });
  };


  const formatForInputDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditReservationData((prev) => ({ ...prev, [name]: value }));
  };


  const handleUpdateReservation = async (e) => {
    e.preventDefault();

    if (!editReservationID) return;

    if (!editReservationData.checkInDate || !editReservationData.checkOutDate) {
      toast.error('Please fill in both check-in and check-out dates.');
      return;
    }

    if (new Date(editReservationData.checkInDate) > new Date(editReservationData.checkOutDate)) {
      toast.error('Check-out date must be after check-in date.');
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


      toast.success('Reservation updated successfully.');
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
        toast.error(`Error: ${error.response.data.message || 'Server error'}`);
      } else {
        toast.error('Failed to update reservation.');
      }
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>

      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column mb-4">
          <li className="nav-item mb-2">
            <button
              className="btn btn-outline-light w-100 text-start"
              onClick={() => navigate('/recepsionist-dashboard')}
            >
              <i className="bi bi-calendar-check me-2"></i> Rooms
            </button>
          </li>
        </ul>
        <button
          className="btn btn-outline-light w-100 text-start"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </aside>

  
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-calendar-check me-2"></i> Receptionist Reservation Dashboard
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => { /* You can add a setMessage('') here if you track it */ }}></button>
          </div>
        )}

 
        <div className="row mb-4">
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

        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">Add New Reservation</div>
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
                        Room {room.roomNumber}
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


        <h4>Reservations List</h4>
        {loading ? (
          <p>Loading reservations...</p>
        ) : (
          <table className="table table-striped table-bordered shadow-sm">
            <thead className="bg-primary text-white">

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
                      <>{!(resv.reservationStatusName === "Cancelled" || resv.reservationStatusName === "Completed") && (
                       <button
                       className="btn btn-primary btn-sm me-1"
                       onClick={() => startEditReservation(resv)}
                      title="Edit Reservation"
                      >Edit
                      </button>
                     )}


                      <button
                      className="btn btn-danger btn-sm me-1"
                      onClick={() => handleCancel(resv.reservationID)}
                      title="Cancel Reservation"
                      disabled={
                      resv.reservationStatusName === "Cancelled" ||
                      resv.reservationStatusName === "Completed"
                      }
                      >
                      Cancel
                     </button>


                      <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleComplete(resv.reservationID)}
                      title="Mark Completed"
                      disabled={
                      resv.reservationStatusName === "Cancelled" ||
                      resv.reservationStatusName === "Completed"
                      } 
                      > 
                      Complete
                    </button>



                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default RecepsionistReservationDashboard;
