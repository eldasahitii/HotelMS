import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';

// Make sure axios interceptor adds token globally in your app (or add here)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

const RoomReceptionistDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomStatuses, setRoomStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllData() {
      try {
        const [typesRes, statusesRes, roomsRes] = await Promise.all([
          axios.get('https://localhost:7117/api/RoomType/GetAllRoomTypes'),
          axios.get('https://localhost:7117/api/RoomStatus/getAllRoomsStatuses', {
            params: { role: 'RoomReceptionist' }  // pass role here
          }),
          axios.get('https://localhost:7117/api/Room/GetAllRooms'),
        ]);
        setRoomTypes(typesRes.data);
        setRoomStatuses(statusesRes.data);
        setRooms(roomsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  const getRoomTypeName = (id) => {
    const type = roomTypes.find(t => Number(t.roomTypeID) === Number(id));
    return type ? type.name : 'N/A';
  };

  const getRoomStatusName = (id) => {
    const status = roomStatuses.find(s => Number(s.roomStatusID) === Number(id));
    return status ? status.roomStatusName : 'N/A';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleReservation = () => {
    navigate('/admin/reservation-dashboard');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status" aria-label="Loading...">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!rooms.length) {
    return (
      <div className="text-center mt-5">
        <h4>No rooms found.</h4>
        <button className="btn btn-secondary mt-3" onClick={() => window.location.reload()}>
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f2f6fc' }}>
      <aside className="text-white p-4" style={{ width: 240, backgroundColor: '#324b6b' }}>
        <h4 className="fw-bold mb-4">
          <i className="bi bi-building"></i> HotelMS
        </h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <i className="bi bi-house-door me-2"></i> Room Overview
          </li>
          <button className="btn btn-outline-light w-100 mt-3 mb-3" onClick={handleReservation}>
            <i className="bi bi-bookmark-plus me-2"></i> Make Reservation
          </button>
          <button className="btn btn-outline-light w-100 mt-2" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </ul>
      </aside>

      <main className="flex-grow-1 p-4">
        <h2 className="fw-bold text-primary mb-4">
          <i className="bi bi-house-door me-2"></i>Room Receptionist
        </h2>

        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <i className="bi bi-house-door me-2"></i>Available Rooms
          </div>
          <div className="card-body p-0">
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Capacity</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.roomID}>
                    <td>{room.name}</td>
                    <td>{room.capacity}</td>
                    <td>{room.description}</td>
                    <td>{room.price}</td>
                    <td>
                      {room.imageUrl ? (
                        <img
                          src={room.imageUrl}
                          alt={room.name}
                          style={{ width: 100, height: 100, objectFit: 'cover' }}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>{getRoomStatusName(room.roomStatusID)}</td>
                    <td>{getRoomTypeName(room.roomTypeID)}</td>
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
