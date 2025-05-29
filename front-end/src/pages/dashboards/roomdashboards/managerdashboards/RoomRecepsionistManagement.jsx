import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const shifts = ["Morning", "Afternoon", "Night"];

export default function RoomReceptionistManager() {
  const navigate = useNavigate();

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");

  const [users, setUsers] = useState([]);
  const [receps, setReceps] = useState([]);
  const [form, setForm] = useState({ userID: "", shift: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch logged-in user info
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get("https://localhost:7117/api/Auth/me", {
        withCredentials: true,
      });
      setCurrentUserId(res.data.userId);
      setCurrentUserName(`${res.data.firstName} ${res.data.lastName}`);
    } catch (err) {
      toast.error("Failed to fetch logged-in user info.");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/User/getAllCustomers");
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load customers.");
    }
  };

  const fetchRecepsionists = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/RoomRecepsionist/getAllRoomRecepsionists");
      setReceps(res.data);
    } catch (err) {
      toast.error("Failed to load receptionists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      await fetchCurrentUser();
    }
    init();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchUsers();
      fetchRecepsionists();
    }
  }, [currentUserId]);

  const handleEditClick = (recep) => {
    setEditingId(recep.roomReceptionistID);
    setForm({ userID: recep.userID.toString(), shift: recep.shift });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this receptionist?")) return;
    try {
      await axios.delete(`/api/RoomRecepsionist/deleteRoomRecepsionist/${id}`);
      toast.success("Receptionist deleted successfully");
      fetchRecepsionists();
    } catch (err) {
      toast.error("Delete failed: " + (err.response?.data || err.message));
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
    if (!currentUserId || !currentUserName) return setError("User info not loaded.");

    try {
      if (editingId) {
        const existingRecep = receps.find((r) => r.roomReceptionistID === Number(editingId));
        if (!existingRecep) return setError("Receptionist to update not found.");

        const updateDto = {
          ...existingRecep,
          shift: form.shift,
        };

        await axios.put(`/api/RoomRecepsionist/updateRoomRecepsionist/${existingRecep.roomReceptionistID}`, updateDto);
        toast.success("Receptionist updated successfully");
      } else {
        const selectedUser = users.find((u) => u.userID.toString() === form.userID);
        if (!selectedUser) return toast.error("Selected user not found.");

        const dto = {
          roomReceptionistID: 0,
          userID: selectedUser.userID,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
          shift: form.shift,
          assignedByUserID: currentUserId,
          assignedByUserName: currentUserName,
          assignedAt: new Date().toISOString(),
        };

        await axios.post(`/api/RoomRecepsionist/addRoomRecepsionist/${currentUserId}`, dto);
        toast.success("Receptionist added successfully");
      }

      setForm({ userID: "", shift: "" });
      setEditingId(null);
      fetchRecepsionists();
    } catch (err) {
      const msg = err.response?.data?.title || err.response?.data?.errors || err.message || "Submit failed";
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
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <aside className="text-white p-4" style={{ width: "240px", backgroundColor: "#324b6b" }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-people"></i> HotelMS</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <i className="bi bi-person-badge me-2"></i> Receptionist Management
          </li>
          <button className="btn btn-outline-light w-100 mb-3" onClick={() => navigate("/manager/room-dashboard")}>
            <i className="bi bi-house-door me-2"></i> Room Management
          </button>
          <button className="btn btn-outline-light w-100 mb-3" onClick={() => navigate("/admin/reservation-dashboard")}>
            <i className="bi bi-journal-check me-2"></i> Room Reservation List
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
          <i className="bi bi-person-lines-fill me-2"></i> Room Receptionist Management
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

          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Receptionist" : "Add Receptionist"}
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

        <h3>Existing Receptionists</h3>
        {loading ? (
          <p>Loading...</p>
        ) : receps.length === 0 ? (
          <p>No receptionists found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Shift</th>
                <th>Assigned By</th>
                <th>Assigned At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receps.map((r) => (
                <tr key={r.roomReceptionistID}>
                  <td>{r.roomReceptionistID}</td>
                  <td>{`${r.firstName} ${r.lastName}`}</td>
                  <td>{r.email}</td>
                  <td>{r.shift}</td>
                  <td>{r.assignedByUserName || ""}</td>
                  <td>{formatDateTime(r.assignedAt)}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-2" onClick={() => handleEditClick(r)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(r.roomReceptionistID)}>Delete</button>
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
