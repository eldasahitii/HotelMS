import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function UserRestaurantReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);
  const [formData, setFormData] = useState({
    dateTime: "",
    status: "",
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get("/api/RestaurantResUser/getUserReservations", {
        withCredentials: true,
      });
      setReservations(res.data);
    } catch {
      toast.error("Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (res) => {
    setEditingReservation(res);
    setFormData({
      dateTime: res.dateTime.slice(0, 16), // format for datetime-local
      status: res.status,
    });
  };

  const cancelEdit = () => {
    setEditingReservation(null);
    setFormData({ dateTime: "", status: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/RestaurantResUser/updateUserReservation/${editingReservation.reservationID}`,
        {
          dateTime: formData.dateTime,
          status: formData.status,
        },
        { withCredentials: true }
      );
      toast.success("Reservation updated.");
      cancelEdit();
      fetchReservations();
    } catch {
      toast.error("Failed to update reservation.");
    }
  };

  const handleCancelReservation = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this reservation?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/RestaurantResUser/cancelUserReservation?id=${id}`, {
        withCredentials: true,
      });
      toast.success("Reservation cancelled.");
      fetchReservations();
    } catch {
      toast.error("Failed to cancel reservation.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">My Restaurant Reservations</h2>
      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length === 0 ? (
        <p>You have no restaurant reservations.</p>
      ) : (
        reservations.map((res) => (
          <div key={res.reservationID} className="card mb-3 p-3 shadow-sm">
            <h5>Table #{res.restaurantTable?.tableNumber || res.restaurantTableID}</h5>
            <p><strong>Date & Time:</strong> {new Date(res.dateTime).toLocaleString()}</p>
            <p><strong>Status:</strong> {res.status}</p>

            {editingReservation?.reservationID === res.reservationID ? (
              <form onSubmit={handleEditSubmit}>
                <div className="mb-2">
                  <label>Date & Time</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    className="form-control"
                    value={formData.dateTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label>Status</label>
                  <input
                    type="text"
                    name="status"
                    className="form-control"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success me-2">Save</button>
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              </form>
            ) : (
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary" onClick={() => startEdit(res)}>
                  Edit
                </button>
                <button className="btn btn-outline-danger" onClick={() => handleCancelReservation(res.reservationID)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
