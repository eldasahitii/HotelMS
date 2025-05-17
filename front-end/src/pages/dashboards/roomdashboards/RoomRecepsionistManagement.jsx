import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const RoomRecepsionistManagement = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [newReceptionist, setNewReceptionist] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchReceptionists();
  }, []);

  const fetchReceptionists = async () => {
    try {
      const response = await axios.get('https://localhost:7117/api/Receptionist/GetAllReceptionists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReceptionists(response.data);
    } catch (error) {
      console.error('Error fetching receptionists:', error);
    }
  };

  const handleAddReceptionist = async () => {
    if (!newReceptionist.fullName || !newReceptionist.email || !newReceptionist.username || !newReceptionist.password) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      const payload = {
        FullName: newReceptionist.fullName,
        Email: newReceptionist.email,
        PhoneNumber: newReceptionist.phoneNumber,
        Username: newReceptionist.username,
        Password: newReceptionist.password,
      };
      await axios.post('https://localhost:7117/api/Receptionist/AddReceptionist', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Receptionist added successfully.');
      setMessageType('success');
      setNewReceptionist({
        fullName: '',
        email: '',
        phoneNumber: '',
        username: '',
        password: '',
      });
      fetchReceptionists();
    } catch (error) {
      console.error('Error adding receptionist:', error);
      alert('Failed to add receptionist.');
    }
  };

  const handleEdit = (rec) => {
    setEditingId(rec.receptionistID);
    setEditData({ ...rec });
  };

  const handleUpdateReceptionist = async () => {
    if (!editingId) return;
    try {
      await axios.put(`https://localhost:7117/api/Receptionist/UpdateReceptionist?id=${editingId}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      setEditData({});
      setMessage('Receptionist updated successfully.');
      setMessageType('success');
      fetchReceptionists();
    } catch (error) {
      console.error('Error updating receptionist:', error);
      alert('Failed to update receptionist.');
    }
  };

  const handleDeleteReceptionist = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this receptionist?');
    if (!isConfirmed) return;
    try {
      await axios.delete(`https://localhost:7117/api/Receptionist/DeleteReceptionist?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Receptionist deleted successfully.');
      setMessageType('success');
      fetchReceptionists();
    } catch (error) {
      console.error('Error deleting receptionist:', error);
      alert('Failed to delete receptionist.');
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-people"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <i className="bi bi-person-badge me-2"></i> Receptionist Management
          </li>
          <button
            className="btn btn-outline-light w-100 mt-3 mb-3"
            onClick={() => navigate('/room-manager-dashboard')}
          >
            <i className="bi bi-building me-2"></i> Room Manager
          </button>
          <button
            className="btn btn-outline-light w-100 mt-2"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-person-badge me-2"></i> Receptionist Management
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header bg-success text-white">
            <i className="bi bi-person-plus me-2"></i> Add New Receptionist
          </div>
          <div className="card-body">
            <input
              className="form-control mb-2"
              placeholder="Full Name"
              value={newReceptionist.fullName}
              onChange={(e) => setNewReceptionist({ ...newReceptionist, fullName: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Email"
              type="email"
              value={newReceptionist.email}
              onChange={(e) => setNewReceptionist({ ...newReceptionist, email: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Phone Number"
              value={newReceptionist.phoneNumber}
              onChange={(e) => setNewReceptionist({ ...newReceptionist, phoneNumber: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Username"
              value={newReceptionist.username}
              onChange={(e) => setNewReceptionist({ ...newReceptionist, username: e.target.value })}
            />
            <input
              className="form-control mb-2"
              placeholder="Password"
              type="password"
              value={newReceptionist.password}
              onChange={(e) => setNewReceptionist({ ...newReceptionist, password: e.target.value })}
            />

            <button className="btn btn-success w-100" onClick={handleAddReceptionist}>
              <i className="bi bi-check-circle me-2"></i> Add Receptionist
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-person-lines-fill me-2"></i> Receptionists List
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {receptionists.map((rec) => (
                  <tr key={rec.receptionistID}>
                    {editingId === rec.receptionistID ? (
                      <>
                        <td>
                          <input
                            className="form-control"
                            value={editData.fullName || ''}
                            onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            type="email"
                            value={editData.email || ''}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            value={editData.phoneNumber || ''}
                            onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            value={editData.username || ''}
                            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                          />
                        </td>
                        <td>
                          <button className="btn btn-success me-2" onClick={handleUpdateReceptionist}>
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button className="btn btn-secondary" onClick={() => setEditingId(null)}>
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{rec.fullName}</td>
                        <td>{rec.email}</td>
                        <td>{rec.phoneNumber}</td>
                        <td>{rec.username}</td>
                        <td>
                          <button className="btn btn-warning me-2" onClick={() => handleEdit(rec)}>
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button className="btn btn-danger" onClick={() => handleDeleteReceptionist(rec.receptionistID)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomRecepsionistManagement;
