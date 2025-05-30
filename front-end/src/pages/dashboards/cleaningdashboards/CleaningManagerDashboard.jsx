import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Select from "react-select";


export default function CleaningManagerDashboard() {
  const [staff, setStaff] = useState([]);
  const [users, setUsers] = useState([]);
  const [newStaff, setNewStaff] = useState({ userID: '', shift: '', isActive: true, assignedByUserID: ''});
  const [shiftFilter, setShiftFilter] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [editingStaff, setEditingStaff] = useState(null);
  const [editShift, setEditShift] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  const [role, setRole] = useState('CleaningManager');

  useEffect(() => { 
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const staffRes = await axios.get("/api/CleaningStaff/getAllCleaningStaff", { withCredentials: true });
      setStaff(staffRes.data);

      const usersRes = await axios.get("/api/User/getAll", { withCredentials: true });
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      await axios.delete(`/api/CleaningStaff/deleteCleaningStaff?id=${id}`, { withCredentials: true });
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
      await axios.put(
        `/api/CleaningStaff/updateCleaningStaff?id=${editingStaff.cleaningStaffID}`,
        {
          ...editingStaff,
          shift: editShift,
          isActive: editIsActive
        },
        { withCredentials: true }
      );
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
      setMessage("Please select User and Shift.");
      setMessageType("danger");
      return;
    }
    try {
      await axios.post(
        "/api/CleaningStaff/addCleaningStaff",
        {
          userID: parseInt(newStaff.userID),
          shift: newStaff.shift,
          isActive: newStaff.isActive,
          assignedByUserID: newStaff.assignedByUserID
        },
        { withCredentials: true }
      );
      setNewStaff({ userID: '', shift: '', isActive: true, assignedByUserID: 1 });
      setMessage("Staff added successfully.");
      setMessageType("success");
      fetchData();
    } catch (error) {
      setMessage("Failed to add staff.");
      setMessageType("danger");
    }
  };

  const handleGetByShift = async () => {
    if (!shiftFilter) return;
    try {
      const result = await axios.get(`/api/CleaningStaff/getByShift?shift=${shiftFilter}`, { withCredentials: true });
      setStaff(result.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to filter by shift.");
      setMessageType("danger");
    }
  };

  const handleShowActive = async () => {
    try {
      if (staff.length && staff.every(s => s.isActive)) {
        const allStaff = await axios.get("/api/CleaningStaff/getAllCleaningStaff", { withCredentials: true });
        setStaff(allStaff.data);
      } else {
        const activeStaff = await axios.get("/api/CleaningStaff/getAllActive", { withCredentials: true });
        setStaff(activeStaff.data);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to load staff.");
      setMessageType("danger");
    }
  };

  return (
    <>
      
      <main className="p-3" style={{ backgroundColor: '#f2f6fc', minHeight: '100vh' }}>
        <h2 className="fw-bold text-primary mb-4"><i className="bi bi-people-fill me-2"></i>Cleaning Manager</h2>

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
            <div className="row g-2">
              <div className="col-md-6">
                <Select
                  options={users
                    .filter(u => u.roleType === "Customer")
                    .map(user => ({
                      value: user.userID,
                      label: `${user.firstName} ${user.lastName}`
                    }))}
                  value={users
                    .filter(u => u.roleType === "Customer")
                    .map(user => ({
                      value: user.userID,
                      label: `${user.firstName} ${user.lastName}`
                    }))
                    .find(option => option.value.toString() === newStaff.userID)
                  }
                  onChange={(selectedOption) => {
                    setNewStaff({ ...newStaff, userID: selectedOption?.value.toString() });
                  }}
                  placeholder="Select User..."
                  isClearable
                />
                {newStaff.userID && (
                  <div className="mt-2">
                    <strong>Email: </strong> {users.find(u => u.userID.toString() === newStaff.userID)?.email}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <select
                  className="form-control"
                  value={newStaff.shift}
                  onChange={e => setNewStaff({ ...newStaff, shift: e.target.value })}
                >
                  <option value="">Select shift</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
              </div>
            </div>
            <button className="btn btn-success w-100 mt-2" onClick={handleAddStaff}>
              <i className="bi bi-check-circle me-2"></i>Add Staff
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-2 mb-2">
              <div className="col-md-9">
                <input
                  className="form-control"
                  placeholder="Filter by shift..."
                  value={shiftFilter}
                  onChange={e => setShiftFilter(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <button className="btn btn-outline-primary w-100" onClick={handleGetByShift}>
                  <i className="bi bi-filter me-2"></i>Filter
                </button>
              </div>
              <button
                className="btn btn-outline-success w-100 mt-2 py-2"
                style={{ height: '48px', fontWeight: 500 }}
                onClick={handleShowActive}
              >
                <i className="bi bi-person-check me-2"></i> Show Active
              </button>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header" style={{ backgroundColor: '#7ca8d8', color: '#fff' }}>
            <i className="bi bi-people-fill me-2"></i>Cleaning Staff
          </div>
          <div className="table-responsive">
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
            <div className="card-header bg-warning text-dark"><i className="bi bi-pencil-square me-2"></i>Update Staff Info</div>
            <div className="card-body">
              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <select className="form-control" value={editShift} onChange={e => setEditShift(e.target.value)}>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={editIsActive} onChange={e => setEditIsActive(e.target.checked)} />
                    <label className="form-check-label">Active</label>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary me-2" onClick={handleConfirmUpdate}><i className="bi bi-check2"></i> Save</button>
              <button className="btn btn-secondary" onClick={() => setEditingStaff(null)}><i className="bi bi-x"></i> Cancel</button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
