import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const shifts = ["Morning", "Afternoon", "Night"];

export default function ServiceRecepsionistManager() {
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");

  const [users, setUsers] = useState([]);
  const [receps, setReceps] = useState([]);
  const [form, setForm] = useState({ userID: "", shift: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("https://localhost:7117/api/Auth/me", {
        withCredentials: true,
      });
      setCurrentUserId(res.data.userID);
      setCurrentUserName(res.data.userName);
    } catch (err) {
      toast.error("Failed to fetch logged-in user info.");
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchUsers();
      fetchServiceRecepsionists();
    }
  }, [currentUserId]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/User/getAllCustomers");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load customers.");
    }
  };

  const fetchServiceRecepsionists = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/ServiceRecepsionist/getAllServiceRecepsionists");
      setReceps(res.data);
    } catch (err) {
      toast.error("Failed to load service recepsionists.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (recep) => {
    setEditingId(recep.serviceRecepsionistID);
    setForm({ userID: recep.userID.toString(), shift: recep.shift });
  };

  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the service recepsionist.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/ServiceRecepsionist/deleteServiceRecepsionist/${id}`);
        toast.success("Service recepsionist deleted successfully");
        fetchServiceRecepsionists();
      } catch (err) {
        toast.error("Delete failed: " + (err.response?.data || err.message));
      }
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.userID) return setError("Please select a user.");
    if (!form.shift) return setError("Please select a shift.");

    try {
      if (editingId) {
        const existingRecep = receps.find((r) => r.serviceRecepsionistID === Number(editingId));
        if (!existingRecep) return setError("Recepsionist to update not found.");

        const updateDto = {
          ...existingRecep,
          shift: form.shift,
        };

        await axios.put(`/api/ServiceRecepsionist/updateServiceRecepsionist/${existingRecep.serviceRecepsionistID}`, updateDto);
        toast.success("Service recepsionist updated successfully");
      } else {
        const selectedUser = users.find((u) => u.userID.toString() === form.userID);
        if (!selectedUser) return toast.error("Selected user not found.");

        const dto = {
          serviceRecepsionistID: 0,
          userID: selectedUser.userID,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
          shift: form.shift,
          assignedByUserID: currentUserId,
          assignedByUserName: currentUserName,
          assignedAt: new Date().toISOString(),
        };

        await axios.post(`/api/ServiceRecepsionist/addServiceRecepsionist/${currentUserId}`, dto);
        toast.success("Service recepsionist added successfully");
      }

      setForm({ userID: "", shift: "" });
      setEditingId(null);
      fetchServiceRecepsionists();
    } catch (err) {
      const msg = err.response?.data?.title || err.response?.data?.errors || err.message;
      toast.error(JSON.stringify(msg));
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    let isoString = dateString.endsWith("Z") ? dateString : dateString + "Z";
    const dt = new Date(isoString);
    return isNaN(dt) ? "" : dt.toLocaleString(undefined, { timeZoneName: "short" });
  };

  return (
    <div className="container py-4">
      <h2 className="text-primary mb-4">
        <i className="bi bi-person-plus-fill me-2"></i> Service Recepsionist Management
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="userID" className="form-label">User</label>
          <select
            id="userID"
            name="userID"
            className="form-select"
            value={form.userID}
            onChange={handleChange}
            disabled={!!editingId}
          >
            <option value="">-- Select User --</option>
            {users.map((user) => (
              <option key={user.userID} value={user.userID}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="shift" className="form-label">Shift</label>
          <select
            id="shift"
            name="shift"
            className="form-select"
            value={form.shift}
            onChange={handleChange}
          >
            <option value="">-- Select Shift --</option>
            {shifts.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          {editingId ? "Update Service Recepsionist" : "Add Service Recepsionist"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingId(null);
              setForm({ userID: "", shift: "" });
              setError("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h4 className="mb-3">Assigned Service Recepsionists</h4>
      {loading ? (
        <p>Loading...</p>
      ) : receps.length === 0 ? (
        <p>No service recepsionists assigned yet.</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Shift</th>
              <th>Assigned By</th>
              <th>Assigned At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {receps.map((r) => (
              <tr key={r.serviceRecepsionistID}>
                <td>{r.serviceRecepsionistID}</td>
                <td>{r.firstName} {r.lastName}</td>
                <td>{r.email}</td>
                <td>{r.shift}</td>
                <td>{r.assignedByUserName}</td>
                <td>{formatDateTime(r.assignedAt)}</td>
                <td>
                  <button className="btn btn-sm btn-info me-2" onClick={() => handleEditClick(r)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(r.serviceRecepsionistID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
