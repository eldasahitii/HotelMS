import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminRoomStatus() {
  const navigate = useNavigate();

  const [statuses, setStatuses] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all room statuses
  const fetchStatuses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/RoomStatus/getAllRoomsStatuses", {
        params: { role: "Admin" }, // you might customize role param if needed
      });
      setStatuses(res.data);
    } catch (err) {
      setError("Failed to load room statuses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Clear form and editing state
  const clearForm = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
    setError("");
  };

  // Submit add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      if (editingId) {
        // Update existing status
        await axios.put(`/api/RoomStatus/updateRoomStatus?id=${editingId}`, form);
        alert("Room status updated successfully.");
      } else {
        // Add new status
        await axios.post("/api/RoomStatus/addRoomStatus", form);
        alert("Room status added successfully.");
      }
      clearForm();
      fetchStatuses();
    } catch (err) {
      setError(
        err.response?.data?.title ||
          err.response?.data?.errors ||
          err.message ||
          "Submit failed"
      );
    }
  };

  // Edit button click
  const handleEditClick = (status) => {
    setEditingId(status.id || status.roomStatusID || status.id);
    setForm({
      name: status.name || "",
      description: status.description || "",
    });
    setError("");
  };

  // Delete button click
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room status?")) return;
    try {
      await axios.delete(`/api/RoomStatus/deleteRoomStatus?id=${id}`);
      fetchStatuses();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <aside className="text-white p-4" style={{ width: "240px", backgroundColor: "#324b6b" }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-gear"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-3 text-white">Room Status Management</li>

          <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/manager/room-dashboard")}
          >
            <i className="bi bi-house-door me-2"></i> Room Management
          </button>

          <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/manager/room-receptionist-manager")}
          >
            <i className="bi bi-people me-2"></i> Receptionist Management
          </button>

          <button
            className="btn btn-outline-light w-100 mt-2"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-gear-fill me-2"></i> Room Status Management
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-4" style={{ maxWidth: "480px" }}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Status Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Available, Occupied"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={2}
              value={form.description}
              onChange={handleChange}
              placeholder="Additional info about this status"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Status" : "Add Status"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={clearForm}
            >
              Cancel
            </button>
          )}
        </form>

        <h3>Existing Room Statuses</h3>

        {loading ? (
          <p>Loading...</p>
        ) : statuses.length === 0 ? (
          <p>No room statuses found.</p>
        ) : (
          <table className="table table-bordered" style={{ maxWidth: "680px" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Status Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((status) => (
                <tr key={status.id || status.roomStatusID}>
                  <td>{status.id || status.roomStatusID}</td>
                  <td>{status.name}</td>
                  <td>{status.description || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleEditClick(status)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleDeleteClick(status.id || status.roomStatusID)
                      }
                    >
                      Delete
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
