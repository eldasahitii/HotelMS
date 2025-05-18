import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from "react-router-dom";

export default function AssignmentsDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [cleaningStaffList, setCleaningStaffList] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ roomID: '', cleaningStaffID: '', status: 'Pending', assignedByUserID: 2 });
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editRoomID, setEditRoomID] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/api/CleaningAssignment/getAllAssignments");
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCleaningStaff = async () => {
    try {
      const res = await axios.get("/api/CleaningStaff/getAllCleaningStaff");
      setCleaningStaffList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchCleaningStaff();
  }, []);

  const handleAddAssignment = async () => {
    const parsedAssignment = {
      roomID: parseInt(newAssignment.roomID),
      cleaningStaffID: parseInt(newAssignment.cleaningStaffID),
      status: newAssignment.status,
      assignedByUserID: newAssignment.assignedByUserID
    };

    if (isNaN(parsedAssignment.roomID) || isNaN(parsedAssignment.cleaningStaffID)) {
      setMessage("Room ID and Cleaning Staff ID must be numbers.");
      setMessageType("danger");
      return;
    }

    try {
      await axios.post("/api/CleaningAssignment/addAssignment", parsedAssignment);
      setMessage("Assignment added successfully.");
      setMessageType("success");
      setNewAssignment({ roomID: '', cleaningStaffID: '', status: 'Pending', assignedByUserID: 2 });
      fetchAssignments();
    } catch (err) {
      const error = err.response?.data?.message || "Failed to add assignment.";
      setMessage(error);
      setMessageType("danger");
    }
  };

  const handleConfirmUpdate = async () => {
    const updated = { roomID: parseInt(editRoomID) };
    try {
      await axios.put(`/api/CleaningAssignment/updateAssignment?id=${editingAssignment.cleaningAssignmentID}`, updated);
      setMessage("Assignment updated successfully.");
      setMessageType("success");
      setEditingAssignment(null);
      fetchAssignments();
    } catch (err) {
      setMessage("Failed to update assignment.");
      setMessageType("danger");
    }
  };

  const handleCancelAssignment = async (id) => {
    try {
      await axios.put(`/api/CleaningAssignment/cancelAssignment?id=${id}`);
      fetchAssignments();
    } catch (err) {
      setMessage("Failed to cancel assignment.");
      setMessageType("danger");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/CleaningAssignment/deleteAssignment?id=${id}`);
      fetchAssignments();
    } catch (err) {
      setMessage("Failed to delete assignment.");
      setMessageType("danger");
    }
  };

  const openEditForm = (assignment) => {
    setEditingAssignment(assignment);
    setEditRoomID(assignment.roomID);
  };

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-4" style={{ minWidth: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-building"></i> HotelMS</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/manager/cleaning-staff" className="nav-link text-white">
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

      <main className="flex-grow-1 p-3">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-list-task me-2"></i>Cleaning Assignments
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header" style={{ backgroundColor: '#5cb85c', color: '#fff' }}>
            <i className="bi bi-plus-circle me-2"></i>Add New Assignment
          </div>
          <div className="card-body">
            <div className="row g-2">
              <div className="col-12 col-md-6">
                <input className="form-control" placeholder="Room ID" value={newAssignment.roomID}
                  onChange={e => setNewAssignment({ ...newAssignment, roomID: e.target.value })} />
              </div>
              <div className="col-12 col-md-6">
                <select className="form-control" value={newAssignment.cleaningStaffID}
                  onChange={e => setNewAssignment({ ...newAssignment, cleaningStaffID: e.target.value })}>
                  <option value="">Select Cleaning Staff</option>
                  {cleaningStaffList.map(staff => (
                    <option key={staff.cleaningStaffID} value={staff.cleaningStaffID}>
                      {staff.firstName} {staff.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn btn-success w-100 mt-3" onClick={handleAddAssignment}>
              <i className="bi bi-check-circle me-2"></i>Add Assignment
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ backgroundColor: '#7ca8d8', color: '#fff' }}>
            <i className="bi bi-table me-2"></i>Assignments List
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Room</th>
                    <th>Staff</th>
                    <th>Status</th>
                    <th>Assigned</th>
                    <th>Started</th>
                    <th>Finished</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.cleaningAssignmentID}>
                      <td>{a.cleaningAssignmentID}</td>
                      <td>{a.roomName}</td>
                      <td>{a.staffName}</td>
                      <td>
                        <span className={`badge ${
                          a.status === 'Completed' ? 'bg-success' :
                          a.status === 'InProgress' ? 'bg-info' :
                          a.status === 'Pending' ? 'bg-secondary' :
                          'bg-light text-dark'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>{a.assignedAt?.split('T')[0]}</td>
                      <td>{a.startedAt?.split('T')[0] || '-'}</td>
                      <td>{a.finishedAt?.split('T')[0] || '-'}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => openEditForm(a)}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-warning" onClick={() => handleCancelAssignment(a.cleaningAssignmentID)}>
                            <i className="bi bi-x-circle"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.cleaningAssignmentID)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {editingAssignment && (
          <div className="card mt-4">
            <div className="card-header bg-warning text-dark">
              <i className="bi bi-pencil-square me-2"></i>Update Assignment Room
            </div>
            <div className="card-body">
              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <input className="form-control" placeholder="Room ID" value={editRoomID}
                    onChange={e => setEditRoomID(e.target.value)} />
                </div>
                <div className="col-12 col-md-6 d-flex align-items-end">
                  <button className="btn btn-primary me-2 w-100" onClick={handleConfirmUpdate}>
                    <i className="bi bi-check2"></i> Save
                  </button>
                  <button className="btn btn-secondary w-100" onClick={() => setEditingAssignment(null)}>
                    <i className="bi bi-x"></i> Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
