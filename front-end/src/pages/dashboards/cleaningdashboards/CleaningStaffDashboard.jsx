import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from "react-router-dom";

export default function AssignmentsByName() {
  const [assignments, setAssignments] = useState([]);
  const [staffName, setStaffName] = useState("");
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const fetchAllAssignments = async () => {
    try {
      const res = await axios.get("/api/CleaningAssignment/getAllAssignments");
      setAssignments(res.data);
    } catch (err) {
      setMessage("Error fetching all assignments.");
      setMessageType("danger");
    }
  };

  useEffect(() => {
    fetchAllAssignments();
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!staffName.trim()) {
      fetchAllAssignments();
      return;
    }
    try {
      const res = await axios.get(`/api/CleaningAssignment/getAssignmentsByStaffName?name=${encodeURIComponent(staffName)}`);
      setAssignments(res.data);
      setMessage(res.data.length ? '' : "No assignments found.");
      setMessageType(res.data.length ? '' : "info");
    } catch (err) {
      setMessage("Error fetching assignments.");
      setMessageType("danger");
    }
  };

  const handleStart = async (id) => {
    try {
      await axios.put(`/api/CleaningAssignment/startAssignment?id=${id}`);
      handleSearch({ preventDefault: () => {} });
    } catch {
      setMessage("Failed to start assignment.");
      setMessageType("danger");
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`/api/CleaningAssignment/markAssignmentCompleted?id=${id}`);
      handleSearch({ preventDefault: () => {} });
    } catch {
      setMessage("Failed to complete assignment.");
      setMessageType("danger");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-3" style={{ minWidth: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4"><i className="bi bi-building"></i> HotelMS</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2"><i className="bi bi-person-lines-fill me-2"></i>Dashboard</li>
          <hr className="text-white" />
          <button className="btn btn-outline-light w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>

      <main className="flex-grow-1 p-3">
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

        {message && <div className={`alert alert-${messageType}`}>{message}</div>}

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
                    <th>Started</th>
                    <th>Finished</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a, index) => (
                    <tr key={a.cleaningAssignmentID}>
                      <td>{index + 1}</td>
                      <td>{a.roomName}</td>
                      <td>{a.staffName}</td>
                      <td>
                        <span className={`badge ${a.status === 'Completed' ? 'bg-success' : a.status === 'InProgress' ? 'bg-info' : 'bg-secondary'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>{a.assignedAt ? new Date(a.assignedAt).toLocaleString() : '-'}</td>
                      <td>{a.startedAt ? new Date(a.startedAt).toLocaleString() : '-'}</td>
                      <td>{a.finishedAt ? new Date(a.finishedAt).toLocaleString() : '-'}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleStart(a.cleaningAssignmentID)}
                            disabled={a.status !== 'Pending'}
                          >
                            <i className="bi bi-play-fill"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleComplete(a.cleaningAssignmentID)}
                            disabled={a.status !== 'InProgress'}
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
      </main>
    </div>
  );
}
