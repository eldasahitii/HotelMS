import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

export default function RestaurantHostDashboard() {
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({ GuestID: '',RestaurantTableID: '', date_time: '', status: 'Booked' });
  const [editingReservation, setEditingReservation] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const res = await axios.get("/api/Host/getAllReservations",{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setReservations(res.data);
    } catch (err) {
      setMessage("Failed to fetch reservations.");
      setMessageType("danger");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleAddReservation = async () => {
    try {
      await axios.post("/api/Host/createReservation", newReservation, {
         headers: {
         Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setMessage("Reservation added successfully.");
      setMessageType("success");
      setNewReservation({ GuestID: '', RestaurantTableID: '',  date_time: '', status: 'Booked' });
      fetchReservations();
    } catch (error) {
      setMessage("Failed to add reservation.");
      setMessageType("danger");
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      await axios.delete(`/api/Host/cancelReservation?id=${id}`);
      setMessage("Reservation cancelled.");
      setMessageType("success");
      fetchReservations();
    } catch (error) {
      setMessage("Failed to cancel reservation.");
      setMessageType("danger");
    }
  };
  const handleUpdateReservationStatus = async (id) => {
    try {
      await axios.put(`/api/Host/updateReservationStatus?id=${id}`, JSON.stringify(newStatus), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setMessage("Status updated.");
      setMessageType("success");
      setEditingReservation(null);
      setNewStatus('');
      fetchReservations();
    } catch (error) {
      setMessage("Failed to update status.");
      setMessageType("danger");
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#fefefe' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#3c4b64' }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-person-circle"></i> Host Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item">Manage Reservations</li>
        </ul>
        <hr className="text-white" />
        <button className="btn btn-outline-light w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </button>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-calendar2-check me-2"></i>Reservations
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`}>
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-plus-circle me-2"></i>Add Reservation
          </div>
          <div className="card-body">
            <input className="form-control mb-2" placeholder="Guest ID" value={newReservation.GuestID} onChange={e => setNewReservation({ ...newReservation, GuestID: e.target.value })} />
            <input className="form-control mb-2" type="datetime-local" value={newReservation.date_time} onChange={e => setNewReservation({ ...newReservation, date_time: e.target.value })} />
            <input className="form-control mb-2" placeholder="Table ID" value={newReservation.RestaurantTableID} onChange={e => setNewReservation({ ...newReservation, RestaurantTableID: e.target.value })} />
            <button className="btn btn-primary w-100" onClick={handleAddReservation}><i className="bi bi-check2-circle me-2"></i>Add</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-secondary text-white">
            <i className="bi bi-list-ul me-2"></i>All Reservations
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Guest ID</th>
                  <th>Date & Time</th>
                  <th>Table ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res, index) => (
                  <tr key={res.reservationID}>
                    <td>{index + 1}</td>
                    <td>{res.GuestID}</td>
                    <td>{new Date(res.date_time).toLocaleString()}</td>
                    <td>{res.RestaurantTableID}</td>
                    <td>{res.status}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelReservation(res.reservationID)}>
                        <i className="bi bi-x-circle"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => {
                         setEditingReservation(res.reservationID);
                          setNewStatus(res.status);
                       }}>
                       <i className="bi bi-pencil-square"></i>
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editingReservation && (
  <div className="card mt-4">
    <div className="card-header bg-warning text-dark">
      Update Reservation Status
    </div>
    <div className="card-body">
      <input
        className="form-control mb-2"
        placeholder="New Status"
        value={newStatus}
        onChange={e => setNewStatus(e.target.value)}
      />
      <button className="btn btn-primary me-2" onClick={() => handleUpdateReservationStatus(editingReservation)}>
        Save
      </button>
      <button className="btn btn-secondary" onClick={() => setEditingReservation(null)}>
        Cancel
      </button>
    </div>
  </div>
)}

          </div>
        </div>
      </main>
    </div>
  );
}
