import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const api = axios.create({
  baseURL: "https://localhost:7117/api",
  withCredentials: true,
});

export default function AddManager() {
  const navigate = useNavigate();

  const [managers, setManagers] = useState([]);
  const [managerTypes, setManagerTypes] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    managerTypeID: "",
    userID: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const fetchManagers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Manager/GetAllManagers");
      setManagers(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load managers");
      setLoading(false);
    }
  };

  const fetchManagerTypes = async () => {
    try {
      const res = await api.get("/Manager/GetManagerTypes");
      setManagerTypes(res.data);
    } catch {
      toast.error("Failed to load manager types");
    }
  };


  const fetchUsers = async () => {
    try {
      const res = await api.get("/User/GetAllCustomers");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchManagers();
    fetchManagerTypes();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };


  const findUserById = (id) => {
    if (!id) return null;
    const userFound = users.find((u) => u.userID === Number(id));
    return userFound || null;
  };

  const findManagerTypeName = (id) => {
    if (!id) return "";
    const mt = managerTypes.find((m) => m.managerTypeID === Number(id));
    return mt ? mt.name : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.managerTypeID || !form.userID) {
      toast.error("Please select both Manager Type and User");
      return;
    }

    const user = findUserById(form.userID);
    if (!user) {
      toast.error("Selected user not found");
      return;
    }

    const managerTypeName = findManagerTypeName(form.managerTypeID);
    if (!managerTypeName) {
      toast.error("Selected manager type not found");
      return;
    }

    const payload = {
      managerID: editingId || 0,
      userID: Number(form.userID),
      userFullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      managerTypeName: managerTypeName,
      managerTypeID: Number(form.managerTypeID),
      ...(editingId ? {} : { assignedAt: new Date().toISOString() }),
    };

    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/Manager/UpdateManager/${editingId}`, payload);
        toast.success("Manager updated successfully");
      } else {
        await api.post("/Manager/AddManager", payload);
        toast.success("Manager added successfully");
      }
      setForm({ managerTypeID: "", userID: "" });
      setEditingId(null);
      fetchManagers();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Request failed"
      );
    }
  };

  const handleEditClick = (manager) => {
    setEditingId(manager.managerID);
    setForm({
      managerTypeID: manager.managerTypeID.toString(),
      userID: manager.userID.toString(),
    });
    setError("");
  };

const handleDeleteClick = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this manager!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await api.delete(`/Manager/DeleteManager/${id}`);
      fetchManagers();
      toast.success("Manager deleted successfully");
    } catch (err) {
      toast.error("Delete failed: " + (err.response?.data || err.message));
    }
  }
};

  const handleCancel = () => {
    setEditingId(null);
    setForm({ managerTypeID: "", userID: "" });
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
          <li className="nav-item mb-3 text-white">
            <i className="bi bi-person-badge me-2"></i> Manager Management
          </li>
           <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/admin/room-types")}
          >
            <i className="bi bi-house-door me-2"></i> Add Room Type
          </button>
               <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/admin/roomstatus")}
          >
            <i className="bi bi-house-door me-2"></i> Add Room Status
          </button>
                                           <button
            className="btn btn-outline-light w-100 mb-3"
            onClick={() => navigate("/admin/reservationstatus")}
          >
            <i className="bi bi-house-door me-2"></i> Add Reservation Status
          </button>
          <button
            type="button"
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
            <div className="col-md-4">
              <label htmlFor="managerTypeID" className="form-label">
                Manager Type
              </label>
              <select
                id="managerTypeID"
                name="managerTypeID"
                className="form-select"
                value={form.managerTypeID}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Type --</option>
                {managerTypes.map((type) => (
                  <option key={type.managerTypeID} value={type.managerTypeID}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label htmlFor="userID" className="form-label">
                Select User
              </label>
              <select
                id="userID"
                name="userID"
                className="form-select"
                value={form.userID}
                onChange={handleChange}
                required
                 disabled={editingId !== null}
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user.userID} value={user.userID}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
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
                <th>Manager Type</th>
                <th>Manager Name</th>
                <th>Email</th>
                <th>Assigned At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => (
                <tr key={m.managerID}>
                  <td>{m.managerID}</td>
                  <td>{m.managerTypeName}</td>
                  <td>{m.userFullName}</td>
                  <td>{m.email}</td>
                  <td>{new Date(m.assignedAt).toLocaleString()}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleEditClick(m)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteClick(m.managerID)}
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
