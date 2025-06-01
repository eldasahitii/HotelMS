// File: ServiceRecepcionistDashboard.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ServiceRecepcionistDashboard() {
  const navigate = useNavigate();

  const currentUserId = parseInt(localStorage.getItem("userId"), 10);
  const [currentUserName, setCurrentUserName] = useState("");

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCurrentUserInfo = async () => {
    try {
      const res = await axios.get(`/api/User`, { params: { id: currentUserId } });
      const user = res.data;
      setCurrentUserName(`${user.firstName} ${user.lastName}`);
    } catch (err) {
      setError("Failed to load user info.");
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/HotelServiceReservation/GetAllReservations");
      setReservations(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch reservations.");
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await axios.delete(`/api/HotelServiceReservation/staffCancelReservation?id=${id}`);
      fetchReservations();
    } catch (err) {
      alert("Failed to cancel reservation.");
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await axios.post("/api/HotelServiceReservation/MarkReservationCompleted", {
        reservationID: id,
      });
      fetchReservations();
    } catch (err) {
      alert("Failed to mark as completed.");
    }
  };

  useEffect(() => {
    if (currentUserId) fetchCurrentUserInfo();
    fetchReservations();
  }, []);

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f4f6fa" }}>
      <aside className="text-white p-4" style={{ width: "240px", backgroundColor: "#2e3b55" }}>
        <h4 className="fw-bold mb-4">HotelMS</h4>
        <button
          className="btn btn-outline-light w-100 mb-3"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="btn btn-outline-light w-100"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">Service Reservations</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <p>Loading...</p>
        ) : reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.reservationID}>
                  <td>{r.reservationID}</td>
                  <td>{r.customerName}</td>
                  <td>{r.date}</td>
                  <td>{r.timeSlot}</td>
                  <td>{r.status}</td>
                  <td>
                    <button className="btn btn-sm btn-danger me-2" onClick={() => handleCancel(r.reservationID)}>
                      Cancel
                    </button>
                    <button className="btn btn-sm btn-success" onClick={() => handleMarkCompleted(r.reservationID)}>
                      Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
