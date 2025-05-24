import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const shifts = ["Morning", "Afternoon", "Night"]; 

export default function RoomReceptionistManager({ currentUserId }) {
  const navigate = useNavigate(); 

  const [users, setUsers] = useState([]);
  const [receps, setReceps] = useState([]);
  const [form, setForm] = useState({ userID: "", shift: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchRecepsionists();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/User/getAll"); // Your users API
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    }
  };

  const fetchRecepsionists = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/RoomRecepsionist/getAllRoomRecepsionists");
      setReceps(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load receptionists");
      setLoading(false);
    }
  };

  const handleEditClick = (recep) => {
    setEditingId(recep.roomReceptionistID);
    setForm({ userID: recep.userID.toString(), shift: recep.shift });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this receptionist?")) return;
    try {
      await axios.delete(`/api/RoomRecepsionist/deleteRoomRecepsionist/${id}`);
      fetchRecepsionists();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data || err.message));
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.userID) {
      setError("Please select a user.");
      return;
    }
    if (!form.shift) {
      setError("Please select a shift.");
      return;
    }
    if (!currentUserId) {
      setError("Current user ID is not set.");
      return;
    }

    const selectedUser = users.find((u) => u.userID.toString() === form.userID);
    if (!selectedUser) {
      setError("Selected user not found.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`/api/RoomRecepsionist/updateRoomRecepsionist/${editingId}`, {
          roomReceptionistID: editingId,
          userID: parseInt(form.userID, 10),
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
          shift: form.shift,
        });
        alert("Receptionist updated successfully");
      } else {
        const dto = {
          roomReceptionistID: 0,
          userID: selectedUser.userID,
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          email: selectedUser.email,
          shift: form.shift,
        };
        await axios.post(`/api/RoomRecepsionist/addRoomRecepsionist/${currentUserId}`, dto);
        alert("Receptionist added successfully");
      }
      setForm({ userID: "", shift: "" });
      setEditingId(null);
      fetchRecepsionists();
    } catch (err) {
      const msg =
        err.response?.data?.title ||
        err.response?.data?.errors ||
        err.message ||
        "Submit failed";
      setError(JSON.stringify(msg));
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <aside className="text-white p-4" style={{ width: "240px", backgroundColor: "#324b6b" }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-people"></i> HotelMS
        </h4>
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
              localStorage.removeItem("token");
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

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label htmlFor="userID" className="form-label">
              User
            </label>
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
            <label htmlFor="shift" className="form-label">
              Shift
            </label>
            <select
              id="shift"
              name="shift"
              className="form-select"
              value={form.shift}
              onChange={handleChange}
            >
              <option value="">-- Select Shift --</option>
              {shifts.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receps.map((r) => (
                <tr key={r.roomReceptionistID}>
                  <td>{r.roomReceptionistID}</td>
                  <td>
                    {r.firstName} {r.lastName}
                  </td>
                  <td>{r.email}</td>
                  <td>{r.shift}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(r)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(r.roomReceptionistID)}>
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
