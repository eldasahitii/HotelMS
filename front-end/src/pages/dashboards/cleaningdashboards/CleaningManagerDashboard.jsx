import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function CleaningManagerDashboard() {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({ userID: '', shift: '', isActive: true, assignedByUserID: 1 });
  const [shiftFilter, setShiftFilter] = useState('');
  const [searchId, setSearchId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingStaff, setEditingStaff] = useState(null);
  const [editShift, setEditShift] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  const fetchData = async () => {
    try {
      const staffRes = await axios.get("/api/CleaningStaff/getAllCleaningStaff");
      setStaff(staffRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteStaff = async (id) => {
    try {
      await axios.delete(`/api/CleaningStaff/deleteCleaningStaff?id=${id}`);
      setMessage("Staff deleted successfully.");
      setMessageType("success");
      fetchData();
    } catch (err) {
      setMessage("Failed to delete staff.");
      setMessageType("danger");
    }
  };

  const openEditForm = (staff) => {
    setEditingStaff(staff);
    setEditShift(staff.shift);
    setEditIsActive(staff.isActive);
  };

  const handleConfirmUpdate = async () => {
    try {
      await axios.put(`/api/CleaningStaff/updateCleaningStaff?id=${editingStaff.cleaningStaffID}`, {
        ...editingStaff,
        shift: editShift,
        isActive: editIsActive
      });
      setMessage("Staff updated successfully.");
      setMessageType("success");
      setEditingStaff(null);
      fetchData();
    } catch (err) {
      setMessage("Failed to update staff.");
      setMessageType("danger");
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.userID || !newStaff.shift) {
      setMessage("Please provide both User ID and Shift.");
      setMessageType("danger");
      return;
    }

    const payload = {
      userID: parseInt(newStaff.userID),
      shift: newStaff.shift,
      isActive: newStaff.isActive,
      assignedByUserID: newStaff.assignedByUserID,
    };

    try {
      await axios.post("/api/CleaningStaff/addCleaningStaff", payload);
      setNewStaff({ userID: '', shift: '', isActive: true, assignedByUserID: 1 });
      setMessage("Staff added successfully.");
      setMessageType("success");
      fetchData();
    } catch (error) {
      console.error("Add staff failed:", error.response?.data || error.message);
      setMessage("Failed to add staff.");
      setMessageType("danger");
    }
  };

  const handleGetByShift = async () => {
    if (!shiftFilter) return;
    const result = await axios.get(`/api/CleaningStaff/getByShift?shift=${shiftFilter}`);
    setStaff(result.data);
  };

  const handleSearchById = async () => {
    if (!searchId) return;
    try {
      const res = await axios.get(`/api/CleaningStaff/getCleaningStaff?id=${searchId}`);
      setStaff(res.data ? [res.data] : []);
    } catch (error) {
      setMessage("Staff not found.");
      setMessageType("danger");
    }
  };

  const handleShowActive = async () => {
    const res = await axios.get("/api/CleaningStaff/getAllActive");
    setStaff(res.data);
  };
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('role');
  localStorage.removeItem('userID');
  localStorage.removeItem('name'); 
  navigate('/login'); 
};

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-building"></i> HotelMS</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
              <i className="bi bi-people-fill me-2"></i>Cleaning Staff
          </li>
          <Link to="/manager/assignments" className="nav-link text-white">
  <i className="bi bi-list-task me-2"></i>Assignments
</Link>
<hr className="text-white" />
<button className="btn btn-outline-light w-100" onClick={handleLogout}>
  <i className="bi bi-box-arrow-right me-2"></i> Logout
</button>
        </ul>
      </aside>
      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-people-fill me-2"></i>Cleaning Manager
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header" style={{ backgroundColor: '#5cb85c', color: '#fff' }}>
            <i className="bi bi-person-plus-fill me-2"></i>Add New Cleaning Staff
          </div>
          <div className="card-body">
            <input className="form-control mb-2" placeholder="User ID" value={newStaff.userID} onChange={e => setNewStaff({ ...newStaff, userID: e.target.value })} />
            <select className="form-control mb-2" value={newStaff.shift} onChange={e => setNewStaff({ ...newStaff, shift: e.target.value })}>
              <option value="">Select shift</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Night">Night</option>
            </select>
            <button className="btn btn-success w-100" onClick={handleAddStaff}><i className="bi bi-check-circle me-2"></i>Add Staff</button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex gap-2 mb-2">
              <input type="number" className="form-control" placeholder="Search by Staff ID" value={searchId} onChange={e => setSearchId(e.target.value)} />
              <button className="btn btn-outline-dark" onClick={handleSearchById}>
                <i className="bi bi-search"></i> Search
              </button>
              <button className="btn btn-outline-success" onClick={handleShowActive}>
                <i className="bi bi-person-check"></i> Show Active
              </button>
            </div>
            <input className="form-control mb-2" placeholder="Filter by shift..." value={shiftFilter} onChange={e => setShiftFilter(e.target.value)} />
            <button className="btn btn-outline-primary" onClick={handleGetByShift}><i className="bi bi-filter me-2"></i>Filter</button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header" style={{ backgroundColor: '#7ca8d8', color: '#fff' }}>
            <i className="bi bi-people-fill me-2"></i>Cleaning Staff
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Shift</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s, index) => (
                  <tr key={s.cleaningStaffID}>
                    <td>{index + 1}</td>
                    <td>{s.firstName} {s.lastName}</td>
                    <td>{s.email}</td>
                    <td>{s.shift}</td>
                    <td>{s.isActive ? "Active" : "Inactive"}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDeleteStaff(s.cleaningStaffID)}><i className="bi bi-trash"></i></button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditForm(s)}><i className="bi bi-pencil-square"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editingStaff && (
          <div className="card mt-4">
            <div className="card-header bg-warning text-dark">
              <i className="bi bi-pencil-square me-2"></i>Update Staff Info
            </div>
            <div className="card-body">
              <select className="form-control mb-2" value={editShift} onChange={e => setEditShift(e.target.value)}>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" checked={editIsActive} onChange={e => setEditIsActive(e.target.checked)} />
                <label className="form-check-label">Active</label>
              </div>
              <button className="btn btn-primary me-2" onClick={handleConfirmUpdate}><i className="bi bi-check2"></i> Save</button>
              <button className="btn btn-secondary" onClick={() => setEditingStaff(null)}><i className="bi bi-x"></i> Cancel</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
