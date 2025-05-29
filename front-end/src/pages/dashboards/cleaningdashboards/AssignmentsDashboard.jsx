import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';

export default function AssignmentsDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [cleaningStaffList, setCleaningStaffList] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ roomID: '', cleaningStaffID: '', status: 'Pending', assignedByUserID: null });
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editRoomID, setEditRoomID] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [userID, setUserID] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/Auth/me', { withCredentials: true });
        setUserID(parseInt(response.data.userId));
      } catch (err) {
        console.error('Failed to fetch current user', err);
        setMessage("You must be logged in.");
        setMessageType("danger");
        navigate('/login');
      }
    };

    fetchCurrentUser();

    const handleResize = () => {
      const largeScreen = window.innerWidth >= 992;
      setIsLargeScreen(largeScreen);
      if (largeScreen) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/api/CleaningAssignment/getAllAssignments", { withCredentials: true });
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCleaningStaff = async () => {
    try {
      const res = await axios.get("/api/CleaningStaff/getAllCleaningStaff", { withCredentials: true });
      setCleaningStaffList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get("/api/Room/getAllRooms", { withCredentials: true });
      const usedRoomIDs = new Set(assignments.filter(a => a.status === 'Pending' || a.status === 'InProgress').map(a => a.roomID));
      const availableRooms = res.data.filter(r =>
        (r.roomStatusID === 1 || r.roomStatusID === 2) &&
        r.roomID &&
        !usedRoomIDs.has(r.roomID)
      );
      setRooms(availableRooms);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchCleaningStaff();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [assignments]);

  const handleAddAssignment = async () => {
    if (!newAssignment.roomID || !newAssignment.cleaningStaffID) {
      setMessage("Please select both a Room and a Cleaning Staff.");
      setMessageType("danger");
      return;
    }
    if (!userID) {
      setMessage("User ID not found. Please log in again.");
      setMessageType("danger");
      return;
    }
    const parsedAssignment = {
      roomID: parseInt(newAssignment.roomID),
      cleaningStaffID: parseInt(newAssignment.cleaningStaffID),
      status: newAssignment.status,
      assignedByUserID: userID
    };
    try {
      await axios.post("/api/CleaningAssignment/addAssignment", parsedAssignment, { withCredentials: true });
      setMessage("Assignment added successfully.");
      setMessageType("success");
      setNewAssignment({ roomID: '', cleaningStaffID: '', status: 'Pending', assignedByUserID: null });
      fetchAssignments();
    } catch (err) {
      const error = err.response?.data?.message || "Failed to add assignment.";
      setMessage(error);
      setMessageType("danger");
    }
  };

  const openEditForm = (assignment) => {
    setEditingAssignment(assignment);
    setEditRoomID(assignment.roomID);
  };

  const handleConfirmUpdate = async () => {
    const updated = {
      roomID: parseInt(editRoomID),
      status: editingAssignment.status || "Pending",
      startedAt: editingAssignment.startedAt || null,
      finishedAt: editingAssignment.finishedAt || null
    };

    try {
      await axios.put(`/api/CleaningAssignment/updateAssignment?id=${editingAssignment.cleaningAssignmentID}`, updated, { withCredentials: true });
      setMessage("Assignment updated successfully.");
      setMessageType("success");
      setEditingAssignment(null);
      fetchAssignments();
    } catch (err) {
      const error = err.response?.data?.message || "Failed to update assignment.";
      setMessage(error);
      setMessageType("danger");
    }
  };

  const handleCancelAssignment = async (id) => {
    try {
      await axios.put(`/api/CleaningAssignment/cancelAssignment?id=${id}`, {}, { withCredentials: true });
      fetchAssignments();
    } catch (err) {
      setMessage("Failed to cancel assignment.");
      setMessageType("danger");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/CleaningAssignment/deleteAssignment?id=${id}`, { withCredentials: true });
      fetchAssignments();
    } catch (err) {
      setMessage("Failed to delete assignment.");
      setMessageType("danger");
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Helper to format date and time nicely
  const formatDateTime = (datetimeString) => {
    if (!datetimeString) return '-';
    const dateObj = new Date(datetimeString);
    return dateObj.toLocaleString();  // Shows date and time in local format
  };

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>

      {!isLargeScreen && (
        <button
          className="position-fixed"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          style={{
            zIndex: 1050,
            top: '12px',
            left: '12px',
            padding: '5px 8px',
            fontSize: '1.1rem',
            borderRadius: '5px',
            backgroundColor: '#324b6b',
            color: 'white',
            border: 'none',
          }}
        >
          <i className="bi bi-list"></i>
        </button>
      )}
      <aside
        className="text-white p-4 position-fixed top-0 vh-100"
        style={{
          minWidth: 240,
          backgroundColor: '#324b6b',
          zIndex: 1040,
          left: isLargeScreen ? 0 : (sidebarOpen ? 0 : -240),
          transition: 'left 0.3s ease-in-out',
          overflowY: 'auto',
        }}
      >
        <h4 className="fw-bold mb-4" style={{ paddingLeft: !isLargeScreen ? '40px' : 0 }}>
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link
              to="/manager/cleaning-staff"
              className="nav-link text-white"
              onClick={() => { if (!isLargeScreen) setSidebarOpen(false); }}
            >
              <i className="bi bi-people-fill me-2"></i>Cleaning Staff
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/manager/assignments"
              className="nav-link text-white"
              onClick={() => { if (!isLargeScreen) setSidebarOpen(false); }}
            >
              <i className="bi bi-list-task me-2"></i>Assignments
            </Link>
          </li>
          <hr className="text-white" />
          <button className="btn btn-outline-light w-100" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i> Logout</button>
        </ul>
      </aside>

      {!isLargeScreen && sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1030 }}
          onClick={toggleSidebar}
        />
      )}

      <main
        className="flex-grow-1 p-3"
        style={{
          marginLeft: isLargeScreen ? 240 : 0,
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
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
                <select
                  className="form-control"
                  value={newAssignment.roomID}
                  onChange={e => setNewAssignment({ ...newAssignment, roomID: e.target.value })}
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.roomID} value={room.roomID}>
                      {room.title} (#{room.roomNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <select
                  className="form-control"
                  value={newAssignment.cleaningStaffID}
                  onChange={e => setNewAssignment({ ...newAssignment, cleaningStaffID: e.target.value })}
                >
                  <option value="">Select Cleaning Staff</option>
                  {cleaningStaffList
                    .filter(staff => staff.isActive)
                    .map(staff => (
                      <option key={staff.cleaningStaffID} value={staff.cleaningStaffID}>
                        {staff.firstName} {staff.lastName}
                      </option>
                    ))
                  }
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
                      <td>{a.roomName} (#{a.roomNumber})</td>
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
                      <td>{formatDateTime(a.assignedAt)}</td>
                      <td>{formatDateTime(a.startedAt)}</td>
                      <td>{formatDateTime(a.finishedAt)}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openEditForm(a)}
                            disabled={a.status !== 'Pending'}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleCancelAssignment(a.cleaningAssignmentID)}
                            disabled={a.status !== 'Pending'}
                          >
                            <i className="bi bi-x-circle"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(a.cleaningAssignmentID)}
                            disabled={a.status === 'InProgress'}
                          >
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
                  <select className="form-control" value={editRoomID} onChange={e => setEditRoomID(e.target.value)}>
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                      <option key={room.roomID} value={room.roomID}>
                        {room.title} (#{room.roomNumber})
                      </option>
                    ))}
                  </select>
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
