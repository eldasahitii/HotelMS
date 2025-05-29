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
  const [loggedInUserID, setLoggedInUserID] = useState(null);
  const [currentCleaningStaffID, setCurrentCleaningStaffID] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

  useEffect(() => {
    fetchCurrentUser();
    fetchAllAssignments();
    if (inputRef.current) inputRef.current.focus();

    const handleResize = () => {
      const largeScreen = window.innerWidth >= 992;
      setIsLargeScreen(largeScreen);
      if (largeScreen) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('/api/Auth/me', { withCredentials: true });
      setLoggedInUserID(parseInt(res.data.userId || res.data.userID));
    } catch (error) {
      console.error("Failed to get current user info", error);
      setMessage("You must be logged in to view assignments.");
      setMessageType("danger");
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
        console.error("Failed to resolve cleaningStaffID", err);
      }
    };

    resolveCurrentCleaningStaffID();
  }, [loggedInUserID]);

  const fetchAllAssignments = async () => {
    try {
      const res = await axios.get("/api/CleaningAssignment/getAllAssignments");
      setAssignments(res.data);
    } catch (err) {
      setMessage("Error fetching all assignments.");
      setMessageType("danger");
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
      handleSearch({ preventDefault: () => { } });
    } catch {
      setMessage("Failed to start assignment.");
      setMessageType("danger");
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`/api/CleaningAssignment/markAssignmentCompleted?id=${id}`);
      handleSearch({ preventDefault: () => { } });
    } catch {
      setMessage("Failed to complete assignment.");
      setMessageType("danger");
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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
        className="text-white p-3 position-fixed top-0 vh-100"
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
          <li className="nav-item mb-2">
            <i className="bi bi-person-lines-fill me-2"></i>Dashboard
          </li>
          <hr className="text-white" />
          <button className="btn btn-outline-light w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
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
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleStart(a.cleaningAssignmentID)}
                            disabled={a.status !== 'Pending' || a.cleaningStaffID !== currentCleaningStaffID}
                            title={a.cleaningStaffID !== loggedInUserID ? "You cannot start another staff's assignment" : ""}
                          >
                            <i className="bi bi-play-fill"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
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
      </main>
    </div>
  );
}
