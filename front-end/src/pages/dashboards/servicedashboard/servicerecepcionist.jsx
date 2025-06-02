

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true; // send cookies with requests

export default function ServiceReceptionistDashboard() {
  const navigate = useNavigate();

  const [currentUserName, setCurrentUserName] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Axios interceptor for 401 Unauthorized
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Try refresh token
          try {
            await axios.post("https://localhost:7117/api/auth/refresh");
            // Retry original request
            return axios(error.config);
          } catch (refreshError) {
            // Redirect to login if refresh fails
            navigate("/login");
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  // Fetch current user info
  const fetchCurrentUserInfo = useCallback(async () => {
    setError("");
    try {
      const res = await axios.get("https://localhost:7117/api/auth/me");
      const { firstName, lastName, role } = res.data;

      if (role !== "Receptionist") {
        setError("Access denied.");
        return;
      }

      setCurrentUserName(`${firstName} ${lastName}`);
    } catch (err) {
      console.error(err);
      setError("You are not authorized. Please log in.");
      navigate("/login");
    }
  }, [navigate]);

  // Fetch reservations
  const fetchReservations = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(
        "https://localhost:7117/api/HotelServiceReservation/GetAllReservations"
      );
      setReservations(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch reservations.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel reservation
  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    setActionLoading(true);
    try {
      await axios.delete(
        `https://localhost:7117/api/HotelServiceReservation/staffCancelReservation?id=${id}`
      );
      await fetchReservations();
    } catch (err) {
      alert("Failed to cancel reservation.");
    } finally {
      setActionLoading(false);
    }
  };

  // Mark reservation completed
  const handleMarkCompleted = async (id) => {
    setActionLoading(true);
    try {
      await axios.post(
        "https://localhost:7117/api/HotelServiceReservation/MarkReservationCompleted",
        { reservationID: id }
      );
      await fetchReservations();
    } catch (err) {
      alert("Failed to mark as completed.");
    } finally {
      setActionLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post("https://localhost:7117/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/login");
    }
  };

  // On mount fetch data
  useEffect(() => {
    fetchCurrentUserInfo();
    fetchReservations();
  }, [fetchCurrentUserInfo, fetchReservations]);

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f4f6fa" }}>
      <aside
        className="text-white p-4"
        style={{ width: "240px", backgroundColor: "#2e3b55" }}
      >
        <h4 className="fw-bold mb-4">HotelMS</h4>
        <button
          className="btn btn-outline-light w-100 mb-3"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>
        <button
          className="btn btn-outline-light w-100"
          onClick={handleLogout}
          disabled={actionLoading}
        >
          Logout
        </button>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-2">
          Welcome, {currentUserName || "Receptionist"}
        </h2>
        <h4 className="text-secondary mb-4">Service Reservations</h4>

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
                    <button
                      className="btn btn-sm btn-danger me-2"
                      onClick={() => handleCancel(r.reservationID)}
                      disabled={actionLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleMarkCompleted(r.reservationID)}
                      disabled={actionLoading}
                    >
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


