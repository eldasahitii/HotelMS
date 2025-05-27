import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const shifts = ["Morning", "Afternoon", "Night"];

export default function RoomReceptionistManager() {
  const navigate = useNavigate();

  // Read userId from localStorage
  const currentUserId = parseInt(localStorage.getItem("userId"), 10);
  const [currentUserName, setCurrentUserName] = useState("");

  const [users, setUsers] = useState([]);
  const [receps, setReceps] = useState([]);
  const [form, setForm] = useState({ userID: "", shift: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch current user full name by ID
  const fetchCurrentUserInfo = async () => {
    try {
      const res = await axios.get(`/api/User`, { params: { id: currentUserId } });
      const user = res.data;
      setCurrentUserName(`${user.firstName} ${user.lastName}`);
    } catch (err) {
      setError("Failed to load current user info");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/User/getAllCustomers");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load customers");
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

  useEffect(() => {
    if (currentUserId) {
      fetchCurrentUserInfo();
    }
    fetchUsers();
    fetchRecepsionists();
  }, []);

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
  if (!currentUserId || !currentUserName) {
    setError("Current user ID or name is not set.");
    return;
  }

  try {
    if (editingId) {
      console.log("editingId:", editingId, typeof editingId);
      console.log("receps IDs:", receps.map((r) => r.roomReceptionistID));

      // Make sure to convert editingId to number for comparison
      const existingRecep = receps.find((r) => r.roomReceptionistID === Number(editingId));
      if (!existingRecep) {
        setError("Receptionist to update not found.");
        return;
      }

      // Build update DTO with all required fields
      const updateDto = {
        roomReceptionistID: existingRecep.roomReceptionistID,
        userID: existingRecep.userID,
        firstName: existingRecep.firstName,
        lastName: existingRecep.lastName,
        email: existingRecep.email,
        shift: form.shift,
        assignedByUserID: existingRecep.assignedByUserID,
        assignedByUserName: existingRecep.assignedByUserName,
        assignedAt: existingRecep.assignedAt,
      };

      await axios.put(`/api/RoomRecepsionist/updateRoomRecepsionist/${existingRecep.roomReceptionistID}`, updateDto);
      alert("Receptionist updated successfully");
    } else {
      // Adding new receptionist
      const selectedUser = users.find((u) => u.userID.toString() === form.userID);
      if (!selectedUser) {
        setError("Selected user not found.");
        return;
      }

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


const formatDateTime = (dateString) => {
  if (!dateString) return "";

  let isoString = dateString;
  if (!dateString.endsWith('Z')) {
    isoString = dateString + 'Z';
  }

  const dt = new Date(isoString);

  if (isNaN(dt)) return "";

  return dt.toLocaleString(undefined, { timeZoneName: 'short' });
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

          <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/manager/room-dashboard")}
          >
            <i className="bi bi-house-door me-2"></i> Room Management
          </button>

          <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/admin/reservation-dashboard")}
          >
            <i className="bi bi-journal-check me-2"></i> Room Reservation List
          </button>

          <button
            className="btn btn-outline-light w-100 mt-2"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              localStorage.removeItem("userName");
              localStorage.removeItem("userRole");
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
                    <button className="btn btn-sm btn-info me-2" onClick={() => handleEditClick(r)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(r.roomReceptionistID)}
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
