import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecepsionistReservationDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [reservationStatuses, setReservationStatuses] = useState([]);
  const [filterServiceName, setFilterServiceName] = useState("");
  const [filterReservationStatus, setFilterReservationStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // For editing modal
  const [editReservation, setEditReservation] = useState(null);

  // For reply message to client
  const [replyMessage, setReplyMessage] = useState("");

  const navigate = useNavigate();
  const api = axios.create({
    baseURL: "https://localhost:7117/api/HotelServiceReservation",
    withCredentials: true,
  });

  // Fetch all reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await api.get("/GetAllReservations");
      const data = res.data.map((r) => ({
        reservationID: r.reservationID,
        firstName: r.firstName || "",
        lastName: r.lastName || "",
        email: r.email || "",
        phone: r.phone || "",
        reservationDate: r.reservationDate
          ? new Date(r.reservationDate).toLocaleDateString()
          : "N/A",
        timeSlot: r.timeSlot || "",
        hotelServiceName: r.hotelServiceName || "Unknown",
        reservationStatusName: r.reservationStatusName || "Unknown",
        createdAt: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString()
          : "",
        receptionistFirstName: r.receptionistFirstName || "",
        receptionistLastName: r.receptionistLastName || "",
        receptionistEmail: r.receptionistEmail || "",
      }));

      setReservations(data);
      setFilteredReservations(data);

      // Get unique service names and statuses for filters
      setServiceNames([...new Set(data.map((r) => r.hotelServiceName).filter(Boolean))]);
      setReservationStatuses([...new Set(data.map((r) => r.reservationStatusName).filter(Boolean))]);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Unauthorized. Please log in again.");
        navigate("/login");
      } else {
        toast.error("Failed to fetch reservations.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check auth then fetch
    const checkAuthAndLoad = async () => {
      try {
        await axios.get("https://localhost:7117/api/Auth/me", { withCredentials: true });
        await fetchReservations();
      } catch {
        toast.error("You must be logged in to view reservations.");
        navigate("/login");
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  // Filter by service name and status
  useEffect(() => {
    let filtered = reservations;
    if (filterServiceName) {
      filtered = filtered.filter(
        (r) => r.hotelServiceName.toLowerCase() === filterServiceName.toLowerCase()
      );
    }
    if (filterReservationStatus) {
      filtered = filtered.filter(
        (r) => r.reservationStatusName.toLowerCase() === filterReservationStatus.toLowerCase()
      );
    }
    setFilteredReservations(filtered);
  }, [filterServiceName, filterReservationStatus, reservations]);

  // Handle edit button click: open modal
  const openEditModal = (reservation) => {
    setEditReservation({ ...reservation }); // clone to edit
    setReplyMessage("");
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;

    try {
      await api.delete(`/DeleteReservation/${id}`);
      toast.success("Reservation deleted successfully.");
      fetchReservations();
    } catch (err) {
      toast.error("Failed to delete reservation.");
    }
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditReservation((prev) => ({ ...prev, [name]: value }));
  };

  // Submit update reservation
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare DTO structure (you may need to adjust according to your backend DTO)
      const dto = {
        reservationID: editReservation.reservationID,
        firstName: editReservation.firstName,
        lastName: editReservation.lastName,
        email: editReservation.email,
        phone: editReservation.phone,
        reservationDate: new Date(editReservation.reservationDate).toISOString(),
        timeSlot: editReservation.timeSlot,
        hotelServiceDetailID: editReservation.hotelServiceDetailID || 1, // default or keep existing
        reservationStatusID: parseInt(editReservation.reservationStatusName) || 1, // You may need mapping here
        serviceRecepsionistId: 1, // Your receptionist ID or keep existing
        createdAt: new Date().toISOString(), // Keep existing if you want
      };

      await api.put("/UpdateReservation", dto);
      toast.success("Reservation updated successfully.");
      setEditReservation(null);
      fetchReservations();
    } catch (err) {
      toast.error("Failed to update reservation.");
    }
  };

  // Handle sending reply to client (simulation)
  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }
    toast.success(`Reply sent to client: "${replyMessage}" (simulated)`);
    setReplyMessage("");
  };

  // Close modal
  const closeModal = () => setEditReservation(null);

  return (
    <div className="container mt-4">
      <h2>Recepcionist Reservations Dashboard</h2>

      {/* Filters */}
      <div className="mb-3 d-flex gap-3">
        <select
          className="form-select"
          value={filterServiceName}
          onChange={(e) => setFilterServiceName(e.target.value)}
        >
          <option value="">All Services</option>
          {serviceNames.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={filterReservationStatus}
          onChange={(e) => setFilterReservationStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {reservationStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Reservation Table */}
      {loading ? (
        <p>Loading reservations...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Status</th>
              <th>Receptionist</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center">
                  No reservations found.
                </td>
              </tr>
            ) : (
              filteredReservations.map((r) => (
                <tr key={r.reservationID}>
                  <td>{r.reservationID}</td>
                  <td>{`${r.firstName} ${r.lastName}`}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td>{r.hotelServiceName}</td>
                  <td>{r.reservationDate}</td>
                  <td>{r.timeSlot}</td>
                  <td>{r.reservationStatusName}</td>
                  <td>{`${r.receptionistFirstName} ${r.receptionistLastName}`}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => openEditModal(r)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(r.reservationID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {editReservation && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Reservation #{editReservation.reservationID}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={editReservation.firstName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={editReservation.lastName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={editReservation.email}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      value={editReservation.phone}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reservation Date</label>
                    <input
                      type="date"
                      name="reservationDate"
                      className="form-control"
                      value={
                        new Date(editReservation.reservationDate).toISOString().slice(0, 10) ||
                        ""
                      }
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time Slot</label>
                    <input
                      type="text"
                      name="timeSlot"
                      className="form-control"
                      value={editReservation.timeSlot}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <input
                      type="text"
                      name="reservationStatusName"
                      className="form-control"
                      value={editReservation.reservationStatusName}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  {/* Reply to client section */}
                  <div className="mb-3">
                    <label className="form-label">Reply to Client</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Write a reply message here..."
                    ></textarea>
                    <button
                      type="button"
                      className="btn btn-success mt-2"
                      onClick={handleSendReply}
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecepsionistReservationDashboard;
