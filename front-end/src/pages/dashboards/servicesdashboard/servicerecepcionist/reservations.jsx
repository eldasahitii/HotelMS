import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecepsionistReservationDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [filterServiceName, setFilterServiceName] = useState("");
  const [filterReservationStatus, setFilterReservationStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const [editReservation, setEditReservation] = useState(null);

  const navigate = useNavigate();
  const api = axios.create({
    baseURL: "https://localhost:7117/api/HotelServiceReservation",
    withCredentials: true,
  });

  
  const reservationStatuses = ["Pending", "Confirmed", "Cancelled"];

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
        reservationStatusName: r.reservationStatusName || "Pending",
        createdAt: r.createdAt
          ? new Date(r.createdAt).toLocaleDateString()
          : "",
        receptionistFirstName: r.receptionistFirstName || "",
        receptionistLastName: r.receptionistLastName || "",
        receptionistEmail: r.receptionistEmail || "",
      }));

      setReservations(data);
      setFilteredReservations(data);

      setServiceNames([
        ...new Set(data.map((r) => r.hotelServiceName).filter(Boolean)),
      ]);
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
    const checkAuthAndLoad = async () => {
      try {
        await axios.get("https://localhost:7117/api/Auth/me", {
          withCredentials: true,
        });
        await fetchReservations();
      } catch {
        toast.error("You must be logged in to view reservations.");
        navigate("/login");
      }
    };
    checkAuthAndLoad();
  }, [navigate]);

  useEffect(() => {
    let filtered = reservations;
    if (filterServiceName) {
      filtered = filtered.filter(
        (r) =>
          r.hotelServiceName.toLowerCase() === filterServiceName.toLowerCase()
      );
    }
    if (filterReservationStatus) {
      filtered = filtered.filter(
        (r) =>
          r.reservationStatusName.toLowerCase() ===
          filterReservationStatus.toLowerCase()
      );
    }
    setFilteredReservations(filtered);
  }, [filterServiceName, filterReservationStatus, reservations]);

  const openEditModal = (reservation) => {
    setEditReservation({ ...reservation });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reservation?"))
      return;

    try {
      await api.delete(`/DeleteReservation/${id}`);
      toast.success("Reservation deleted successfully.");
      fetchReservations();
    } catch (err) {
      toast.error("Failed to delete reservation.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const dto = {
        reservationID: editReservation.reservationID,
        firstName: editReservation.firstName,
        lastName: editReservation.lastName,
        email: editReservation.email,
        phone: editReservation.phone,
        reservationDate: new Date(editReservation.reservationDate).toISOString(),
        timeSlot: editReservation.timeSlot,
        hotelServiceDetailID: editReservation.hotelServiceDetailID || 1,
        reservationStatusName: editReservation.reservationStatusName, 
        serviceRecepsionistId: 1,
        createdAt: new Date().toISOString(),
      };

      await api.put("/UpdateReservation", dto);
      toast.success("Reservation updated successfully.");
      setEditReservation(null);
      fetchReservations();
    } catch (err) {
      toast.error("Failed to update reservation.");
    }
  };

  const closeModal = () => setEditReservation(null);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center text-md-start">
        Recepcionist Reservations Dashboard
      </h2>

      
      <div className="mb-3 d-flex flex-column flex-md-row gap-3">
        <select
          className="form-select"
          value={filterServiceName}
          onChange={(e) => setFilterServiceName(e.target.value)}
          aria-label="Filter by service name"
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
          aria-label="Filter by reservation status"
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
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">Reservation ID</th>
                <th scope="col">Customer</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Service</th>
                <th scope="col">Date</th>
                <th scope="col">Time Slot</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">
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
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2 mb-1"
                        onClick={() => openEditModal(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger mb-1"
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
        </div>
      )}

      
      {editReservation && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
            <div className="modal-content">
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    Edit Reservation #{editReservation.reservationID}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
                      <label className="form-label">Reservation Date</label>
                      <input
                        type="date"
                        name="reservationDate"
                        className="form-control"
                        value={
                          editReservation.reservationDate
                            ? new Date(editReservation.reservationDate)
                                .toISOString()
                                .slice(0, 10)
                            : ""
                        }
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
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
                    <div className="col-12 col-md-6">
                      <label className="form-label">Service</label>
                      <input
                        type="text"
                        name="hotelServiceName"
                        className="form-control"
                        value={editReservation.hotelServiceName}
                        readOnly
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        name="reservationStatusName"
                        className="form-select"
                        value={editReservation.reservationStatusName}
                        onChange={handleEditChange}
                        required
                      >
                        {reservationStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Reservation
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
