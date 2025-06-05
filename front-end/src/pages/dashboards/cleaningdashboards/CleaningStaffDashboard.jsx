import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CleaningStaffDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [staffName, setStaffName] = useState("");
  const [loggedInUserID, setLoggedInUserID] = useState(null);
  const [currentCleaningStaffID, setCurrentCleaningStaffID] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentUser();
    fetchAllAssignments();
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('/api/Auth/me', { withCredentials: true });
      setLoggedInUserID(parseInt(res.data.userId || res.data.userID));
    } catch (error) {
      toast.error("You must be logged in to view assignments.");
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!loggedInUserID) return;

    const resolveCurrentCleaningStaffID = async () => {
      try {
        const res = await axios.get("/api/CleaningStaff/getAllCleaningStaff");
        const match = res.data.find(s => s.userID === loggedInUserID);
        if (match) setCurrentCleaningStaffID(match.cleaningStaffID);
      } catch (err) {
        toast.error("Failed to resolve cleaning staff.");
      }
    };

    resolveCurrentCleaningStaffID();
  }, [loggedInUserID]);

  const fetchAllAssignments = async () => {
    try {
      const res = await axios.get("/api/CleaningAssignment/getAllAssignments");
      setAssignments(res.data);
    } catch (err) {
      toast.error("Error fetching all assignments.");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedName = staffName.trim();
    if (!trimmedName) {
      fetchAllAssignments();
      return;
    }
    try {
      const res = await axios.get(`/api/CleaningAssignment/getAssignmentsByStaffName?name=${encodeURIComponent(trimmedName)}`);
      setAssignments(res.data);
      if (!res.data.length) toast.info("No assignments found.");
    } catch (err) {
      toast.error("Error fetching assignments.");
    }
  };

  const handleStart = async (id) => {
    try {
      await axios.put(`/api/CleaningAssignment/startAssignment?id=${id}`);
      handleSearch({ preventDefault: () => {} });
    } catch {
      toast.error("Failed to start assignment.");
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`/api/CleaningAssignment/markAssignmentCompleted?id=${id}`);
      handleSearch({ preventDefault: () => {} });
    } catch {
      toast.error("Failed to complete assignment.");
    }
  };

  return (
    <div className="container-fluid py-3 px-4" style={{ backgroundColor: '#f2f6fc', minHeight: '100vh' }}>
      <h2 className="text-primary fw-bold mb-4">
        <i className="bi bi-search me-2"></i>Cleaning Assignments
      </h2>

      <div className="card mb-4 shadow-sm">
        <div className="card-header" style={{ backgroundColor: '#5cb85c', color: '#fff' }}>
          <i className="bi bi-search me-2"></i>Search Assignments by Name
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} className="row g-2">
            <div className="col-12 col-md-8">
              <input
                ref={inputRef}
                className="form-control"
                type="text"
                placeholder="Enter full name"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <button type="submit" className="btn w-100" style={{ color: '#000000', border: '1px solid' }}>
                <i className="bi bi-search me-2"></i> Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <i className="bi bi-list-task me-2"></i>Assignment List
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Room</th>
                  <th>Staff</th>
                  <th>Status</th>
                  <th>Assigned</th>
                  <th>Assigned By</th>
                  <th>Started</th>
                  <th>Finished</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((a, index) => (
                  <tr key={a.cleaningAssignmentID}>
                    <td>{index + 1}</td>
                    <td>{a.roomName} (#{a.roomNumber})</td>
                    <td>{a.staffName}</td>
                    <td>
                      <span className={`badge ${a.status === 'Completed' ? 'bg-success' : a.status === 'InProgress' ? 'bg-info' : 'bg-secondary'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>{a.assignedAt ? new Date(a.assignedAt).toLocaleString() : '-'}</td>
                    <td>{a.assignedByName || '-'}</td>
                    <td>{a.startedAt ? new Date(a.startedAt).toLocaleString() : '-'}</td>
                    <td>{a.finishedAt ? new Date(a.finishedAt).toLocaleString() : '-'}</td>
                   <td>
                   <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary"
                    onClick={() => handleStart(a.cleaningAssignmentID)}
                     disabled={a.status !== 'Pending' || a.cleaningStaffID !== currentCleaningStaffID}
                    title={a.cleaningStaffID !== loggedInUserID ? "You cannot start another staff's assignment" : ""}
                    >
                     <i className="bi bi-play-fill"></i>
                       </button>
                       <button className="btn btn-sm btn-outline-success"
                       onClick={() => handleComplete(a.cleaningAssignmentID)}
                       disabled={a.status !== 'InProgress' || a.cleaningStaffID !== currentCleaningStaffID}
                       title={a.cleaningStaffID !== loggedInUserID ? "You cannot complete another staff's assignment" : ""}
                        >
                       <i className="bi bi-check-circle"></i>
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
    </div>
  );
}
