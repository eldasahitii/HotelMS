import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function CleaningStaffDashboard({ staffId }) {
  const [assignments, setAssignments] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`/api/CleaningAssignment/getForStaff?staffId=${staffId}`);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [staffId]);

  const handleStart = async (id) => {
    try {
      await axios.put(`/api/CleaningAssignment/startAssignment?id=${id}`);
      fetchAssignments();
    } catch (err) {
      setMessage("Failed to start assignment.");
      setMessageType("danger");
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`/api/CleaningAssignment/markCompleted?id=${id}`);
      fetchAssignments();
    } catch (err) {
      setMessage("Failed to complete assignment.");
      setMessageType("danger");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-primary mb-4">
        <i className="bi bi-list-task me-2"></i>My Cleaning Assignments
      </h2>

      {message && (
        <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      <div className="card">
        <div className="card-header bg-info text-white">
          <i className="bi bi-table me-2"></i>Assignment List
        </div>
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Room</th>
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
                  <td>{a.status}</td>
                  <td>{a.assignedAt?.split('T')[0]}</td>
                  <td>{a.startedAt?.split('T')[0] || '-'}</td>
                  <td>{a.finishedAt?.split('T')[0] || '-'}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleStart(a.cleaningAssignmentID)} disabled={a.status !== 'Pending'}>
                        <i className="bi bi-play"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-success" onClick={() => handleComplete(a.cleaningAssignmentID)} disabled={a.status !== 'InProgress'}>
                        <i className="bi bi-check2-circle"></i>
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
  );
}
