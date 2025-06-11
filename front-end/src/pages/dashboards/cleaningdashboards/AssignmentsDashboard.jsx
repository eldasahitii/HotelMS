import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import 'react-toastify/dist/ReactToastify.css';

export default function AssignmentsDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [cleaningStaffList, setCleaningStaffList] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ roomID: '', cleaningStaffID: '', status: 'Pending', assignedByUserID: null });
  const [editingAssignmentID, setEditingAssignmentID] = useState(null);
  const [editRoomID, setEditRoomID] = useState('');
  const [userID, setUserID] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/Auth/me', { withCredentials: true });
        setUserID(parseInt(response.data.userId || response.data.userID || response.data.id || null));
      } catch {
        toast.error("You must be logged in.");
        navigate('/login');
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/api/CleaningAssignment/getAllAssignments", { withCredentials: true });
      setAssignments(res.data);
    } catch {
      toast.error("Failed to fetch assignments.");
    }
  };

  const fetchCleaningStaff = async () => {
    try {
      const res = await axios.get("/api/CleaningStaff/getAllCleaningStaff", { withCredentials: true });
      setCleaningStaffList(res.data);
    } catch {
      toast.error("Failed to fetch cleaning staff.");
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
    } catch {
      toast.error("Failed to fetch rooms.");
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
      toast.warn("Please select both a Room and a Cleaning Staff.");
      return;
    }
    if (!userID) {
      toast.error("User ID not found. Please log in again.");
      return;
    }
    try {
      await axios.post("/api/CleaningAssignment/addAssignment", {
        ...newAssignment,
        roomID: parseInt(newAssignment.roomID),
        cleaningStaffID: parseInt(newAssignment.cleaningStaffID),
        assignedByUserID: userID
      }, { withCredentials: true });
      toast.success("Assignment added successfully.");
      setNewAssignment({ roomID: '', cleaningStaffID: '', status: 'Pending', assignedByUserID: null });
      fetchAssignments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add assignment.");
    }
  };

  const startEdit = (assignment) => {
    setEditingAssignmentID(assignment.cleaningAssignmentID);
    setEditRoomID(assignment.roomID);
  };

  const handleConfirmUpdate = async () => {
    const assignment = assignments.find(a => a.cleaningAssignmentID === editingAssignmentID);
    if (!assignment) return;

    try {
      await axios.put(`/api/CleaningAssignment/updateAssignment?id=${editingAssignmentID}`, {
        roomID: parseInt(editRoomID),
        status: assignment.status,
        startedAt: assignment.startedAt,
        finishedAt: assignment.finishedAt
      }, { withCredentials: true });
      toast.success("Assignment updated.");
      setEditingAssignmentID(null);
      fetchAssignments();
    } catch {
      toast.error("Failed to update assignment.");
    }
  };

  const handleCancelAssignment = async (id) => {
    try {
      await axios.put(`/api/CleaningAssignment/cancelAssignment?id=${id}`, {}, { withCredentials: true });
      toast.success("Assignment cancelled.");
      fetchAssignments();
    } catch {
      toast.error("Failed to cancel assignment.");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the assignment.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/CleaningAssignment/deleteAssignment?id=${id}`, { withCredentials: true });
        toast.success("Assignment deleted successfully.");
        fetchAssignments();
      } catch {
        toast.error("Failed to delete assignment.");
      }
    }
  };

  const formatDateTime = (datetimeString) => {
    if (!datetimeString) return '-';
    return new Date(datetimeString).toLocaleString();
  };

  if (isLoadingUser) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <div>Loading user info...</div>
      </div>
    );
  }
 return (
    <div>
      <main className="p-3" style={{ backgroundColor: '#f2f6fc', minHeight: '100vh' }}>
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-list-task me-2"></i>Cleaning Assignments
        </h2>
        <div className="card mb-4">
          <div className="card-header" style={{ backgroundColor: '#5cb85c', color: '#fff' }}>
            <i className="bi bi-plus-circle me-2"></i>Add New Assignment
          </div>
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-6">
                <select className="form-control" value={newAssignment.roomID} onChange={e => setNewAssignment({ ...newAssignment, roomID: e.target.value })}>
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.roomID} value={room.roomID}>
                      Room #{room.roomNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <select className="form-control" value={newAssignment.cleaningStaffID} onChange={e => setNewAssignment({ ...newAssignment, cleaningStaffID: e.target.value })}>
                  <option value="">Select Cleaning Staff</option>
                  {cleaningStaffList.filter(s => s.isActive).map(s => (
                    <option key={s.cleaningStaffID} value={s.cleaningStaffID}>
                      {s.firstName} {s.lastName}
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
                    <td>
                      {editingAssignmentID === a.cleaningAssignmentID ? (
                        <select className="form-select form-select-sm" value={editRoomID} onChange={e => setEditRoomID(e.target.value)}>
                          <option value="">Select Room</option>
                          {rooms.map(room => (
                            <option key={room.roomID} value={room.roomID}>
                              Room #{room.roomNumber}
                            </option>
                          ))}
                        </select>
                      ) : (
                        `Room #${a.roomNumber}`
                      )}
                    </td>
                    <td>{a.staffName}</td>
                    <td><span className={`badge ${a.status === 'Completed' ? 'bg-success' : a.status === 'InProgress' ? 'bg-info' : 'bg-secondary'}`}>{a.status}</span></td>
                    <td>{formatDateTime(a.assignedAt)}</td>
                    <td>{formatDateTime(a.startedAt)}</td>
                    <td>{formatDateTime(a.finishedAt)}</td>
                    <td>
                      {editingAssignmentID === a.cleaningAssignmentID ? (
                        <>
                          <button className="btn btn-sm btn-dark me-2" onClick={handleConfirmUpdate}>Save</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditingAssignmentID(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => startEdit(a)} disabled={a.status !== 'Pending'}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-warning me-1" onClick={() => handleCancelAssignment(a.cleaningAssignmentID)} disabled={a.status !== 'Pending'}>
                            <i className="bi bi-x-circle"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.cleaningAssignmentID)} disabled={a.status === 'InProgress'}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
