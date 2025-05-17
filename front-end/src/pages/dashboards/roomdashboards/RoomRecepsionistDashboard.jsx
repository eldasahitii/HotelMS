import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

const RoomReceptionistDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRooms();
    fetchRoomStatuses();
    fetchRoomTypes();
  }, []);

  const getRoleFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (e) {
      return null;
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get('https://localhost:7117/api/Room/GetAllRooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setMessage('Failed to load rooms.');
      setMessageType('danger');
    }
  };

  const fetchRoomStatuses = async () => {
    try {
      const role = getRoleFromToken();
      const response = await axios.get(`https://localhost:7117/api/RoomStatus/getAllRoomsStatuses?role=${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoomStatuses(response.data);
    } catch (error) {
      console.error('Error fetching room statuses:', error);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('https://localhost:7117/api/RoomType/GetAllRoomTypes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoomTypes(response.data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-4" style={{ width: '240px', backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <i className="bi bi-person-lines-fill me-2"></i> Room Receptionist
          </li>
          <button
            className="btn btn-outline-light w-100 mt-3 mb-3"
            onClick={() => navigate('/receptionist/reservation-dashboard')}
          >
            <i className="bi bi-bookmark-plus me-2"></i> Reservation Dashboard
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
          <i className="bi bi-person-lines-fill me-2"></i>Room Receptionist Dashboard
        </h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-door-open me-2"></i> Rooms Overview
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Images</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.roomID}>
                    <td>{room.name}</td>
                    <td>{room.capacity}</td>
                    <td>{room.roomStatus?.roomStatusName || 'N/A'}</td>
                    <td>{room.roomType?.name || 'N/A'}</td>
                    <td>${room.price}</td>
                    <td>
                      {room.roomImages && room.roomImages.length > 0 ? (
                        room.roomImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img.imageUrl}
                            alt={`Room ${room.name} Image ${idx + 1}`}
                            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '5px' }}
                          />
                        ))
                      ) : (
                        <span>No Images</span>
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
};

export default RoomReceptionistDashboard;
