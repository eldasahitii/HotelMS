import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function HostAssignmentDashboard() {
  const [hosts, setHosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [editingHost, setEditingHost] = useState(null);
  const [editData, setEditData] = useState({ firstName: '', lastName: '', email: '' });
  const [searchName, setSearchName] = useState('');


  const safeInputValue = (value) => value ?? '';

  useEffect(() => {
    fetchHosts();
    fetchUsers();
  }, []);

  const fetchHosts = async () => {
    try {
      const response = await axios.get("/api/HostManagement/getAllHosts");
      setHosts(response.data);
    } catch {
      toast.error("Failed to fetch hosts");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/User/GetAllCustomers", {
        withCredentials: true
      });
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users.");
    }
  };

  const handleAssignHostRole = async () => {
    if (!selectedUserEmail) return;
    try {
      await axios.post("/api/HostManagement/assignHostRole", { email: selectedUserEmail });
      toast.success("Host role assigned successfully.");
      setSelectedUserEmail("");
      fetchHosts();
    } catch (err) {
      toast.error(err.response?.data || "Failed to assign host role.");
    }
  };

  const handleDeleteHost = async (id) => {
    const result = await Swal.fire({
          title: 'Delete Host?',
          text: "Are you sure you want to remove this host?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, remove it',
          cancelButtonText: 'No'
        });
    
        if (!result.isConfirmed) return;
    try {
      await axios.delete(`/api/HostManagement/deleteHost/${id}`, {
        withCredentials: true
      });
      toast.success("Host deleted successfully.");
      fetchHosts();
    } catch {
      toast.error("Failed to delete host.");
    }
  };

  const openEditForm = (host) => {
    setEditingHost(host);
    setEditData({ firstName: host.firstName, lastName: host.lastName, email: host.email });
  };

  const handleConfirmUpdate = async () => {
    try {
      await axios.put(`/api/HostManagement/updateHost?id=${editingHost.userID}`, editData);
      toast.success("Host updated successfully.");
      setEditingHost(null);
      fetchHosts();
    } catch {
      toast.error("Failed to update host.");
    }
  };

  return (
    <div id="hosts">
      <h2 className="fw-bold text-primary mb-4">
        <i className="bi bi-people-fill me-2"></i>Host Management
      </h2>
        
              <ToastContainer position="top-right" autoClose={3000} />
        

      <div className="card mb-4">
        <div className="card-header bg-info text-white">
          <i className="bi bi-person-plus-fill me-2"></i>Assign Host Role to Existing User
        </div>
        <div className="card-body">
          <select
            className="form-select mb-3"
            value={selectedUserEmail}
            onChange={(e) => setSelectedUserEmail(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.userID} value={user.email}>
                {user.firstName} {user.lastName} ({user.email})
              </option>
            ))}
          </select>
          <button
            className="btn btn-info w-100"
            disabled={!selectedUserEmail}
            onClick={handleAssignHostRole}
          >
            Assign Host Role
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body d-flex gap-2 align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => fetchHosts()}
          >
            Search
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-primary text-white">
          <i className="bi bi-people-fill me-2"></i>All Hosts
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hosts
                .filter((h) =>
                  `${h.firstName} ${h.lastName}`
                    .toLowerCase()
                    .includes(searchName.toLowerCase())
                )
                .map((host, index) => (
                  <tr key={host.userID}>
                    <td>{index + 1}</td>
                    <td>{host.firstName} {host.lastName}</td>
                    <td>{host.email}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => handleDeleteHost(host.userID)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => openEditForm(host)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingHost && (
        <div className="card mt-4">
          <div className="card-header bg-warning text-dark">
            <i className="bi bi-pencil-square me-2"></i>Edit Host
          </div>
          <div className="card-body">
            <input
              className="form-control mb-2"
              placeholder="First Name"
              value={safeInputValue(editData.firstName)}
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Last Name"
              value={safeInputValue(editData.lastName)}
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Email"
              value={safeInputValue(editData.email)}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />
            <button className="btn btn-primary me-2" onClick={handleConfirmUpdate}>
              <i className="bi bi-check2"></i> Save
            </button>
            <button className="btn btn-secondary" onClick={() => setEditingHost(null)}>
              <i className="bi bi-x"></i> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}