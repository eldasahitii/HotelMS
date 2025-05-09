import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";

export default function ManagerDashboard() {
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newStaff, setNewStaff] = useState({ userID: '', shift: '', isActive: true, assignedByUserID: 1 });
  const [newAssignment, setNewAssignment] = useState({ roomID: '', cleaningStaffID: '', status: 'Pending', assignedByUserID: 1 });
  const [shiftFilter, setShiftFilter] = useState('');
  const [searchId, setSearchId] = useState('');

  const fetchData = async () => {
    try {
      const staffRes = await axios.get("/api/CleaningStaff/getAllCleaningStaff");
      setStaff(staffRes.data);
      const assignmentRes = await axios.get("/api/CleaningAssignment/getAllAssignments");
      setAssignments(assignmentRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteStaff = async (id) => {
    await axios.delete(`/api/CleaningStaff/deleteCleaningStaff?id=${id}`);
    fetchData();
  };

  const handleUpdateStaff = async (staff) => {
    const updatedShift = prompt("Enter new shift:", staff.shift);
    const isActive = window.confirm("Should this staff be active?");
    if (!updatedShift) return;
    try {
      await axios.put(`/api/CleaningStaff/updateCleaningStaff?id=${staff.cleaningStaffID}`, {
        ...staff,
        shift: updatedShift,
        isActive: isActive
      });
      fetchData();
    } catch (err) {
      console.error("Failed to update staff", err);
    }
  };

  const handleDeleteAssignment = async (id) => {
    await axios.delete(`/api/CleaningAssignment/deleteAssignment?id=${id}`);
    fetchData();
  };

  const handleAddStaff = async () => {
  if (!newStaff.userID || !newStaff.shift) {
    alert("Please provide both User ID and Shift.");
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
    fetchData();
  } catch (error) {
    console.error("Add staff failed:", error.response?.data || error.message);
    alert("Server says: " + JSON.stringify(error.response?.data));
  }
};

  const handleAddAssignment = async () => {
    await axios.post("/api/CleaningAssignment/addAssignment", newAssignment);
    setNewAssignment({ roomID: '', cleaningStaffID: '', status: 'Pending', assignedByUserID: 1 });
    fetchData();
  };

  // const handleStartAssignment = async (id) => {
  //   await axios.put(`/api/CleaningAssignment/startAssignment?id=${id}`);
  //   fetchData();
  // };

  // const handleCompleteAssignment = async (id) => {
  //   await axios.put(`/api/CleaningAssignment/markAssignmentCompleted?id=${id}`);
  //   fetchData();
  // };

  const handleCancelAssignment = async (id) => {
    await axios.put(`/api/CleaningAssignment/cancelAssignment?id=${id}`);
    fetchData();
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
      alert("Staff not found");
    }
  };

  const handleShowActive = async () => {
    const res = await axios.get("/api/CleaningStaff/getAllActive");
    setStaff(res.data);
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-building"></i> HotelMS</h4>
        <ul className="nav flex-column">
      
         <li className="nav-item">
    <Link to="//" className="nav-link text-white">
      <i className="bi bi-people-fill me-2"></i>Cleaning Staff
    </Link>
  </li>
  <li className="nav-item">
    <Link to="/manager/assignments" className="nav-link text-white">
      <i className="bi bi-list-task me-2"></i>Assignments
    </Link>
  </li>
        </ul>
      </aside>
      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary"><i className="bi bi-speedometer2 me-2"></i>Cleaning Manager</h2>
        </div>

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
              <input
                type="number"
                className="form-control"
                placeholder="Search by Staff ID"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
              />
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
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => handleUpdateStaff(s)}><i className="bi bi-pencil-square"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ backgroundColor: '#a6b8cc', color: '#fff' }}>
            <i className="bi bi-list-task me-2"></i>Assignments
          </div>
          <div className="card-body">
            <div className="mb-3">
              <input className="form-control mb-2" placeholder="Room ID" value={newAssignment.roomID} onChange={e => setNewAssignment({ ...newAssignment, roomID: e.target.value })} />
              <input className="form-control mb-2" placeholder="Staff ID" value={newAssignment.cleaningStaffID} onChange={e => setNewAssignment({ ...newAssignment, cleaningStaffID: e.target.value })} />
              <button className="btn btn-success w-100" onClick={handleAddAssignment}><i className="bi bi-plus-circle me-2"></i>Add Assignment</button>
            </div>
            {assignments.map((a, idx) => (
              <div key={a.cleaningAssignmentID} className="border rounded p-3 mb-3 bg-white">
                <div className="fw-bold"><i className="bi bi-door-open me-2"></i>Room: {a.roomName}</div>
                <div><i className="bi bi-person me-2"></i>Staff: {a.staffName}</div>
                <div><i className="bi bi-info-circle me-2"></i>Status: {a.status}</div>
                <div className="text-muted"><i className="bi bi-calendar3 me-2"></i>Assigned: {new Date(a.assignedAt).toLocaleString()}</div>
                <div className="mt-2 d-flex gap-2 flex-wrap">
                  {/* <button className="btn btn-sm btn-primary" onClick={() => handleStartAssignment(a.cleaningAssignmentID)}><i className="bi bi-play-fill"></i> Start</button>
                  <button className="btn btn-sm btn-info" onClick={() => handleCompleteAssignment(a.cleaningAssignmentID)}><i className="bi bi-check2-circle"></i> Complete</button> */}
                  <button className="btn btn-sm btn-warning" onClick={() => handleCancelAssignment(a.cleaningAssignmentID)}><i className="bi bi-x-circle"></i> Cancel</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteAssignment(a.cleaningAssignmentID)}><i className="bi bi-trash"></i> Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
