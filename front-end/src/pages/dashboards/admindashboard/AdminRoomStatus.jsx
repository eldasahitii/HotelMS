import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function AdminRoomStatus() {
  const navigate = useNavigate();

  const [statuses, setStatuses] = useState([]);
  const [form, setForm] = useState({ roomStatusName: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const fetchStatuses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/RoomStatus/getAllRoomsStatuses", {
        params: { role: "Admin" },
      });
      setStatuses(res.data);
    } catch (err) {
      toast.error("Failed to load room statuses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);


  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const clearForm = () => {
    setForm({ roomStatusName: "" });
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.roomStatusName.trim()) {
      toast.error("Status Name is required.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/RoomStatus/updateRoomStatus?id=${editingId}`, form);
        toast.success("Room status updated successfully.");
      } else {

        await axios.post("/api/RoomStatus/addRoomStatus", form);
        toast.success("Room status added successfully.");
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

  const handleEditClick = (status) => {
    setEditingId(status.roomStatusID);
    setForm({
      roomStatusName: status.roomStatusName || "",
    });
    setError("");
  };


const handleDeleteClick = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This will permanently delete the room status.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`/api/RoomStatus/deleteRoomStatus?id=${id}`);
      fetchStatuses();
      Swal.fire('Deleted!', 'The room status has been deleted.', 'success');
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire('Error', `Delete failed: ${err.response?.data || err.message}`, 'error');
    }
  }
};

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
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
            <label htmlFor="roomStatusName" className="form-label">
              Status Name
            </label>
            <input
              type="text"
              id="roomStatusName"
              name="roomStatusName"
              className="form-control"
              value={form.roomStatusName}
              onChange={handleChange}
              placeholder="e.g. Available, Occupied"
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((status) => (
                <tr key={status.roomStatusID}>
                  <td>{status.roomStatusID}</td>
                  <td>{status.roomStatusName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleEditClick(status)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(status.roomStatusID)}
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
