import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Select from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "https://localhost:7117/api",
  withCredentials: true,
});

export default function AdminCleaningDashboard() {
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newStaff, setNewStaff] = useState({ userID: '', shift: '', isActive: true });
  const [editingStaffID, setEditingStaffID] = useState(null);
  const [editShift, setEditShift] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchStaff();
    fetchUsers();
    fetchAssignments();
    fetchRooms();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/Auth/me");
      setCurrentUserID(parseInt(res.data.userId || res.data.userID));
    } catch {
      toast.error("Failed to fetch current user");
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get("/CleaningStaff/getAllCleaningStaff");
      setStaff(res.data);
    } catch {
      toast.error("Failed to load cleaning staff");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/User/getAllCustomers");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const fetchAssignments = async () => {
    try {
      const res = await api.get("/CleaningAssignment/getAllAssignments");
      setAssignments(res.data);
    } catch {
      toast.error("Failed to load assignments");
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await api.get("/Room/getAllRooms");
      setRooms(res.data);
    } catch {
      toast.error("Failed to load rooms");
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.userID || !newStaff.shift || !currentUserID) {
      toast.warn("Select user and shift");
      return;
    }
    try {
      await api.post("/CleaningStaff/addCleaningStaff", {
        userID: parseInt(newStaff.userID),
        shift: newStaff.shift,
        isActive: newStaff.isActive,
        assignedByUserID: currentUserID
      });
      toast.success("Staff added successfully");
      setNewStaff({ userID: '', shift: '', isActive: true });
      fetchStaff();
    } catch {
      toast.error("Failed to add staff");
    }
  };

  const handleEditClick = (staff) => {
    setEditingStaffID(staff.cleaningStaffID);
    setEditShift(staff.shift);
    setEditIsActive(staff.isActive);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/CleaningStaff/updateCleaningStaff?id=${editingStaffID}`, {
        cleaningStaffID: editingStaffID,
        shift: editShift,
        isActive: editIsActive,
        assignedByUserID: currentUserID
      });
      toast.success("Staff updated successfully");
      setEditingStaffID(null);
      fetchStaff();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDeleteClick = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete staff?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/CleaningStaff/deleteCleaningStaff?id=${id}`);
      toast.success("Staff deleted");
      fetchStaff();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const formatDateTime = (datetimeString) => {
    if (!datetimeString) return '-';
    const dateObj = new Date(datetimeString);
    return dateObj.toLocaleString();
  };

  return (
    <div className="container-fluid py-3 px-4" style={{ backgroundColor: "#f2f6fc", minHeight: '100vh' }}>
      <h2 className="fw-bold text-primary mb-4">
        <i className="bi bi-tools me-2"></i> Admin Cleaning Dashboard
      </h2>

      {/* Add Staff Form */}
      <div className="card mb-4">
        <div className="card-header fw-semibold fs-5">
          <i className="bi bi-person-plus me-2"></i>Add Cleaning Staff
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Select User</label>
              <Select
                options={users.map(u => ({ value: u.userID, label: `${u.firstName} ${u.lastName}` }))}
                value={users.find(u => u.userID.toString() === newStaff.userID) ? { value: newStaff.userID, label: users.find(u => u.userID.toString() === newStaff.userID).firstName + ' ' + users.find(u => u.userID.toString() === newStaff.userID).lastName } : null}
                onChange={opt => setNewStaff({ ...newStaff, userID: opt?.value || '' })}
                placeholder="Select User..."
                isClearable
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Select Shift</label>
              <select className="form-select" value={newStaff.shift} onChange={e => setNewStaff({ ...newStaff, shift: e.target.value })}>
                <option value="">Select Shift</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
          <button className="btn btn-outline-dark fw-semibold mt-3 w-100" onClick={handleAddStaff}>
            <i className="bi bi-check-circle me-2"></i>Add Staff
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="card mb-4">
        <div className="card-header fw-semibold fs-5">
          <i className="bi bi-people me-2"></i>Cleaning Staff List
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Shift</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.cleaningStaffID}>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.email}</td>
                  <td>{editingStaffID === s.cleaningStaffID ? (
                    <select value={editShift} onChange={e => setEditShift(e.target.value)} className="form-select form-select-sm">
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Night">Night</option>
                    </select>
                  ) : (s.shift)}</td>
                  <td>{editingStaffID === s.cleaningStaffID ? (
                    <select value={editIsActive} onChange={e => setEditIsActive(e.target.value === 'true')} className="form-select form-select-sm">
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  ) : (s.isActive ? "Active" : "Inactive")}</td>
                  <td>{editingStaffID === s.cleaningStaffID ? (
                    <>
                      <button className="btn btn-sm btn-dark me-2" onClick={handleUpdate}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => setEditingStaffID(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleEditClick(s)}><i className="bi bi-pencil"></i></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(s.cleaningStaffID)}><i className="bi bi-trash"></i></button>
                    </>
                  )}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="card">
        <div className="card-header fw-semibold fs-5">
          <i className="bi bi-list-task me-2"></i>Assignments List
        </div>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Room</th>
                <th>Staff</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Assigned By</th>
                <th>Started</th>
                <th>Finished</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.cleaningAssignmentID}>
                  <td>{a.cleaningAssignmentID}</td>
                  <td>{a.roomName} (#{a.roomNumber})</td>
                  <td>{a.staffName}</td>
                  <td><span className={`badge ${a.status === 'Completed' ? 'bg-success' : a.status === 'InProgress' ? 'bg-info' : a.status === 'Pending' ? 'bg-secondary' : 'bg-light text-dark'}`}>{a.status}</span></td>
                  <td>{formatDateTime(a.assignedAt)}</td>
                  <td>{a.assignedByName || '-'}</td>
                  <td>{formatDateTime(a.startedAt)}</td>
                  <td>{formatDateTime(a.finishedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
