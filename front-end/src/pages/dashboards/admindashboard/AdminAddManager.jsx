import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddManager() {
  const navigate = useNavigate();

  // State
  const [managers, setManagers] = useState([]);
  const [managerTypes, setManagerTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: 0, // For editing, 0 means new manager
    firstName: "",
    lastName: "",
    email: "",
    managerTypeId: "",
    userId: "", // NEW - selected user
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all managers
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/Manager/GetAllManagers");
      setManagers(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load managers");
      setLoading(false);
    }
  };

  // Fetch manager types
  const fetchManagerTypes = async () => {
    try {
      const res = await axios.get("/api/Manager/GetManagerTypes");
      setManagerTypes(res.data);
    } catch (err) {
      setError("Failed to load manager types");
    }
  };

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/User/GetAllCustomers");
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users");
    }
  };

  useEffect(() => {
    fetchManagers();
    fetchManagerTypes();
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit for add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.managerTypeId ||
      !form.userId
    ) {
      setError("Please fill in all fields, including selecting a user.");
      return;
    }

    try {
      const payload = {
        request: {
          id: editingId || 0,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          managerTypeId: parseInt(form.managerTypeId, 10),
        },
        userId: parseInt(form.userId, 10),
      };

      if (editingId) {
        // Update existing manager
        await axios.put(`/api/Manager/UpdateManager/${editingId}`, payload);
        alert("Manager updated successfully");
      } else {
        // Add new manager
        await axios.post("/api/Manager/AddManager", payload);
        alert("Manager added successfully");
      }

      setForm({
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        managerTypeId: "",
        userId: "",
      });
      setEditingId(null);
      fetchManagers();
    } catch (err) {
      const msg = err.response?.data || err.message || "Submit failed";
      setError(JSON.stringify(msg));
    }
  };

  // Fill form for editing
  const handleEditClick = (manager) => {
    setEditingId(manager.id);
    setForm({
      id: manager.id,
      firstName: manager.firstName,
      lastName: manager.lastName,
      email: manager.email,
      managerTypeId: manager.managerTypeId.toString(),
      userId: manager.userId ? manager.userId.toString() : "", // assuming manager object has userId
    });
    setError("");
  };

  // Delete manager
  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;
    try {
      await axios.delete(`/api/Manager/DeleteManager/${id}`);
      fetchManagers();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data || err.message));
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setForm({
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      managerTypeId: "",
      userId: "",
    });
    setError("");
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: "#f2f6fc" }}>
      <aside
        className="text-white p-4"
        style={{ width: "240px", backgroundColor: "#324b6b" }}
      >
        <h4 className="fw-bold mb-4">
          <i className="bi bi-people"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <i className="bi bi-person-badge me-2"></i> Manager Management
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
          <i className="bi bi-person-lines-fill me-2"></i> Manager Management
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-3">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-2">
              <label htmlFor="managerTypeId" className="form-label">
                Manager Type
              </label>
              <select
                id="managerTypeId"
                name="managerTypeId"
                className="form-select"
                value={form.managerTypeId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Type --</option>
                {managerTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col-md-4">
              <label htmlFor="userId" className="form-label">
                Select User
              </label>
              <select
                id="userId"
                name="userId"
                className="form-select"
                value={form.userId}
                onChange={handleChange}
                required
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Manager" : "Add Manager"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <h3>Existing Managers</h3>
        {loading ? (
          <p>Loading...</p>
        ) : managers.length === 0 ? (
          <p>No managers found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Manager Type</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.firstName} {m.lastName}</td>
                  <td>{m.email}</td>
                  <td>{managerTypes.find((t) => t.id === m.managerTypeId)?.name || "N/A"}</td>
                  <td>{users.find((u) => u.id === m.userId)?.firstName + " " + users.find((u) => u.id === m.userId)?.lastName || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleEditClick(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(m.id)}
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
