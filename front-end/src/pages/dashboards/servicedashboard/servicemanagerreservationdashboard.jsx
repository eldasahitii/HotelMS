import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const api = axios.create({
  baseURL: "https://localhost:7117/api/HotelServiceReservation",
  withCredentials: true,
});

export default function ServiceManagerReservationDashboard() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all reservations
  const loadReservations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/GetAllReservations");
      setReservations(res.data);
    } catch (error) {
      toast.error("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ backgroundColor: "#f2f6fc", minHeight: "100vh", padding: "2rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          <i className="bi bi-calendar-check me-2"></i>Service Manager Reservations
        </h2>
        <button className="btn btn-outline-primary" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <i className="bi bi-list-ul me-2"></i>All Reservations
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Reservation ID</th>
                <th>Service ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Reservation Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="12" className="text-center py-3">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && reservations.length === 0 && (
                <tr>
                  <td colSpan="12" className="text-center py-3">
                    No reservations found.
                  </td>
                </tr>
              )}
              {reservations.map((res, idx) => (
                <tr key={res.reservationID || idx}>
                  <td>{idx + 1}</td>
                  <td>{res.reservationID}</td>
                  <td>{res.serviceId}</td>
                  <td>{res.firstName}</td>
                  <td>{res.lastName}</td>
                  <td>{res.email}</td>
                  <td>{res.phone}</td>
                  <td>{new Date(res.reservationDate).toLocaleDateString()}</td>
                  <td>{res.startTime}</td>
                  <td>{res.endTime}</td>
                  <td>{res.reservationStatusName || res.reservationStatusID}</td>
                  <td>{new Date(res.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
